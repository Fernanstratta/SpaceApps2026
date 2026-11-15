# Baja California planetary analog research

2026-11-14 · Hackathon MVP · Three proposed pairs

## Findings and editorial priority

This is a prioritized research shortlist, not a numerical similarity leaderboard.

1. **Cerro Prieto → Gusev / Spirit alteration.** Best local process investigation. Historical sampling ties surface alteration to a geothermal system hosted in delta sediments ([Valette-Silver et al., 1981](https://www.osti.gov/servlets/purl/891301)). Spirit's altered materials motivate a comparison of water–rock reactions ([NASA ARES](https://ares.jsc.nasa.gov/missions/mer/important-discoveries.html/1000)). The pair is proposed here, not claimed as a published validated analog. Silica alone cannot determine a unique pathway; [NASA's comparison](https://science.nasa.gov/resource/alteration-effects-at-gale-and-gusev-craters/) also supports Gale as an alternative. Use this case for sampling design and habitability hypotheses, not evidence of Martian life.
2. **Algodones, California → Bagnold dunes, Mars.** Strong nearby operational and process candidate. A [USGS conference study](https://pubs.usgs.gov/publication/70240143) explicitly includes Algodones among terrestrial dune analog sites. [Bagnold rover observations](https://science.nasa.gov/resource/curiositys-bagnold-dunes-campaign-two-types-of-dunes/) add geological context to [identified HiRISE imagery](https://www.uahirise.org/ESP_035917_1755). The Earth site is in the United States, not Baja California. Dune shape does not establish matching grains, composition, transport thresholds or rover traction.
3. **San Quintín → Mare Tranquillitatis.** A useful broad volcanic-material and fieldwork comparison, with lower confidence in the exact pair. The [GVP profile](https://volcano.si.edu/volcano.cfm?vn=341002) describes basaltic and alkalic materials. [NASA's mare description](https://science.nasa.gov/image-detail/20100528/) supplies the lunar context. Practice texture description and sample selection. Do not call San Quintín a certified lunar simulant or assume equivalent eruption mechanics. Gusev volcanic plains remain an alternative, but the lunar example teaches a distinct limitation: terrestrial weathering differs from impact-produced lunar regolith.

## A less-obvious connection

Cerro Prieto suggests a **method for testing an orbital interpretation from the ground upward**. Compare altered and background sediment, then ask whether a remote spectral signal could distinguish addition from removal of material. This is an experimental proposal inspired by the historical surface/subsurface study and the NASA silica ambiguity, not a finding that the same assemblage or microbial ecology exists on Mars. Its educational value is learning to reject a plausible story when a control sample disagrees.

## What actual NASA Earth data adds

The released dataset includes NASA POWER 2024 mean daily 2 m air-temperature context: Cerro Prieto marker **24.31 °C**, Algodones marker **23.59 °C**, San Quintín marker **17.18 °C**. Each uses 366 valid daily samples. Source JSON, URLs and hashes are included in `raw/` and `power-ingestion.json`. These are modeled grid-cell values at the supplied points, not field measurements, annual extremes or surface temperatures. [POWER documentation](https://power.larc.nasa.gov/docs/tutorials/service-data-request/api/) explains the baseline meteorological resolution. These values are not used to compute planetary similarity.

HiRISE's identified observation provides a real acquisition date and map-projected scale for Gale dune context. No calibrated Earth/planet image pair, slope distribution or mineral overlap has been extracted. Product availability is distinct from completed analysis.

## Wider regional screening

Entries below are a research queue, not certified analogs. Unselected locations have no invented point coordinates or numerical scores in the public map.

| Candidate | Correct geography | Decision and next evidence needed |
|---|---|---|
| Laguna Salada | Baja California, Mexico | High next priority for basin hydrology; obtain measured evaporite assemblages and dated units before a Gale match. [Regional hydrology](https://www.usgs.gov/publications/just-add-water-and-colorado-river-still-reaches-sea) cautions against simplistic flooding/evaporation interpretations. Jezero carbonates are not interchangeable with generic salts. |
| Mexicali Valley | Baja California, Mexico | Regional sedimentary context for Cerro Prieto; agricultural disturbance must be separated from natural processes. No independent pair released. |
| Sierra Cucapá | Baja California, Mexico | Proposed rough-terrain operations study; need a licensed DEM, mapped lithology and sampled slopes. No tectonic equivalence claimed. |
| Sierra El Mayor | Baja California, Mexico | Proposed scarps/fractures fieldwork; need local structural mapping and rover-scale roughness. Earth plate tectonics cannot stand in for planetary tectonic histories. |
| Colorado River Delta | Baja California and Sonora, Mexico | Candidate sediment transport and hydrology teaching; separate delta morphology from specific Jezero depositional history. |
| Nearby Mexicali desert sites | Baja California, Mexico | Require named footprints, land access and actual sediment observations before adding map markers. |
| Sierra de San Pedro Mártir | Baja California, Mexico | Potential operational fieldwork; altitude or clear skies alone do not establish lunar/Martian environmental similarity. |
| Valle de los Cirios | Baja California, Mexico | Potential desert education; avoid treating aridity or visual resemblance as sufficient evidence. |
| Bahía de los Ángeles | Baja California, Mexico | Candidate arid terrain survey; coastal influences require explicit controls. |
| Baja California Sur volcanic/desert sites | Baja California Sur, Mexico | Broad request needs specific named geological units; defer rather than invent a single regional point. |
| El Vizcaíno and evaporitic environments | Baja California Sur and adjoining peninsula context | Resolve the exact desert/saltwork footprint and natural versus engineered evaporation before matching minerals. |
| Gran Desierto de Altar | Sonora, Mexico | Dune-process alternative; compare measured grain-size and wind regimes with Algodones before ranking. |
| El Pinacate | Sonora, Mexico | Volcanic terrain alternative; retain separate state, obtain product-specific chemistry and morphology. |
| Salton Sea geothermal region | California, United States | Geothermal process alternative; no transfer of Cerro Prieto observations without site-specific references. |

## Dataset discovery decisions

The machine-readable source catalog records access status, institution, URL, identifiers where known, coverage, variables, licenses, resolution and limitations. Unknown fields are null.

* Earthdata Search and Giovanni are discovery/analysis services, not measurements. GIBS and Earth Observatory are useful visual context; browse imagery must not be treated as calibrated physical data. Existing repository visual comparisons remain intact in the update overlay.
* Landsat C2 L2 is suitable for spectral/context mapping and qualified surface-temperature work after QA and scale factors. MODIS LST is a coarse thermal product; VIIRS LST is an alternative collection to select later, not an ingested product here. NASADEM/SRTM provides regional topography; local rock hazards need finer data. Earthdata catalog pages returned 403 during browsing.
* SMAP supplies coarse soil-moisture context, not individual rover-path strength. Atmospheric aerosol optical depth from MODIS/VIIRS is a possible dust-monitoring extension; it is not deposited dust mass, grain size or abrasiveness. No aerosol collection or observations are claimed in this release.
* LRO/LOLA supplies topographic context, LROC imagery, and Diviner thermal constraints. Lunar Prospector elemental signals and Chandrayaan instrument holdings require product-level interpretation before mineral matching. The PDS archive directories were accessed; corresponding new grids were not extracted.
* MRO HiRISE supports fine morphology, CTX broad context and CRISM spectral hypotheses. MOLA, Odyssey THEMIS, rover archives and ESA Mars Express are cataloged acquisition pathways. Image center is not a dune sample; raster longitude/latitude conventions must come from product labels.
* INEGI and SGM portals opened without extractable data. CONAGUA was inaccessible, CICESE timed out, UNAM's institutional portal was accessible, and USGS astrogeology returned 403. These conditions are documented, not filled with synthetic measurements.

## Settlement relevance

The contribution is better investigation and engineering practice: choosing representative samples, identifying terrain hazards, handling ambiguous mineral evidence and designing controlled rover tests. ISRU needs target-specific composition, extraction energetics and resource volumes; none is established by this MVP. Heat tolerance in Mexicali demonstrates no survivability on Mars or the Moon. Life support, radiation protection, pressure containment and low-gravity operations remain separate requirements.
