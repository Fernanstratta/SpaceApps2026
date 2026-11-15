# Data models

Use the [OpenAPI response schemas](../public/docs/openapi.json) for exact fields, types, enums, and complete captured examples. In the app, import shared types from [spaceApiTypes.ts](../src/lib/spaceApiTypes.ts) and the types inferred from the regional validators in [planetaryAnalog.ts](../src/types/planetaryAnalog.ts).

| Model | Key fields | Frontend use |
| --- | --- | --- |
| Health | `status: 'ok'` | Top-level connectivity check |
| Planet | `id`, `name`, `summary`, `funFact`, `sourceUrl` | Introductory planet cards |
| Apod | `title`, `date`, `description`, `imageUrl`, `sourceUrl`, `credit`, `source` | Format the date as a calendar day. Render the description as text and show credit when present. Resolve any relative image URL against the API origin |
| EarthLocation | `latitude`, `longitude`, `measurements`, `coordinateRole`, `coordinateUncertainty`, `qualityFlags` | Use WGS84 (EPSG:4326) markers. `boundary` is null and `municipality` can be null |
| PlanetaryLocation | `planet`, `latitude`, `longitude`, `coordinateSystem`, `longitudeDirection`, `latitudeType` | Plot on the designated planetary body. Longitude is east-positive in [0, 360). Preserve the stated latitude type and coordinate uncertainty |
| RankedAnalog | `earthLocationId`, `planetaryLocationId`, `dimensions`, `ranking`, `educational`, `imageryIds` | Use `ranking.overallScore` for the selected weights. The stored `overallScore` is a separate field. Display differences, evidence status, coverage, and source links |
| ComparisonResult | `comparison`, `earth`, `planetary`, `imagery`, `sources` | Join a curated pair’s sites and references without extra fetches |
| ScientificSource | `id`, `url`, `kind`, `accessStatus`, `datasetId`, `license`, `attribution`, `limitations` | Resolve citations and distinguish accessed sources from metadata-only records |
| SatelliteImage | `locationId`, `body`, `url`, `previewUrl`, `productId`, `credit`, `license`, `status` | Use a provider link for discovery records with a null preview. Keep credits adjacent to imagery |
| LunarPairSummary | `pair_id`, `title_es`, `earth_site`, `moon_site`, `ils` | Use the listed pair IDs for details. Site names and educational display text are in Spanish |
| LunarComparison | Summary fields plus detailed sites, `schema_version`, `generated_at`, `axes`, `education` | Both sites have east-positive longitude in [−180, 180], a coordinate status, a circular area of interest, and numeric `facts`. Keep `provisional` coordinates visible as such |

## Response envelopes

- **Collections** use `{ data: T[], meta: { total, page, limit, version } }` for regional lists. `total` counts matches before pagination. A page beyond the results returns an empty array with HTTP 200.
- **Detail** uses `{ data: T }`. Identifiers are case sensitive. The regional record ID pattern accepts lowercase letters, digits, and hyphens. Lunar pair IDs are exact strings from the lunar index and contain underscores.
- **Unpaginated lists** for planets and lunar pair summaries use `{ data: T[] }`.
- **Earth GeoJSON** uses `{ type: 'FeatureCollection', features, meta }`. Each point has `[longitude, latitude]`. Point properties include name, country, state, coordinate role, and quality flags.
- **Errors** use `{ error: { code, message } }`. Branch on the status or code because messages may vary by query error and can be in Spanish.

Treat `null` as a missing or inapplicable value according to the field. A score of zero is a computed result. Regional measurement statuses distinguish `verified`, `interpreted`, `modeled`, and `hypothesis`. Lunar side statuses have their own meanings in the [ILS guide](comparison-axes.md).
