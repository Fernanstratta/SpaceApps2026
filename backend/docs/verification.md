# Verification report

Documented baseline: [Terranauta-Backend Main at 8f3f3174](https://github.com/ClydioSeven/Starman-Backend/tree/8f3f3174a7b2c232f6159477e8c77008d7a8cb0b), which includes the lunar ILS implementation from pull request #4. The 87 files in the local source snapshot matched the GitHub tree by blob hash. The remote tree also contains 15 generated Graphify files.

| Check | Result |
| --- | --- |
| Route inventory | 12 Vercel functions and four rewrites. All 16 GET paths and 12 public OPTIONS paths are in the spec |
| Local Vercel HTTP | All 16 GET paths returned 200 with valid inputs. Exercised list/detail, pagination, empty results, GeoJSON, alias rewrites, unsupported methods, and regional and lunar query errors |
| CORS and caching | Checked matching and unmatched origins, application cache headers, and OPTIONS behavior on all eight regional routes and four aliases |
| OpenAPI | Validated the document with the official 3.1 structural schema. Checked path parity, template bindings, local references, and all 80 JSON examples against response schemas |
| Markdown links | Checked local links and heading anchors, including the AI quick-start entry point |
| Build and TypeScript | `npm run build`, `npm run typecheck`, and `npx tsc --project docs/examples/tsconfig.json` passed with installed dependencies |
| Tests | `npm test` passed all 16 repository tests |
| Interactive examples | Exercised explorer search, navigation, curl copying, validation, and live 200/404 responses against Vercel in a simulated DOM. Rendered the React example against live data, switched pairs, and verified the pending score state |
| Lunar catalog | Regenerated all six JSON files to a temporary directory with the published timestamp and matched them byte for byte |

Local Vercel returned the archive APOD response during HTTP verification. The NASA public feed returned a current payload, which passed through the APOD mapper. The NASA success branch was tested at the mapper level. The production deployment URL remains unverified. An injected repository failure returned `500 INTERNAL_ERROR` with `no-store` at the regional handler level. Browser layout was not visually verified because Chromium could not start in the verification environment.

## Recheck after API changes

1. Run `node docs/check-endpoints.mjs` to compare the route files in `api/` and aliases in `vercel.json` with the OpenAPI `paths`.
2. Update the OpenAPI response schemas and examples when parameter, output, or error contracts change. The explorer reads that file directly.
3. Run the commands above and use `npm run dev:vercel` to capture representative responses for changed paths. Check detail, list, and empty states where applicable.
4. Update the Markdown reference and [React examples](frontend-integration.md) when their contracts change.
