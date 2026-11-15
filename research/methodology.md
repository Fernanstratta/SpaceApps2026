# Starman analogy methodology, version 1

Prepared 2026-11-14. This release is a curated, traceable MVP, not a validation study.

## What the records mean

The entity is an Earth–planet pair. A verified observation supports a particular claim; it does not automatically validate the pair. All three proposed pairs have `evidenceStatus: hypothesis`. Claims separately distinguish verified source observations, interpretations, modeled values and hypotheses. Educational scenarios are explicitly labeled and are not mission predictions.

Geological analogy concerns materials and structures. Process analogy concerns a mechanism such as alteration or transport. Environmental analogy concerns conditions such as pressure or temperature. Operational analogy concerns tasks such as choosing samples or testing wheels. None of the released pairs qualifies as a complete environmental replica.

## Quantitative method

Seven dimensions use default weights: geology 25, terrain 20, environment 15, materials 15, water 10, operations 10, subsurface 5. These are project design choices, not calibrated scientific constants. Profiles in `src/lib/analogScoring.ts` provide geology, astrobiology, mobility, lunar operations, lunar resources and human training alternatives.

For commensurate scalar measurements, use `100 × max(0, 1 − |Earth − planetary| / tolerance)`. Tolerance must have a documented physical or mission requirement basis and the same units as the variable. This is not a probability. For identified mineral sets, Jaccard overlap is `100 × intersection / union`; an empty inventory returns unknown because nondetection is not demonstrated absence. Detection limits and abundance differences remain limitations.

Before applying either function, establish comparable spatial support, grain size, observation geometry, measurement meaning and units. Surface radiometric temperature, modeled annual maximum temperature and 2 m air temperature must not be scored against one another. Earth pressure and gravity differences cannot be normalized away to claim environmental equivalence.

Only dimensions with numerical scores, measurement references and a non-expert method enter the overall calculation. Unknowns are null, never zero. Overall score requires at least 70% of requested weight and at least three eligible dimensions, or all active dimensions when fewer than three are requested. This coverage threshold is an explicit engineering heuristic. Report coverage, missing dimensions and weights alongside the renormalized weighted mean. Expert preliminary scores are excluded from numerical ranking. Confidence is separately reported and conservatively takes the lowest confidence among eligible dimensions; it never multiplies the score.

No released pair has paired measurements sufficient for scoring. API ranking returns `overallScore: null`, coverage zero and a reason. Equal/unscored records use editorial research priority, with that distinction explained in the UI. Users may adjust weights but cannot manufacture missing measurements.

## Reproducible Earth context

`npm run data:power` requests T2M from NASA POWER for each representative marker, 2024-01-01 through 2024-12-31. It stores the original JSON, request URL, SHA-256 and valid-day count. The statistic is the arithmetic mean of valid daily 2 m air temperatures after masking fill values. It is grid reanalysis, not an onsite measurement and not land-surface temperature. Each of the three successful requests returned 366 days. No interpolation to individual landforms is claimed. See `research/power-ingestion.json` and `research/raw/`.

The Earth footprint is the source POWER grid cell selected by a point query. A representative point is not a field boundary. The BLM Osborne Overlook marker converts degrees plus decimal minutes to decimal degrees; GeoJSON orders longitude before latitude. GVP markers do not explicitly state datum, so their EPSG:4326 display assumption is flagged. Planetary coordinates remain separate records; source-unspecified latitude conventions are not silently described as planetocentric. Do not co-register these contextual points to pixels without product-label verification.

## Next terrain analysis

Obtain a NASADEM/INEGI tile and an appropriate planetary DTM with documented vertical datum. Clip independent, geologically justified footprints; do not invent boundaries from marker buffers. Reproject each to a body-specific local metric CRS, resample to a common physical posting, mask nodata and calculate slope distributions at the same baseline. Use robust percentiles rather than a single summit height. Quantify sensitivity to footprint and resolution before selecting a distance tolerance. No terrain statistics were calculated in this release because calibrated tiles were not retrieved.

## Publication checks

Runtime Zod parsing, reference checks, coordinate range checks, word counts, scoring tests, API input tests and the existing frontend build run locally. Range checks verify numerical validity; they do not constitute surveying or coordinate-frame certification. Catalog metadata can be available even when a source download is unavailable. All product-specific access gaps remain visible.
