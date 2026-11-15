import os
import sys

from fastapi.testclient import TestClient

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from server import app  # noqa: E402

client = TestClient(app)


def test_health_endpoint_is_ok():
    r = client.get("/api/health")
    assert r.status_code == 200
    body = r.json()
    assert body["status"] == "ok"
    assert body["mode"] == "frontend-only"


def test_unknown_route_returns_404():
    assert client.get("/api/does-not-exist").status_code == 404


def test_only_get_is_allowed_on_health():
    assert client.post("/api/health").status_code == 405
