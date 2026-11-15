# Starman Space Explorer

**[API documentation](docs/README.md)** · [Endpoint quick reference](docs/api-cheatsheet.md) · [OpenAPI 3.1](public/docs/openapi.json) · [AI quick start](public/llms.txt)

Run `npm run dev:vercel` and open <http://localhost:3000/docs/index.html> to search the reference and try live API requests.

## Baja California analog extension

This update adds three traceable Earth–planet comparison records, modeled NASA POWER context, a Zod-validated API, adjustable scoring methodology, and an interactive evidence/quiz example. Similarity scores remain null until paired measurements exist. See [API integration](docs/analog-api.md), [research findings](research/baja-california-planetary-analogs.md), [methodology](research/methodology.md), [quality report](research/data-quality-report.md), and [demo narrative](docs/presentation-narrative.md).

Run `npm test`, `npm run typecheck`, and `npm run build` after installing dependencies. Use `npm run data:power` only for offline data refresh. The delivered source overlay must be applied to the original repository so its binary preview assets remain available.

Starman pairs a React, Vite, and TypeScript demo with twelve read-only TypeScript Vercel Functions. The app uses the same origin for UI and API requests and requires no student accounts, database, or NASA API key.

The **Comparador lunar** presents five Baja California/Sonora–Moon pairs across nine axes. See the [ILS data and reproduction guide](docs/dataset-access.md#índice-de-similitud-lunar-ils).

The **Earth analogs** section compares McMurdo with the lunar south pole and Atacama with Gale Crater using bundled previews and curated product records. See the [dataset access guide](docs/dataset-access.md) for provenance, sample downloads, and the eleven challenge resources.

## Run locally

Use Node.js 24 and npm. From the project root:

```sh
npm ci
npm run dev:vercel
```

Open http://localhost:3000. This command runs `vercel dev --local` so the UI and functions share a port. For a linked Vercel project, run `npx vercel dev` to use the project’s development settings. For a production frontend build and a type check of the UI and functions:

```sh
npm run build
npm run typecheck
```

## Deploy to Vercel

Import this repository into Vercel, use the repository root as the Root Directory, and select the **Vite** framework preset. The root `vercel.json` also sets the preset. Use Node.js 24, the default install and build commands, and the Vite output directory `dist`. The root `api/` directory deploys alongside `dist`. No environment variables are required.

To deploy through a linked CLI project:

```sh
npx vercel link
npx vercel deploy
npx vercel deploy --prod
```

The demo uses a single page and needs no catch-all rewrite. If the frontend adds client-side routes, exclude the API namespace from its catch-all, for example:

```json
{
  "framework": "vite",
  "rewrites": [
    { "source": "/((?!api(?:/|$)).*)", "destination": "/index.html" }
  ]
}
```

After adding a rewrite, repeat the API smoke checks below and visit a nested UI route.

## Frontend API

| Method and path | Successful JSON | Shared cache |
| --- | --- | --- |
| `GET /api/health` | `{ "status": "ok" }` | No cache |
| `GET /api/planets` | `{ "data": Planet[] }` in order from the Sun | 24 hours |
| `GET /api/lunar-analogs` | `{ "data": AnalogPairSummary[] }` | 24 hours |
| `GET /api/lunar-analogs?id=elegante_linne` | `{ "data": Comparison }` | 24 hours |
| `GET /api/apod` | `{ "data": Apod }` | NASA 15 minutes, fallback 1 minute |

```sh
curl -i http://localhost:3000/api/health
curl -i http://localhost:3000/api/planets
curl -i http://localhost:3000/api/apod
curl -i http://localhost:3000/api/lunar-analogs
curl -i 'http://localhost:3000/api/lunar-analogs?id=elegante_linne'
curl -i 'http://localhost:3000/api/lunar-analogs?id=missing' # 404 PAIR_NOT_FOUND
curl -i -X POST http://localhost:3000/api/lunar-analogs   # 405 Allow: GET
```

The space content and lunar ILS routes return HTTP 405 with `Allow: GET` for unsupported methods. The regional routes use `Allow: GET, OPTIONS` and offer CORS preflight. See the [error reference](docs/troubleshooting.md).

```json
{ "error": { "code": "METHOD_NOT_ALLOWED", "message": "Use GET for this endpoint." } }
```

`Apod.imageUrl` and `Apod.credit` can be `null`. Render a picture only when `imageUrl` is present. For video or iframe entries, `imageUrl` is `null` and `sourceUrl` opens NASA’s original entry. If present, render `credit` and keep the link to the original page. Render `description` as React text. `date` is the original APOD publication date in `YYYY-MM-DD` format. `source: "fallback"` identifies an archived entry, and its image path is relative to the app’s origin.

The mapper reads NASA’s [APOD Basic feed](https://science.nasa.gov/wp-json/wp/v2/apod-basic), which returns an array with dates, article permalinks, HTML explanations and credits, media types, and image URLs. It uses the newest usable entry and allows four seconds for the upstream request. Upstream failure yields the bundled [March 25, 2007 entry](https://science.nasa.gov/image-article/apod-2007-march-25-welcome-to-planet-earth/) with the Apollo 17 Crew, NASA credit.

Import `getHealth`, `getPlanets`, and `getApod` from [src/lib/spaceApi.ts](src/lib/spaceApi.ts). The content methods return the unwrapped payload and accept an optional `AbortSignal`. HTTP failures throw `SpaceApiError` with a status and code. Shared response types live in [src/lib/spaceApiTypes.ts](src/lib/spaceApiTypes.ts). See [ApodCard.tsx](src/examples/ApodCard.tsx) for loading, error, image, archive, and credit states, and [main.tsx](src/main.tsx) for the planets list.

### Lunar analog response

Use `getAnalogPairs(signal?)` for catalog summaries and `getAnalogPair(id, signal?)` for a detail with nine axes and educational notes. Each axis contains two side values (or `null`), provenance, a confidence grade, and `similarity`. The aggregate `ils.value` is `null` when there are no scored axes. `ils.data_completeness` reports the share of total axis weight covered, and `ils.has_placeholders` indicates that the detail contains provisional values. This route serves the ILS catalog. The [regional analog API](docs/analog-api.md) exposes its own format.

### Planets response

The live response includes all eight planets. This excerpt shows the first element.

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

### APOD fallback response

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
