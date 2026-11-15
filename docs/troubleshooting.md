# Errors and troubleshooting

| Status | API code | When it occurs | What the client can do |
| --- | --- | --- | --- |
| 400 | `INVALID_QUERY` | A regional query has an unknown key, repeated value, invalid enum, malformed weights, or missing comparison IDs | Check the parameter table. Send lowercase record IDs and exact `Moon` or `Mars` |
| 404 | `NOT_FOUND` | Regional record or curated pair is absent after filters | Resolve site IDs from the catalog and check the active filters |
| 404 | `PAIR_NOT_FOUND` | Lunar pair ID is empty, repeated, or unknown | Use one exact `pair_id` from the lunar list |
| 405 | `METHOD_NOT_ALLOWED` | Unsupported HTTP method | Use GET. The regional routes send `Allow: GET, OPTIONS`. Health, planets, APOD, and lunar ILS send `Allow: GET` |
| 500 | `INTERNAL_ERROR` | A regional handler catches a catalog or processing error | Show retry UI and check Vercel logs if persistent |
| 204 | — | Regional OPTIONS preflight, including its Vercel aliases | Inspect allowlist response headers to determine browser eligibility |

Vercel or a proxy may return an HTML error outside these handlers. Check `Content-Type` before reading JSON. You can isolate routing with `curl -i <origin>/api/health`, then try the query form of a rewritten URL. With Vite alone, a request for an API path can return the app HTML instead of JSON.

## Browser requests and CORS

Use relative URLs when the frontend and backend share an origin. For a separate frontend, set the Vercel backend’s `STARMAN_ALLOWED_ORIGINS` to a comma-separated list of exact origins, for example `http://localhost:5173,https://frontend.example`. Match scheme, host, and port, with no path or trailing slash. The eight regional handlers emit `Vary: Origin` and echo `Access-Control-Allow-Origin` only for a match. They allow GET, OPTIONS, Accept, and Content-Type on preflight. The four simple GET-only routes have no application CORS headers. To call those four routes from another frontend, serve the frontend from the API origin or use a same-origin proxy configured by that frontend. curl can reach public routes independently of browser CORS.

The explorer defaults to its own origin. A hosted HTTPS page may block requests to a plain HTTP backend. Open the local explorer from the local Vercel origin while testing a local backend.

## Caching and fallback

| Route group | Successful cache policy |
| --- | --- |
| Health | `no-store` |
| Planets and lunar ILS | Browser `max-age=0`, shared `s-maxage=86400` |
| APOD | Browser `max-age=0`, shared `s-maxage=900` for NASA and `60` for the archive fallback |
| Regional and rewritten aliases | Browser `max-age=60`, shared `s-maxage=3600`, `stale-while-revalidate=86400` |

Application errors use `no-store`. APOD can return 200 with archive data. Check `data.source` and label the card as archived when it is `fallback`. If an analog score is null, display the reason and coverage. Retrying the same static catalog will yield the same measurement state.
