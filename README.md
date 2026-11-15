# SomnaScan

In-browser sleep disorder screening dashboard (React). The Random Forest model runs entirely in the browser; no patient data is sent anywhere.

## Develop

```
cd frontend
npm install
npm start
```

## Test

```
cd frontend && npm run test:ci
pip install -r backend/requirements.txt && pytest
```

## Build

```
cd frontend && npm run build
```

The build disables source maps and inlined runtime so the Content-Security-Policy in `public/index.html` applies. Serve `frontend/build` from any static host.

Not for clinical use: see the disclaimer in the app.
