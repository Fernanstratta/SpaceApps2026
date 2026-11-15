# Which API should I use?

All entries use `GET`. The eight regional functions and their aliases also support `OPTIONS` for CORS preflight.

| Category | Route | Use it to | Required inputs |
| --- | --- | --- | --- |
| Space | `/api/health` | Check whether the API is reachable | None |
| Space | `/api/planets` | Display the eight planets in order from the Sun | None |
| Space | `/api/apod` | Render NASA’s picture-of-the-day card | None |
| Regional | `/api/analogs` | Find curated Earth–Moon or Earth–Mars pairs and educational notes | None |
| Regional | `/api/locations` | Populate an Earth site picker or map. Use `format=geojson` for map markers | None |
| Regional | `/api/planetary` | List cataloged lunar or Martian sites. Use `planet=Moon` or `planet=Mars` | None |
| Regional | `/api/compare` | Load a supported pair, both sites, imagery metadata, and source records | Query `earth` and `planetary` |
| Regional | `/api/rankings` | Display ordered regional comparisons with evidence coverage and configurable weights | None |
| Lunar ILS | `/api/lunar-analogs` | List five predefined pairs or load all nine axes with `id` | None |
| Evidence | `/api/sources` | Resolve claims to citations and examine access and attribution | None |
| Evidence | `/api/datasets` | Discover datasets and portals in the source catalog | None |
| Evidence | `/api/imagery` | Find imagery metadata for a site with `location` | None |
| Vercel alias | `/api/analogs/{id}` | Get one regional analog by path | Path `id` |
| Vercel alias | `/api/locations/{id}` | Get one Earth site by path | Path `id` |
| Vercel alias | `/api/planets/mars` | List Mars sites, or get one with query `id` | None |
| Vercel alias | `/api/planets/moon` | List Moon sites, or get one with query `id` | None |

## Common frontend flows

- **Earth markers and comparisons.** Get `/api/locations?format=geojson`, then pass the selected feature ID to `/api/analogs?location=<id>`. Use `earthLocationId` and `planetaryLocationId` from an analog record with `/api/compare`.
- **Lunar comparison charts.** Get `/api/lunar-analogs` for the picker, then send the selected `pair_id` as `id`. Plot scored axes and label missing or provisional values using the [ILS rendering rules](comparison-axes.md#render-the-result).
- **Scientific measurements.** Earth context values appear in `measurements` on an Earth location. Individual lunar ILS values appear in each axis’s `earth` and `moon` fields. Use `/api/sources?id=<sourceId>` to resolve regional source IDs.
- **Imagery and citations.** Use `/api/imagery?location=<id>`, render `previewUrl` when present, and show `credit` and the provider URL. In a comparison detail, the API returns the pair’s imagery and sources together.
