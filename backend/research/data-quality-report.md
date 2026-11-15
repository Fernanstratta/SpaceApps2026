# Release quality and open work

Release date: 2026-11-14. Scientific scope: three proposed pairs, three Earth markers, three planetary contextual markers, 39 source/discovery records and six imagery metadata/discovery records. This is an integration-ready research MVP, not a completed quantitative analog validation.

## Verified locally

* All JSON datasets parse and the public records pass strict Zod schemas.
* All source, comparison-location, imagery and measurement references resolve; IDs are unique.
* Earth and planetary numeric coordinate ranges are enforced separately. BLM degrees/decimal-minutes conversion is tested. Source coordinate-role and convention gaps are explicit.
* Each comparison has a 30-word summary, a 100–150-word explanation, three supported facts, three audience levels, limitations, an experiment and a quiz.
* NASA POWER requests succeeded for each marker. All three annual statistics reproduce from archived raw JSON and match stored SHA-256 values. Each has 366 valid daily values. Modeled grid-cell air temperature is distinguished from observed land-surface temperature.
* `npm test`: 14 passing tests, covering schema/references, geography, missing data, score mathematics, coverage thresholds, invalid queries, pagination/filtering, methods/cache headers, actual loopback HTTP serialization, frontend response parsing and existing eight-planet behavior.
* `npm run typecheck`: passes for existing and added API/server/frontend/tests.
* `npm run build`: existing Vite production build passes with the added React example.

## Runtime boundary

Vercel local development was attempted. Global config/cache writes were redirected to the workspace, but Vercel's builder dependency installer then failed with Windows `EPERM` while creating symlinks. No elevation or deployment was attempted. Handler tests and a real Node HTTP adapter pass; this does not certify Vercel's deployment routing or bundling. Run `vercel dev` or a preview deployment in the normal project environment before production release. No remote repository changes or deployment were made.

The GitHub connection retrieved source text from `Main`, but does not permit binary blob downloads. The original four image assets are absent from the research workspace copy. The update ZIP includes only changed/new files and must be applied over the original checkout, preserving its assets. The original APOD, health, planet handlers and existing comparison content are untouched. No screenshot/browser visual QA is claimed for the added example.

## Scientific limitations

No pair has measured multidimensional similarity. All overall scores are null. Evidence confidence is an editorial research assessment, not a posterior probability or experimentally measured accuracy. POWER context does not supply a suitable paired planetary temperature. No elevation distributions, terrain roughness, mineral overlaps, wind thresholds, resource yields or biological measurements were calculated.

All Earth coordinates are published representative markers, not validated study boundaries. GVP source datum is unspecified: WGS84 display is an explicitly flagged assumption. Planetary markers have east-positive longitude; source-unspecified latitude type remains flagged instead of being silently assigned a convention. Gusev uses the Spirit landing point, not Home Plate; Bagnold uses an orbital image center; the Moon point is regional. None supports navigation, permits, exact pixel sampling or a field expedition without further work.

One HiRISE observation has verified product ID, date and map scale. Other imagery records are discovery links with null product/date/preview fields. No image pair is co-registered. Unknown dates, licenses, spatial resolutions, administrative subdivisions and boundaries have not been fabricated to satisfy a schema.

## Source access audit

Scientific review used primary reports, official agency summaries and archive documentation. A separate reproducible URL transport check is stored in `url-checks.json`; it is not a scientific verification. Browser search access and direct HTTP differ: some reviewed GVP/USGS pages return 403 to scripted requests. A historical NASADEM licensing forum link returned 404 directly and is labeled metadata-only. An unavailable Earthdata GIBS URL was replaced with working official GIBS API documentation. CICESE and CONAGUA access failed. Portal entries do not claim that their science data were downloaded.

Catalog licenses are conservative: no universal NASA/USGS/third-party license is inferred from hosting alone. Asset-specific credits and product citations must be checked before importing new imagery. The mare source contains an apparent age-unit typo; that age is deliberately not used.

## Next release gates

1. Obtain survey/metadata-backed coordinate conventions and defensible boundaries, then extract NASADEM/INEGI and planetary DTM samples at matched support.
2. Select and QA Earth satellite granules and corresponding planetary scenes; add real previews with correct credits and resolution labels.
3. Pair host composition, mineral assemblages or grain distributions with detection limits and uncertainty. Publish the normalization tolerance rationale before numerical scores.
4. Deepen Laguna Salada, Cucapá and El Mayor work with local geological publications; the wider regional table is an explicitly unvalidated research queue.
5. Run the original repository plus overlay in Vercel preview and perform browser/accessibility QA before releasing publicly.

The scientifically honest demo remains usable now: browse sourced comparisons, inspect missing evidence, change mission questions and design experiments without invented percentages.
