# Starman analog API integration

This extension preserves `/api/health`, `/api/apod`, `/api/planets` and the existing visual comparisons. It adds eight lightweight local-data functions; the Lunar Similarity Index adds a separate function, for twelve total. No database or new secret is needed. Use Node 24 and the existing Vercel Vite configuration.

## Requests

| Request | Result |
|---|---|
| `/api/analogs?planet=Mars&type=process&limit=20&page=1` | Filtered comparisons |
| `/api/analogs/cerro-prieto-gusev` | Detail, rewritten to `/api/analogs?id=cerro-prieto-gusev` |
| `/api/locations` | Earth locations and modeled context measurements |
| `/api/locations/cerro-prieto` | Earth detail |
| `/api/locations?format=geojson` | Paginated WGS84 point FeatureCollection |
| `/api/planets/mars` | Rewritten to `/api/planetary?planet=Mars`; planetary locations |
| `/api/planets/moon` | Rewritten to `/api/planetary?planet=Moon` |
| `/api/compare?earth=cerro-prieto&planetary=gusev` | Comparison, Earth, planetary, imagery and comparison sources |
| `/api/rankings?planet=Mars&profile=geology&confidence=medium` | Explained scores and missing-data coverage |
| `/api/sources?limit=100` | Scientific references and discovery records |
| `/api/datasets` | Dataset and portal subset |
| `/api/imagery?location=bagnold` | Image metadata; unknown previews stay null |

Supported profiles: balanced, geology, astrobiology, mobility, lunar-operations, lunar-resources, human-training. `sort` accepts priority, evidence or similarity. Similarity always places unknowns last; ties use editorial research priority. All current records are unscored. Confidence filters reflect confidence in this proposed pair, not institution prestige. `location` refers to Earth IDs on analog routes and location IDs on imagery. IDs and planet names are case sensitive.

Pagination defaults to 20 and is capped at 100. Unknown query keys, duplicate query values, invalid enums and malformed weights return 400. Missing records return 404; unsupported methods return 405. OPTIONS returns 204. Errors use `{ "error": { "code": "INVALID_QUERY", "message": "..." } }`. Failed responses are not cached. Successful responses use a one-hour CDN cache and one-day stale-while-revalidate allowance. No external science API is called during a page load.

Collections: `{ "data": [...], "meta": { "total": 3, "page": 1, "limit": 20, "version": "1.0.0" } }`. Details: `{ "data": {...} }`. GeoJSON uses its standard root `type`/`features`, plus pagination metadata. Each analog response includes `ranking: { overallScore, coverage, missingDimensions, weights, status, reason, confidence, method }`. `overallScore: null` is not zero; show “not yet measured.” Editorial priority is not a scientific similarity score.

## Adjustable dimensions

```ts
const weights = { geology: 0, terrain: 40, environment: 0,
  materials: 30, water: 0, operations: 30, subsurface: 0 };
const query = new URLSearchParams({ planet: 'Mars', weights: JSON.stringify(weights) });
const response = await fetch(`/api/rankings?${query}`);
if (!response.ok) throw new Error(`API error ${response.status}`);
const { data, meta } = await response.json();
```

All seven weights must be present, each finite and between 0 and 100, with positive total. Values are normalized by their sum. Set unselected dimensions to zero. Weights change the requested evidence coverage; they do not create data.

## Frontend integration

`src/types/planetaryAnalog.ts` exports Zod-derived types. `src/lib/analogApiClient.ts` validates frontend responses at runtime. `BajaAnalogExplorer.tsx`, mounted on the existing page, demonstrates destination/profile selection, explanation levels, limitations, experiments, quizzes and linked sources. It preserves loading/error/empty states and aborts obsolete requests.

For a map, fetch the GeoJSON and use each feature ID to request `/api/analogs?location=...`. Display coordinate-role and accuracy warnings; marker positions are not boundaries or field access instructions. Keep Moon/Mars markers out of Earth GeoJSON. For comparison cards, call `/api/compare` and render `previewUrl` only when non-null; otherwise provide the source-page link. A discovery link is not an image. Do not fabricate thumbnails or acquisition dates.

For evidence exploration, resolve claim `sourceIds` against `/api/sources`. Source access status describes ingestion evidence, not general scientific reliability. Measurement rows distinguish modeled reanalysis from verified observations. The raw POWER files are audit artifacts; the API serves precomputed summaries.

The API is same-origin by default. For a separate frontend set `STARMAN_ALLOWED_ORIGINS` to a comma-separated exact origin allowlist. No credentials or wildcard reflection is enabled. Public data are not access-controlled by CORS. Different Vercel deployments must configure that environment variable separately. The allowlist applies to these eight regional functions and their aliases. See [browser requests and CORS](troubleshooting.md#browser-requests-and-cors) for the other routes.

## Deployment and integration boundaries

Apply the delivered update ZIP over a fresh checkout of the provided repository's `Main` branch. It contains only changed/new source files, so existing binary imagery is preserved. The research workspace retrieved text files through the GitHub connector; its standalone copy does not contain the original four binary preview assets. Do not deploy that incomplete source snapshot as a replacement clone. Use the update overlay with the original repository.

Run `npm ci`, `npm test`, `npm run typecheck`, `npm run build`, then `npm run dev:vercel`. The production Vercel deployment has not been published from this task. Preserve the explicit rewrites before any future SPA catch-all. For direct API debugging use the equivalent query routes listed above.

`AnalogRepository.read()` isolates persistence from handlers. A future database adapter must return the same runtime-validated catalog contract and preserve provenance and null handling. This release does not justify a database.
