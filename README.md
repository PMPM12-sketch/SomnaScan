# SomnaScan

In-browser sleep disorder screening dashboard. The Random Forest model (`frontend/src/data/model_logic.json`) runs entirely in the browser, so patient values never leave the device. A small FastAPI server serves the built site and exposes a health check.

Not for clinical use: see the disclaimer in the app.

## Layout

```
frontend/   React + Tailwind app (Create React App via craco)
backend/    FastAPI server: serves frontend/build and GET /api/health
tests/      Backend tests (pytest); frontend tests live in frontend/src
package.json  Root commands that run both halves together
```

## Requirements

Node 20+ and Python 3.10+.

## Run it

```bash
npm run install:all     # once: installs root, frontend and backend dependencies
npm run dev             # development: API on :8000, site on :3000 (proxies /api to the API)
npm start               # production-style: builds the site, then serves everything on :8000
```

Open http://localhost:3000 for `dev`, or http://localhost:8000 after `npm start`.

## Other commands

```bash
npm test                # frontend + backend tests
npm run build           # build the site only (frontend/build)
```

`FRONTEND_BUILD_DIR` can point the server at a different build folder. Source maps are off in builds so the Content-Security-Policy in `frontend/public/index.html` applies cleanly.

## Static hosting

The backend is optional. Because the app makes no API calls, `frontend/build` can be hosted on any static host (GitHub Pages, Netlify, Vercel).
