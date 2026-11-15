"""SomnaScan backend.

The screening model runs entirely in the browser, so this server never receives
patient data. It does two small jobs:

  * GET /api/health  - a liveness check for hosts and monitoring.
  * Serves the built React site (frontend/build) when it exists, so one process
    and one command (`npm start` at the repo root) runs the whole app.
"""
import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.responses import FileResponse

DEFAULT_BUILD_DIR = Path(__file__).resolve().parent.parent / "frontend" / "build"


def create_app(build_dir=None):
    build = Path(build_dir or os.environ.get("FRONTEND_BUILD_DIR", DEFAULT_BUILD_DIR))
    app = FastAPI(title="SomnaScan", docs_url=None, redoc_url=None, openapi_url=None)

    @app.get("/api/health")
    async def health():
        return {"status": "ok", "frontend_built": (build / "index.html").is_file()}

    if (build / "index.html").is_file():
        app.mount("/", _SpaStaticFiles(directory=build, html=True), name="site")

    return app


class _SpaStaticFiles(StaticFiles):
    """Static files that fall back to index.html for unknown non-API paths."""

    async def get_response(self, path, scope):
        try:
            return await super().get_response(path, scope)
        except StarletteHTTPException as exc:
            # Starlette passes OS-style separators (backslashes on Windows)
            if exc.status_code == 404 and not path.replace("\\", "/").startswith("api/"):
                return FileResponse(Path(self.directory) / "index.html")
            raise


app = create_app()
