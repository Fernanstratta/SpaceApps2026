# Getting started

From the repository root, use Node.js 24 and npm.

```sh
npm ci
npm run dev:vercel
```

Open <http://localhost:3000/docs/index.html>. The default backend origin is `http://localhost:3000`. If Vercel starts on a different port, use the URL it prints. Vite's standalone dev server and production build serve frontend assets. Run Vercel for the API functions and aliases.

```sh
curl -i http://localhost:3000/api/health
curl -i 'http://localhost:3000/api/locations?format=geojson&limit=1'
curl -i 'http://localhost:3000/api/lunar-analogs?id=elegante_linne'
```

A healthy API returns `200 OK` with `{"status":"ok"}`. Most other routes wrap their results in `data`. Earth GeoJSON returns a feature collection at the top level.

## Environments and authentication

| Environment | Origin | Typical frontend request |
| --- | --- | --- |
| Vercel local | `http://localhost:3000` | `fetch('/api/health')` when on the same origin |
| Vercel preview or production | The Vercel URL or custom domain assigned to that deployment | Same relative path when the UI and API share an origin |
| Separate frontend | Its own origin, with an explicit backend URL | Configure the backend's allowlist for regional routes |

Requests are public. An `Accept: application/json` header is useful, and no token or cookie is required. Every route accepts `GET` with no request body. The eight regional handlers and their Vercel aliases also respond to `OPTIONS`. The server-side `STARMAN_ALLOWED_ORIGINS` variable accepts a comma-separated list of exact origins. See [browser and CORS troubleshooting](troubleshooting.md#browser-requests-and-cors).

The frontend build copies the docs to `dist/docs/`. The reference and captured examples can be read on a static server. Live requests require a running Vercel backend and a browser origin it allows.
