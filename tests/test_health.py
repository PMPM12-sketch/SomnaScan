import os
import sys

from fastapi.testclient import TestClient

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from server import create_app  # noqa: E402


def make_build(tmp_path):
    (tmp_path / "index.html").write_text("<html><body>SomnaScan</body></html>")
    (tmp_path / "static").mkdir()
    (tmp_path / "static" / "app.js").write_text("console.log(1)")
    return tmp_path


def test_health_without_a_build(tmp_path):
    client = TestClient(create_app(tmp_path / "missing"))
    r = client.get("/api/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok", "frontend_built": False}


def test_unknown_route_is_404_without_a_build(tmp_path):
    client = TestClient(create_app(tmp_path / "missing"))
    assert client.get("/anything").status_code == 404
    assert client.get("/api/does-not-exist").status_code == 404


def test_health_reports_built_frontend(tmp_path):
    client = TestClient(create_app(make_build(tmp_path)))
    assert client.get("/api/health").json() == {"status": "ok", "frontend_built": True}


def test_serves_index_and_assets(tmp_path):
    client = TestClient(create_app(make_build(tmp_path)))
    home = client.get("/")
    assert home.status_code == 200 and "SomnaScan" in home.text
    assert client.get("/static/app.js").status_code == 200


def test_unknown_page_falls_back_to_index(tmp_path):
    client = TestClient(create_app(make_build(tmp_path)))
    r = client.get("/some/deep/link")
    assert r.status_code == 200 and "SomnaScan" in r.text


def test_unknown_api_route_stays_404_with_a_build(tmp_path):
    client = TestClient(create_app(make_build(tmp_path)))
    assert client.get("/api/does-not-exist").status_code == 404


def test_health_only_allows_get(tmp_path):
    client = TestClient(create_app(make_build(tmp_path)))
    assert client.post("/api/health").status_code in (404, 405)
