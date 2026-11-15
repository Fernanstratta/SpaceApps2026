# API endpoint reference

Use `http://localhost:3000` with local Vercel or the deployed origin in production. Every request below uses GET. See the [quick reference](api-cheatsheet.md) for a task-to-path table and the [OpenAPI specification](../public/docs/openapi.json) for every field and unabridged HTTP response example. JSON excerpts preserve the shape and values of the selected response.

The TypeScript calls use the [reusable Fetch client](examples/starmanClient.ts) and the types in [endpointCalls.ts](examples/endpointCalls.ts). Import the client and types in your module before copying a call.

```ts
import { createStarmanClient } from './starmanClient';

const api = createStarmanClient();
```

## Regional request rules

The eight regional handlers validate a shared query vocabulary. Unknown keys and duplicate values fail validation. The tables list the parameters that affect each endpoint. Other recognized parameters are still validated. With `planet` on `/api/locations`, the related analogs must also match the requested `type` and minimum `confidence`. Without `planet`, those two filters have no effect on locations.

Send `weights` as one URL-encoded JSON string. Include all seven keys, each from 0 to 100, and give at least one dimension a positive weight. Use an exact `Moon` or `Mars` and case-sensitive IDs. Regional collections use one-based paging with 20 results by default and a maximum of 100 per page. With `id`, pagination is skipped. For detail aliases, use the path ID as the selector. Use the query endpoint when you need to control the rewritten parameters directly.

The status codes below describe the application handlers. The [error guide](troubleshooting.md) covers recovery, CORS and cache policies.

## GET /api/health

Use for a connectivity check. The response has a top-level status field.

No request parameters.

```sh
curl -i 'http://localhost:3000/api/health'
```

### HTTP 200 example

```json
{
  "status": "ok"
}
```

**Status codes** 200, `405 METHOD_NOT_ALLOWED`.

**Cache** `no-store`

```ts
const result = await api.get<HealthResponse>('/api/health');
```

## GET /api/planets

Use for introductory planet cards. The static list is ordered from Mercury through Neptune.

No request parameters.

```sh
curl -i 'http://localhost:3000/api/planets'
```

### HTTP 200 example (excerpt)

```json
{
  "data": [
    {
      "id": "mercury",
      "name": "Mercury",
      "summary": "Mercury is the smallest planet and the closest to the Sun.",
      "funFact": "A year on Mercury lasts just 88 Earth days.",
      "sourceUrl": "https://science.nasa.gov/mercury/facts/"
    }
  ]
}
```

**Status codes** 200, `405 METHOD_NOT_ALLOWED`.

**Cache** `public, max-age=0, s-maxage=86400`

```ts
const result = await api.get<PlanetsResponse>('/api/planets');
```

## GET /api/apod

Gets the newest usable NASA entry or the bundled archive entry. A missing image is null. Resolve a relative imageUrl against the API origin and preserve source credit.

No request parameters.

```sh
curl -i 'http://localhost:3000/api/apod'
```

### HTTP 200 example

```json
{
  "data": {
    "title": "Welcome to Planet Earth",
    "date": "2007-03-25",
    "description": "The Apollo 17 crew took this photo of Earth in 1972. Look for Africa, Antarctica, and swirling white clouds. The picture is known as the Blue Marble.",
    "imageUrl": "/space/apod-blue-marble.jpg",
    "sourceUrl": "https://science.nasa.gov/image-article/apod-2007-march-25-welcome-to-planet-earth/",
    "credit": "Apollo 17 Crew, NASA",
    "source": "fallback"
  }
}
```

**Status codes** 200, `405 METHOD_NOT_ALLOWED`.

**Cache** `public, max-age=0, s-maxage=900 for NASA or s-maxage=60 for fallback.`

```ts
const result = await api.get<ApodResponse>('/api/apod');
```

## GET /api/lunar-analogs

Omit id for summaries. Supply a pair_id for site details, all nine axes, and educational notes. Show weighted coverage and distinguish null from a score of 0.

| Parameter | Type | Required | Meaning | Example |
| --- | --- | --- | --- | --- |
| `id` (query) | string | No | Exact pair_id from the list. Repeated ids return 404. | `elegante_linne` |

Use the same route without `id` to load the five summaries in `{ data: AnalogPairSummary[] }`. A pair detail adds site metadata, nine axis records and educational notes.

```sh
curl -i 'http://localhost:3000/api/lunar-analogs?id=elegante_linne'
```

### HTTP 200 example (excerpt)

```json
{
  "data": {
    "pair_id": "elegante_linne",
    "title_es": "Cráter El Elegante ↔ Cráter Linné",
    "ils": {
      "value": 59.7,
      "formula": "sum(w_i * S_i) / sum(w_i)",
      "axes_used": 1,
      "data_completeness": 0.1081,
      "has_placeholders": true
    }
  }
}
```

**Status codes** 200, `404 PAIR_NOT_FOUND`, `405 METHOD_NOT_ALLOWED`.

**Cache** `public, max-age=0, s-maxage=86400`

```ts
const result = await api.get<DataResponse<Comparison>>('/api/lunar-analogs', new URLSearchParams('id=elegante_linne'));
```

## GET /api/analogs

Use for curated comparison cards. An id selects one record after filters. Records include educational content, provenance, and calculated ranking metadata.

| Parameter | Type | Required | Meaning | Example |
| --- | --- | --- | --- | --- |
| `id` (query) | string | No | Case-sensitive record ID. When supplied, returns detail and bypasses pagination. | — |
| `planet` (query) | `Moon` or `Mars` | No | Filter the catalog by destination body. Values are case-sensitive. | `Mars` |
| `location` (query) | string | No | Filter by the exact Earth location or image location ID. | — |
| `type` (query) | `environmental` or `geological` or `process` or `operational` | No | Require this analog type. | `process` |
| `profile` (query) | `balanced` or `geology` or `astrobiology` or `mobility` or `lunar-operations` or `lunar-resources` or `human-training` | No | Choose preset weights. Custom weights take precedence. | `geology` |
| `confidence` (query) | `low` or `medium` or `high` | No | Minimum research confidence (low, medium, high). | `medium` |
| `sort` (query) | `priority` or `evidence` or `similarity` | No | Priority is ascending editorial priority. Evidence sorts by confidence then priority. Similarity sorts by score with null last. Rankings use similarity unless sort=evidence. | `similarity` |
| `weights` (query) | string | No | URL-encode a JSON object with all seven dimension names. Each value is finite and between 0 and 100, and at least one is positive. | `{"geology":25,"terrain":20,"environment":15,"materials":15,"water":10,"operations":10,"subsurface":5}` |
| `page` (query) | integer | No | One-based page. Send digits with no leading zero. | `1` |
| `limit` (query) | integer | No | Page size. Send digits with no leading zero. | `1` |

```sh
curl -i 'http://localhost:3000/api/analogs?limit=1'
```

### HTTP 200 example (excerpt)

```json
{
  "data": [
    {
      "id": "cerro-prieto-gusev",
      "earthLocationId": "cerro-prieto",
      "planetaryLocationId": "gusev",
      "researchConfidence": "medium",
      "ranking": {
        "overallScore": null,
        "coverage": 0,
        "missingDimensions": [
          "geology",
          "terrain",
          "environment",
          "materials",
          "water",
          "operations",
          "subsurface"
        ],
        "weights": {
          "geology": 25,
          "terrain": 20,
          "environment": 15,
          "materials": 15,
          "water": 10,
          "operations": 10,
          "subsurface": 5
        },
        "status": "insufficient-data",
        "reason": "Requires at least 70% weighted coverage and up to three measured dimensions. No missing value is treated as zero.",
        "confidence": null,
        "method": "starman-distance-v1; heuristic thresholds, not scientific validation"
      }
    }
  ],
  "meta": {
    "total": 3,
    "page": 1,
    "limit": 1,
    "version": "1.0.0"
  }
}
```

**Status codes** 200, `400 INVALID_QUERY`, `404 NOT_FOUND`, `405 METHOD_NOT_ALLOWED`, `500 INTERNAL_ERROR`, `204` for OPTIONS.

**Cache** `public, max-age=60, s-maxage=3600, stale-while-revalidate=86400`

```ts
const result = await api.get<CollectionResponse<RankedAnalog>>('/api/analogs', new URLSearchParams('limit=1'));
```

## GET /api/locations

Use for a site picker, detail card, or Earth map. GeoJSON positions are longitude then latitude. When planet is set, location selection also reflects analog type and confidence filters.

| Parameter | Type | Required | Meaning | Example |
| --- | --- | --- | --- | --- |
| `id` (query) | string | No | Case-sensitive record ID. When supplied, returns detail and bypasses pagination. | — |
| `location` (query) | string | No | Filter by the exact Earth location or image location ID. | — |
| `planet` (query) | `Moon` or `Mars` | No | Filter the catalog by destination body. Values are case-sensitive. | `Mars` |
| `type` (query) | `environmental` or `geological` or `process` or `operational` | No | Require this analog type. | `process` |
| `confidence` (query) | `low` or `medium` or `high` | No | Minimum research confidence (low, medium, high). | `medium` |
| `format` (query) | `json` or `geojson` | No | Use geojson to return WGS84 points. If id is supplied, detail JSON takes precedence. | `geojson` |
| `page` (query) | integer | No | One-based page. Send digits with no leading zero. | `1` |
| `limit` (query) | integer | No | Page size. Send digits with no leading zero. | `1` |

```sh
curl -i 'http://localhost:3000/api/locations?format=geojson&limit=1'
```

### HTTP 200 example (excerpt)

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "id": "cerro-prieto",
      "geometry": {
        "type": "Point",
        "coordinates": [
          -115.305,
          32.418
        ]
      },
      "properties": {
        "name": "Cerro Prieto geothermal region",
        "country": "Mexico",
        "state": "Baja California",
        "coordinateRole": "GVP volcano reference point; not geothermal reservoir centroid",
        "qualityFlags": [
          "regional-marker-not-sampling-site",
          "boundary-unavailable",
          "source-datum-unspecified"
        ]
      }
    }
  ],
  "meta": {
    "total": 3,
    "page": 1,
    "limit": 1,
    "version": "1.0.0"
  }
}
```

**Status codes** 200, `400 INVALID_QUERY`, `404 NOT_FOUND`, `405 METHOD_NOT_ALLOWED`, `500 INTERNAL_ERROR`, `204` for OPTIONS.

**Cache** `public, max-age=60, s-maxage=3600, stale-while-revalidate=86400`

```ts
const result = await api.get<EarthGeoJson>('/api/locations', new URLSearchParams('format=geojson&limit=1'));
```

## GET /api/compare

Provide both site IDs. Returns the matching comparison plus Earth site, planetary site, referenced imagery, and sources. Site pairs must already exist in the catalog and match any supplied filters.

| Parameter | Type | Required | Meaning | Example |
| --- | --- | --- | --- | --- |
| `earth` (query) | string | Yes | Earth location ID from /api/locations. | `cerro-prieto` |
| `planetary` (query) | string | Yes | Planetary location ID from /api/planetary. | `gusev` |
| `planet` (query) | `Moon` or `Mars` | No | Filter the catalog by destination body. Values are case-sensitive. | `Mars` |
| `location` (query) | string | No | Filter by the exact Earth location or image location ID. | — |
| `type` (query) | `environmental` or `geological` or `process` or `operational` | No | Require this analog type. | `process` |
| `profile` (query) | `balanced` or `geology` or `astrobiology` or `mobility` or `lunar-operations` or `lunar-resources` or `human-training` | No | Choose preset weights. Custom weights take precedence. | `geology` |
| `confidence` (query) | `low` or `medium` or `high` | No | Minimum research confidence (low, medium, high). | `medium` |
| `sort` (query) | `priority` or `evidence` or `similarity` | No | Priority is ascending editorial priority. Evidence sorts by confidence then priority. Similarity sorts by score with null last. Rankings use similarity unless sort=evidence. | `similarity` |
| `weights` (query) | string | No | URL-encode a JSON object with all seven dimension names. Each value is finite and between 0 and 100, and at least one is positive. | `{"geology":25,"terrain":20,"environment":15,"materials":15,"water":10,"operations":10,"subsurface":5}` |

```sh
curl -i 'http://localhost:3000/api/compare?earth=cerro-prieto&planetary=gusev'
```

### HTTP 200 example (excerpt)

```json
{
  "data": {
    "comparison": {
      "id": "cerro-prieto-gusev",
      "title": "Reading the traces of hot water",
      "ranking": {
        "overallScore": null,
        "coverage": 0,
        "missingDimensions": [
          "geology",
          "terrain",
          "environment",
          "materials",
          "water",
          "operations",
          "subsurface"
        ],
        "weights": {
          "geology": 25,
          "terrain": 20,
          "environment": 15,
          "materials": 15,
          "water": 10,
          "operations": 10,
          "subsurface": 5
        },
        "status": "insufficient-data",
        "reason": "Requires at least 70% weighted coverage and up to three measured dimensions. No missing value is treated as zero.",
        "confidence": null,
        "method": "starman-distance-v1; heuristic thresholds, not scientific validation"
      }
    },
    "earth": {
      "id": "cerro-prieto",
      "name": "Cerro Prieto geothermal region"
    },
    "planetary": {
      "id": "gusev",
      "name": "Gusev crater / Spirit traverse",
      "planet": "Mars"
    },
    "imagery": [
      {
        "id": "earth-cerro-prieto",
        "previewUrl": null,
        "credit": "USGS/NASA Landsat"
      },
      {
        "id": "planet-gusev",
        "previewUrl": null,
        "credit": "See linked NASA resource credit"
      }
    ],
    "sources": [
      {
        "id": "gvp-cerro",
        "url": "https://volcano.si.edu/volcano.cfm?vn=341000"
      }
    ]
  }
}
```

**Status codes** 200, `400 INVALID_QUERY`, `404 NOT_FOUND`, `405 METHOD_NOT_ALLOWED`, `500 INTERNAL_ERROR`, `204` for OPTIONS.

**Cache** `public, max-age=60, s-maxage=3600, stale-while-revalidate=86400`

```ts
const result = await api.get<DataResponse<ComparisonResult>>('/api/compare', new URLSearchParams('earth=cerro-prieto&planetary=gusev'));
```

## GET /api/rankings

Use for evidence-aware ordered lists and profile controls. Null similarity means insufficient evidence. Supports record detail via id.

| Parameter | Type | Required | Meaning | Example |
| --- | --- | --- | --- | --- |
| `id` (query) | string | No | Case-sensitive record ID. When supplied, returns detail and bypasses pagination. | — |
| `planet` (query) | `Moon` or `Mars` | No | Filter the catalog by destination body. Values are case-sensitive. | `Mars` |
| `location` (query) | string | No | Filter by the exact Earth location or image location ID. | — |
| `type` (query) | `environmental` or `geological` or `process` or `operational` | No | Require this analog type. | `process` |
| `profile` (query) | `balanced` or `geology` or `astrobiology` or `mobility` or `lunar-operations` or `lunar-resources` or `human-training` | No | Choose preset weights. Custom weights take precedence. | `geology` |
| `confidence` (query) | `low` or `medium` or `high` | No | Minimum research confidence (low, medium, high). | `medium` |
| `sort` (query) | `priority` or `evidence` or `similarity` | No | Priority is ascending editorial priority. Evidence sorts by confidence then priority. Similarity sorts by score with null last. Rankings use similarity unless sort=evidence. | `similarity` |
| `weights` (query) | string | No | URL-encode a JSON object with all seven dimension names. Each value is finite and between 0 and 100, and at least one is positive. | `{"geology":25,"terrain":20,"environment":15,"materials":15,"water":10,"operations":10,"subsurface":5}` |
| `page` (query) | integer | No | One-based page. Send digits with no leading zero. | `1` |
| `limit` (query) | integer | No | Page size. Send digits with no leading zero. | `1` |

```sh
curl -i 'http://localhost:3000/api/rankings?planet=Mars&profile=geology&limit=1'
```

### HTTP 200 example (excerpt)

```json
{
  "data": [
    {
      "id": "cerro-prieto-gusev",
      "ranking": {
        "overallScore": null,
        "coverage": 0,
        "missingDimensions": [
          "geology",
          "terrain",
          "environment",
          "materials",
          "water",
          "operations",
          "subsurface"
        ],
        "weights": {
          "geology": 40,
          "terrain": 20,
          "environment": 5,
          "materials": 15,
          "water": 10,
          "operations": 5,
          "subsurface": 5
        },
        "status": "insufficient-data",
        "reason": "Requires at least 70% weighted coverage and up to three measured dimensions. No missing value is treated as zero.",
        "confidence": null,
        "method": "starman-distance-v1; heuristic thresholds, not scientific validation"
      }
    }
  ],
  "meta": {
    "total": 2,
    "page": 1,
    "limit": 1,
    "version": "1.0.0"
  }
}
```

**Status codes** 200, `400 INVALID_QUERY`, `404 NOT_FOUND`, `405 METHOD_NOT_ALLOWED`, `500 INTERNAL_ERROR`, `204` for OPTIONS.

**Cache** `public, max-age=60, s-maxage=3600, stale-while-revalidate=86400`

```ts
const result = await api.get<CollectionResponse<RankedAnalog>>('/api/rankings', new URLSearchParams('planet=Mars&profile=geology&limit=1'));
```

## GET /api/planetary

Filter with planet=Moon or planet=Mars. Planetary longitude is east-positive in [0, 360) and its coordinate system belongs to the given body.

| Parameter | Type | Required | Meaning | Example |
| --- | --- | --- | --- | --- |
| `id` (query) | string | No | Case-sensitive record ID. When supplied, returns detail and bypasses pagination. | — |
| `planet` (query) | `Moon` or `Mars` | No | Filter the catalog by destination body. Values are case-sensitive. | `Mars` |
| `page` (query) | integer | No | One-based page. Send digits with no leading zero. | `1` |
| `limit` (query) | integer | No | Page size. Send digits with no leading zero. | `1` |

```sh
curl -i 'http://localhost:3000/api/planetary?planet=Mars&limit=1'
```

### HTTP 200 example (excerpt)

```json
{
  "data": [
    {
      "id": "gusev",
      "name": "Gusev crater / Spirit traverse",
      "planet": "Mars",
      "latitude": -14.5692,
      "longitude": 175.4729,
      "coordinateSystem": "Mars body-fixed geographic degrees; source convention recorded separately",
      "latitudeType": "source-unspecified"
    }
  ],
  "meta": {
    "total": 2,
    "page": 1,
    "limit": 1,
    "version": "1.0.0"
  }
}
```

**Status codes** 200, `400 INVALID_QUERY`, `404 NOT_FOUND`, `405 METHOD_NOT_ALLOWED`, `500 INTERNAL_ERROR`, `204` for OPTIONS.

**Cache** `public, max-age=60, s-maxage=3600, stale-while-revalidate=86400`

```ts
const result = await api.get<CollectionResponse<PlanetaryLocation>>('/api/planetary', new URLSearchParams('planet=Mars&limit=1'));
```

## GET /api/sources

Resolve sourceIds on claims, measurements, and images. Includes official summaries, primary research, datasets, and portals.

| Parameter | Type | Required | Meaning | Example |
| --- | --- | --- | --- | --- |
| `id` (query) | string | No | Case-sensitive record ID. When supplied, returns detail and bypasses pagination. | — |
| `page` (query) | integer | No | One-based page. Send digits with no leading zero. | `1` |
| `limit` (query) | integer | No | Page size. Send digits with no leading zero. | `1` |

```sh
curl -i 'http://localhost:3000/api/sources?limit=1'
```

### HTTP 200 example (excerpt)

```json
{
  "data": [
    {
      "id": "gvp-cerro",
      "title": "Cerro Prieto volcano profile",
      "organization": "Smithsonian Global Volcanism Program",
      "kind": "official-summary",
      "accessStatus": "accessed",
      "url": "https://volcano.si.edu/volcano.cfm?vn=341000"
    }
  ],
  "meta": {
    "total": 39,
    "page": 1,
    "limit": 1,
    "version": "1.0.0"
  }
}
```

**Status codes** 200, `400 INVALID_QUERY`, `404 NOT_FOUND`, `405 METHOD_NOT_ALLOWED`, `500 INTERNAL_ERROR`, `204` for OPTIONS.

**Cache** `public, max-age=60, s-maxage=3600, stale-while-revalidate=86400`

```ts
const result = await api.get<CollectionResponse<ScientificSource>>('/api/sources', new URLSearchParams('limit=1'));
```

## GET /api/datasets

The dataset and portal subset of /api/sources. Records contain discovery and attribution metadata. Use the provider link to access the dataset.

| Parameter | Type | Required | Meaning | Example |
| --- | --- | --- | --- | --- |
| `id` (query) | string | No | Case-sensitive record ID. When supplied, returns detail and bypasses pagination. | — |
| `page` (query) | integer | No | One-based page. Send digits with no leading zero. | `1` |
| `limit` (query) | integer | No | Page size. Send digits with no leading zero. | `1` |

```sh
curl -i 'http://localhost:3000/api/datasets?limit=1'
```

### HTTP 200 example (excerpt)

```json
{
  "data": [
    {
      "id": "hirise-bagnold",
      "title": "Curiosity Rover and Gale Crater Dune Monitoring",
      "kind": "dataset",
      "datasetId": "ESP_035917_1755",
      "accessStatus": "accessed",
      "url": "https://www.uahirise.org/ESP_035917_1755"
    }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 1,
    "version": "1.0.0"
  }
}
```

**Status codes** 200, `400 INVALID_QUERY`, `404 NOT_FOUND`, `405 METHOD_NOT_ALLOWED`, `500 INTERNAL_ERROR`, `204` for OPTIONS.

**Cache** `public, max-age=60, s-maxage=3600, stale-while-revalidate=86400`

```ts
const result = await api.get<CollectionResponse<ScientificSource>>('/api/datasets', new URLSearchParams('limit=1'));
```

## GET /api/imagery

Use location to filter by an Earth or planetary site ID. Render an image only when previewUrl exists, otherwise link to url and retain credit.

| Parameter | Type | Required | Meaning | Example |
| --- | --- | --- | --- | --- |
| `id` (query) | string | No | Case-sensitive record ID. When supplied, returns detail and bypasses pagination. | — |
| `location` (query) | string | No | Filter by the exact Earth location or image location ID. | — |
| `page` (query) | integer | No | One-based page. Send digits with no leading zero. | `1` |
| `limit` (query) | integer | No | Page size. Send digits with no leading zero. | `1` |

```sh
curl -i 'http://localhost:3000/api/imagery?location=bagnold&limit=1'
```

### HTTP 200 example (excerpt)

```json
{
  "data": [
    {
      "id": "planet-bagnold",
      "locationId": "bagnold",
      "body": "Mars",
      "previewUrl": null,
      "status": "metadata-verified",
      "credit": "NASA/JPL-Caltech/UArizona"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 1,
    "version": "1.0.0"
  }
}
```

**Status codes** 200, `400 INVALID_QUERY`, `404 NOT_FOUND`, `405 METHOD_NOT_ALLOWED`, `500 INTERNAL_ERROR`, `204` for OPTIONS.

**Cache** `public, max-age=60, s-maxage=3600, stale-while-revalidate=86400`

```ts
const result = await api.get<CollectionResponse<SatelliteImage>>('/api/imagery', new URLSearchParams('location=bagnold&limit=1'));
```

## GET /api/analogs/{id}

Vercel rewrites this request to /api/analogs?id={id}.

| Parameter | Type | Required | Meaning | Example |
| --- | --- | --- | --- | --- |
| `id` (path) | string | Yes | Case-sensitive catalog record ID supplied in the URL path. | `cerro-prieto-gusev` |
| `planet` (query) | `Moon` or `Mars` | No | Filter the catalog by destination body. Values are case-sensitive. | `Mars` |
| `location` (query) | string | No | Filter by the exact Earth location or image location ID. | — |
| `type` (query) | `environmental` or `geological` or `process` or `operational` | No | Require this analog type. | `process` |
| `profile` (query) | `balanced` or `geology` or `astrobiology` or `mobility` or `lunar-operations` or `lunar-resources` or `human-training` | No | Choose preset weights. Custom weights take precedence. | `geology` |
| `confidence` (query) | `low` or `medium` or `high` | No | Minimum research confidence (low, medium, high). | `medium` |
| `sort` (query) | `priority` or `evidence` or `similarity` | No | Priority is ascending editorial priority. Evidence sorts by confidence then priority. Similarity sorts by score with null last. Rankings use similarity unless sort=evidence. | `similarity` |
| `weights` (query) | string | No | URL-encode a JSON object with all seven dimension names. Each value is finite and between 0 and 100, and at least one is positive. | `{"geology":25,"terrain":20,"environment":15,"materials":15,"water":10,"operations":10,"subsurface":5}` |

```sh
curl -i 'http://localhost:3000/api/analogs/cerro-prieto-gusev'
```

### HTTP 200 example (excerpt)

```json
{
  "data": {
    "id": "cerro-prieto-gusev",
    "title": "Reading the traces of hot water",
    "ranking": {
      "overallScore": null,
      "coverage": 0,
      "missingDimensions": [
        "geology",
        "terrain",
        "environment",
        "materials",
        "water",
        "operations",
        "subsurface"
      ],
      "weights": {
        "geology": 25,
        "terrain": 20,
        "environment": 15,
        "materials": 15,
        "water": 10,
        "operations": 10,
        "subsurface": 5
      },
      "status": "insufficient-data",
      "reason": "Requires at least 70% weighted coverage and up to three measured dimensions. No missing value is treated as zero.",
      "confidence": null,
      "method": "starman-distance-v1; heuristic thresholds, not scientific validation"
    }
  }
}
```

**Status codes** 200, `400 INVALID_QUERY`, `404 NOT_FOUND`, `405 METHOD_NOT_ALLOWED`, `500 INTERNAL_ERROR`, `204` for OPTIONS.

**Cache** `public, max-age=60, s-maxage=3600, stale-while-revalidate=86400`

```ts
const result = await api.get<DataResponse<RankedAnalog>>('/api/analogs/cerro-prieto-gusev');
```

## GET /api/locations/{id}

Vercel rewrites this request to /api/locations?id={id}.

| Parameter | Type | Required | Meaning | Example |
| --- | --- | --- | --- | --- |
| `id` (path) | string | Yes | Case-sensitive catalog record ID supplied in the URL path. | `cerro-prieto` |
| `location` (query) | string | No | Filter by the exact Earth location or image location ID. | — |
| `planet` (query) | `Moon` or `Mars` | No | Filter the catalog by destination body. Values are case-sensitive. | `Mars` |
| `type` (query) | `environmental` or `geological` or `process` or `operational` | No | Require this analog type. | `process` |
| `confidence` (query) | `low` or `medium` or `high` | No | Minimum research confidence (low, medium, high). | `medium` |

```sh
curl -i 'http://localhost:3000/api/locations/cerro-prieto'
```

### HTTP 200 example (excerpt)

```json
{
  "data": {
    "id": "cerro-prieto",
    "name": "Cerro Prieto geothermal region",
    "latitude": 32.418,
    "longitude": -115.305,
    "coordinateSystem": "EPSG:4326",
    "coordinateRole": "GVP volcano reference point; not geothermal reservoir centroid"
  }
}
```

**Status codes** 200, `400 INVALID_QUERY`, `404 NOT_FOUND`, `405 METHOD_NOT_ALLOWED`, `500 INTERNAL_ERROR`, `204` for OPTIONS.

**Cache** `public, max-age=60, s-maxage=3600, stale-while-revalidate=86400`

```ts
const result = await api.get<DataResponse<EarthLocation>>('/api/locations/cerro-prieto');
```

## GET /api/planets/mars

Vercel rewrites this request to /api/planetary?planet=Mars. With id, returns a single site on that body.

| Parameter | Type | Required | Meaning | Example |
| --- | --- | --- | --- | --- |
| `id` (query) | string | No | Case-sensitive record ID. When supplied, returns detail and bypasses pagination. | — |
| `page` (query) | integer | No | One-based page. Send digits with no leading zero. | `1` |
| `limit` (query) | integer | No | Page size. Send digits with no leading zero. | `1` |

```sh
curl -i 'http://localhost:3000/api/planets/mars?limit=1'
```

### HTTP 200 example (excerpt)

```json
{
  "data": [
    {
      "id": "gusev",
      "name": "Gusev crater / Spirit traverse",
      "planet": "Mars",
      "latitude": -14.5692,
      "longitude": 175.4729
    }
  ],
  "meta": {
    "total": 2,
    "page": 1,
    "limit": 1,
    "version": "1.0.0"
  }
}
```

**Status codes** 200, `400 INVALID_QUERY`, `404 NOT_FOUND`, `405 METHOD_NOT_ALLOWED`, `500 INTERNAL_ERROR`, `204` for OPTIONS.

**Cache** `public, max-age=60, s-maxage=3600, stale-while-revalidate=86400`

```ts
const result = await api.get<CollectionResponse<PlanetaryLocation>>('/api/planets/mars', new URLSearchParams('limit=1'));
```

## GET /api/planets/moon

Vercel rewrites this request to /api/planetary?planet=Moon. With id, returns a single site on that body.

| Parameter | Type | Required | Meaning | Example |
| --- | --- | --- | --- | --- |
| `id` (query) | string | No | Case-sensitive record ID. When supplied, returns detail and bypasses pagination. | — |
| `page` (query) | integer | No | One-based page. Send digits with no leading zero. | `1` |
| `limit` (query) | integer | No | Page size. Send digits with no leading zero. | `1` |

```sh
curl -i 'http://localhost:3000/api/planets/moon?limit=1'
```

### HTTP 200 example (excerpt)

```json
{
  "data": [
    {
      "id": "tranquillitatis",
      "name": "Mare Tranquillitatis basalt plains",
      "planet": "Moon",
      "latitude": 0.68,
      "longitude": 23.43
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 1,
    "version": "1.0.0"
  }
}
```

**Status codes** 200, `400 INVALID_QUERY`, `404 NOT_FOUND`, `405 METHOD_NOT_ALLOWED`, `500 INTERNAL_ERROR`, `204` for OPTIONS.

**Cache** `public, max-age=60, s-maxage=3600, stale-while-revalidate=86400`

```ts
const result = await api.get<CollectionResponse<PlanetaryLocation>>('/api/planets/moon', new URLSearchParams('limit=1'));
```
