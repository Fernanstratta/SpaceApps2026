# Terranauta API documentation

Terranauta Space Explorer serves a public, read-only HTTP API for space content, maps, regional Earth–Moon and Earth–Mars comparisons, and the nine-axis Lunar Similarity Index (ILS).

| Start here | What you’ll find |
| --- | --- |
| [Getting started](getting-started.md) | Local and production base URLs, your first curl request, and browser access |
| [Which API should I use?](api-cheatsheet.md) | All 12 Vercel routes and four aliases, grouped by task |
| [Endpoint reference](api-reference.md) | Parameters, response contracts, curl commands, status codes, and typed Fetch examples |
| [AI and automation quick start](../public/llms.txt) | Plain-text entry point with route selection, ID formats, response envelopes, and score semantics |
| [OpenAPI 3.1](../public/docs/openapi.json) | Machine-readable schemas and captured JSON responses, including list and detail variants |
| [Data models](data-models.md) | Response envelopes, nullable values, types, coordinates, and attribution |
| [Data sources](data-sources.md) | Runtime NASA access, offline ingestion, and scientific provenance |
| [Nine comparison axes](comparison-axes.md) | Lunar metrics, source plans, formulas, and UI guidance |
| [React + TypeScript](frontend-integration.md) | A reusable Fetch client and a complete working comparison component |
| [Errors and troubleshooting](troubleshooting.md) | Status codes, CORS, cache, and common integration failures |
| [Verification](verification.md) | Source baseline, HTTP coverage, and the validation results |

Run `npm run dev:vercel`, then open <http://localhost:3000/docs/index.html> for endpoint search, JSON examples, and an interactive GET explorer. The explorer uses the same OpenAPI file linked above. Automated clients can start at `/llms.txt` and load `/docs/openapi.json` from the same origin. Use the same path on your Vercel deployment.

## Architecture at a glance

- React and Vite serve the UI. TypeScript Vercel Functions in `api/` serve the HTTP API on the same origin. `vercel.json` maps four public aliases to existing functions.
- Eight regional functions share a strict query validator and a repository adapter that reads versioned, Zod-validated JSON. Regional rankings calculate weighted coverage when requested.
- The lunar API serves a bundled five-pair catalog generated offline from separate site and measurement records. The planet list is static. APOD fetches from NASA at request time and falls back to a bundled archive entry.
- No account, API key, database, or API version path is required. The regional pagination version and lunar schema version currently report `1.0.0`.
