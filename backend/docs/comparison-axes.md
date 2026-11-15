# The nine Lunar Similarity Index axes

`GET /api/lunar-analogs` lists five predefined Earth–Moon pairs. Request `GET /api/lunar-analogs?id=elegante_linne` to see both sites, all nine axes, and educational context. The ILS is generated offline by [ils_pipeline.py](../pipeline/ils_pipeline.py) from versioned site and measurement files. [The dataset guide](dataset-access.md#índice-de-similitud-lunar-ils) links the planned products and their preprocessing steps.

| Key and axis | Field, units, and valid range | Earth source or plan | Moon source or plan | Tolerance, weight, grade |
| --- | --- | --- | --- | --- |
| `slope` · Slope | `f_safe`, fraction with slope below 10°, 0–1 | Copernicus DEM GLO-30 | LOLA or LROC NAC DTM at a matched effective scale | 0.5 · 1.5 · A |
| `roughness` · Surface roughness | `roughness_percentile`, relative percentile on 0–1 | Sentinel-1 GRD IW radar with a reference population | LRO Mini-RF CPR with a reference population | 1 · 1 · B |
| `mineralogy` · Mineral composition | `mafic_score`, felsic-to-mafic scale, 0–1 | ASTER GED AG100 or Sentinel-2 L2A with calibration | Diviner GDR Christiansen Feature with calibration | 1 · 1.5 · B |
| `albedo` · Albedo and reflectance | `albedo_broadband`, fraction, 0–1 | Estimated from Sentinel-2 L2A | Diviner GDR solar reflectance | 0.15 · 1 · A |
| `thermal` · Day–night temperature amplitude | `delta_T`, Kelvin, positive | Aqua MODIS MYD11A2 surface temperatures | Diviner RCP, GCP, or PRP | 10× ratio · 1 · A |
| `aridity` · Aridity and vegetation | `ndvi_median`, NDVI, −1 to 1 | Dry-season Sentinel-2 L2A NDVI | Educational vegetation reference of 0 | 0.3 · 0.5 · A |
| `ice` · Moisture and ice stability | `volatile_class`, integer class 0–3 | SMAP SPL3SMP_E soil moisture | Thermal stability from Diviner PRP | 3 · 1 · C |
| `dust` · Dust and fine regolith | `fine_fraction`, fraction below approximately 63 µm, 0–1 | SoilGrids silt and clay | Published lunar sample grain-size data | 1 · 0.75 · C |
| `craters` · Crater morphology | `depth_diameter_ratio`, nonnegative d/D | DEM or published depth and diameter | LROC NAC DTM or published depth and diameter | 0.2 · 1 · B |

Use the same effective resolution for slope and document the reference populations for roughness. Mineralogy requires calibration across sensors. Broadband albedo depends on comparable bands and illumination. Thermal amplitude is a day–night surface temperature difference. An annual polar maximum and a two-meter air-temperature mean are separate variables. Label lunar NDVI as a reference convention when present. Ice stability describes conditions that could support ice. Dust fractions need a comparable grain-size threshold, spatial representativeness, and units. Crater d/D depends on how published studies locate the rim and floor.

## How scoring works

- **Linear axes** compute `100 × max(0, 1 − |earth − moon| / tolerance_R)`.
- **Thermal** uses `100 × max(0, 1 − |log10(earth) − log10(moon)| / log10(tolerance_R))`. Both temperatures are positive amplitudes in Kelvin.
- An axis contributes only when both sides have values and neither side is a `placeholder`. `measured`, `literature`, and `reference` values are eligible. A value of zero can be eligible. If both usable ice classes equal zero, the axis gets weight 0.5 and `flag: "similitud_por_ausencia"`.
- `ils.value` is the weighted mean over eligible axes, rounded to one decimal, or null when none qualify. `ils.data_completeness` is the used weight divided by the whole axis weight after the ice adjustment, rounded to four decimals. `axes_used` counts eligible axes. The unrounded per-axis scores feed the mean.

At the documented baseline, El Elegante–Linné has one scored axis. Published crater dimensions give approximately 0.1525 and 0.2332 for d/D, producing **59.7/100** with **10.81% weighted coverage**. The other four pairs have a null ILS and zero coverage. The [example component](examples/LunarComparisonExample.tsx) renders this weighted coverage next to the score.

## Render the result

1. Use `name_es`, `metric`, and `units` for each axis. For each side, show `value` and `status` plus `source` or `source_url` when available. `source_plan` provides planned inputs. Use side provenance for the actual input.
2. Use `available` and `similarity === null` for pending states. A non-null provisional side can appear in the UI with its `placeholder` status. A computed similarity of zero should display as 0.
3. Display the A/B/C method grade, `flag` when present, and the explanation in `education.breaks_es`. Keep coordinate status and weighted coverage visible.
4. Read `ils.has_placeholders` to flag provisional entries. Coverage and axis count let readers see which evidence supports a partial score.

## Regional scoring for Earth–Moon and Earth–Mars

`/api/analogs`, `/api/compare`, and `/api/rankings` return seven regional dimensions: `geology`, `terrain`, `environment`, `materials`, `water`, `operations`, and `subsurface`. Their `ranking` uses named presets or all seven custom weights. A dimension is eligible when it has a non-null score, positive weight, linked measurements, and a scored method other than `expert-preliminary`. An overall score requires at least 70% weighted coverage and at least the lesser of three or the number of active dimensions. It is rounded to two decimals. Current regional records return `insufficient-data`. Display `ranking.reason`, `ranking.missingDimensions`, and `ranking.coverage` alongside the result. The [regional methodology](../research/methodology.md) describes the heuristic and evidence limits.
