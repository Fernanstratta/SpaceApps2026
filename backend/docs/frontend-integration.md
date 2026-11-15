# React + TypeScript integration

Starman's shipped frontend uses same-origin Fetch. [spaceApi.ts](../src/lib/spaceApi.ts) provides typed calls for health, planets, APOD, and lunar pairs. [analogApiClient.ts](../src/lib/analogApiClient.ts) validates regional rankings and sources at runtime. The [endpoint reference](api-reference.md) shows a typed Fetch call for each path.

## Add a reusable client

Copy [starmanClient.ts](examples/starmanClient.ts) and use `createStarmanClient()` when Vite and the API share a Vercel origin. The client sends GET, accepts an `AbortSignal`, surfaces application errors as `StarmanApiError`, and handles non-JSON server failures. The generic parameter supplies the expected response type. Use the regional Zod schemas or a validator built from OpenAPI when the application also needs runtime validation of payload fields.

Shared contracts come from [spaceApiTypes.ts](../src/lib/spaceApiTypes.ts) and the [regional Zod types](../src/types/planetaryAnalog.ts). If you copy the examples to another project, copy the types or generate them from [OpenAPI](../public/docs/openapi.json) and adjust the relative imports. The geographic and evidence models use [analogValidation.ts](../src/lib/analogValidation.ts), which depends on Zod. The standalone lunar example uses the dependency-free space types.

### Configure a separate frontend

`VITE_API_BASE_URL` is a proposed name for a consuming Vite app. Starman does not read it. Add the public backend origin to that app’s `.env.local`.

```dotenv
VITE_API_BASE_URL=https://your-starman-deployment.vercel.app
```

```ts
import { createStarmanClient } from './starmanClient';

export const client = createStarmanClient(import.meta.env.VITE_API_BASE_URL ?? '');
```

Set the Vercel backend’s server-side `STARMAN_ALLOWED_ORIGINS` for a separate origin calling regional routes. To call all routes from a browser, use the same origin or a same-origin frontend proxy. Vite exposes `VITE_` variables to browser code, so put only the public origin in this variable. See [CORS troubleshooting](troubleshooting.md#browser-requests-and-cors).

## Render a real lunar comparison

Copy [LunarComparisonExample.tsx](examples/LunarComparisonExample.tsx) with the client and shared types. Render `<LunarComparisonExample />` in your app. The component loads the live pair index, selects a default, requests the detail, and renders scores and coverage. Change the pair to see a pending result. It shows loading, network or API error, and empty-list states. Effect cleanup cancels obsolete requests when a user changes the pair or leaves the view.

For a Mars comparison, get the site IDs from a regional analog record and send them as `earth` and `planetary` to `/api/compare`. The [comparison example in the API reference](api-reference.md#get-apicompare) uses Cerro Prieto and Gusev and returns both sites with imagery and citations.

Type-check the examples from the repository root with dependencies installed.

```sh
npx tsc --project docs/examples/tsconfig.json
```
