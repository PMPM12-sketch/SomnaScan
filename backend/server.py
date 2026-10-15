from fastapi import FastAPI

# This application is FRONTEND-ONLY.
# All AI inference runs in the browser using the user-provided model_logic.json (SlackingAI).
# This file exists only because the platform's process supervisor expects a backend process.
# It does NOT use MongoDB, it stores nothing, and the frontend never calls it.

app = FastAPI()


@app.get("/api/health")
async def health():
    return {"status": "ok", "mode": "frontend-only", "backend": "inert (no database)"}
