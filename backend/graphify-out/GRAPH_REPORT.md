# Graph Report - Starman  (2026-11-14)

## Corpus Check
- 16 files · ~2,331 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 1, .css 1)

## Summary
- 104 nodes · 173 edges · 16 communities (9 shown, 7 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4b38fccc`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- spaceApi.ts
- spaceApiTypes.ts
- compilerOptions
- server/apod.ts
- package.json
- dependencies
- devDependencies
- scripts
- allowScripts
- vite
- vercel.json
- @playwright/test@^1.65.1
- @types/react@^19.3.0
- @types/react-dom@^19.3.0
- vercel@^65.2.0

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 11 edges
2. `requireGet()` - 7 edges
3. `Frontend API` - 7 edges
4. `@vercel/node` - 6 edges
5. `mapLatestApod()` - 6 edges
6. `SpaceApiError` - 6 edges
7. `scripts` - 5 edges
8. `getPlanets()` - 5 edges
9. `getApod()` - 5 edges
10. `react` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Frontend API` --references--> `SpaceApiError`  [INFERRED]
  README.md → src/lib/spaceApi.ts
- `Frontend API` --references--> `getHealth()`  [INFERRED]
  README.md → src/lib/spaceApi.ts
- `Frontend API` --references--> `getPlanets()`  [INFERRED]
  README.md → src/lib/spaceApi.ts
- `Frontend API` --references--> `getApod()`  [INFERRED]
  README.md → src/lib/spaceApi.ts
- `handler()` --calls--> `requireGet()`  [EXTRACTED]
  api/health.ts → server/http.ts

## Import Cycles
- None detected.

## Communities (16 total, 7 thin omitted)

### Community 0 - "spaceApi.ts"
Cohesion: 0.19
Nodes (15): APOD fallback response, Deploy to Vercel, Frontend API, Planets response, Run locally, Starman Space Explorer, react, ApodCard() (+7 more)

### Community 1 - "spaceApiTypes.ts"
Cohesion: 0.22
Nodes (13): handler(), handler(), handler(), @vercel/node, getLatestApod(), requireGet(), planets, ApiError (+5 more)

### Community 2 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, exactOptionalPropertyTypes, jsx, lib, module, moduleResolution, noEmit, skipLibCheck (+4 more)

### Community 3 - "server/apod.ts"
Cohesion: 0.39
Nodes (8): fallback, httpsUrl(), imageLink(), isApodDate(), mapLatestApod(), nasaPage(), plainText(), Apod

### Community 4 - "package.json"
Cohesion: 0.29
Nodes (6): engines, node, name, private, type, version

### Community 5 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, html-to-text@^10.0.1, react@^19.3.1, react-dom@^19.3.1, html-to-text, react-dom

### Community 6 - "devDependencies"
Cohesion: 0.33
Nodes (6): devDependencies, @types/html-to-text@^9.0.4, typescript@^7.0.2, @vercel/node@^4.0.0, @types/html-to-text, typescript

### Community 7 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, dev:vercel, typecheck

### Community 8 - "allowScripts"
Cohesion: 0.67
Nodes (3): allowScripts, esbuild@0.14.47, esbuild@0.27.0

## Knowledge Gaps
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@vercel/node` connect `spaceApiTypes.ts` to `package.json`, `devDependencies`?**
  _High betweenness centrality (0.110) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `Frontend API` (e.g. with `getApod()` and `getHealth()`) actually correct?**
  _`Frontend API` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Why does `react` connect `spaceApi.ts` to `package.json`, `dependencies`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **Why does `html-to-text` connect `dependencies` to `server/apod.ts`, `package.json`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._