# Terranauta dataset access guide

Checked November 14, 2026 for the November 15 NASA Space Apps demo. The [challenge Resources tab](https://www.spaceappschallenge.org/2026/challenges/permanent-moon-base-locations-and-mars/?tab=resources) returned HTTP 503 in this environment. The eleven resources below follow the supplied list.

**Verified with a sample** identifies what was retrieved, such as a browse image, metadata record, or byte range. **Documented but untested** identifies a provider-described workflow whose data download or processing has yet to run. **Blocked** identifies the missing account, permission, or service response.

The demo ships three small WebP previews and two curated Diviner values. It requires zero data-provider logins at runtime. Run sample commands and store originals outside the repository. Environment variable names below are conventions for optional local tooling. Store secrets in a local secret store or server-side environment. Never prefix them with `VITE_` or expose them to frontend code.

## 1. NASA Worldview

**Verified with samples.** NASA Worldview / GIBS **Terra MODIS Corrected Reflectance (True Color)**, layer ID `MODIS_Terra_CorrectedReflectance_TrueColor`. It is a daylight true-color image layer with 250 m nominal source resolution. The imagery records reflected sunlight, with no air or surface temperature units. The exported view has its own pixel dimensions. The date is the selected UTC imagery day.

| Analog | Worldview view | Export bounding box in EPSG:4326 axis order | JPEG output |
| --- | --- | --- | --- |
| McMurdo Dry Valleys, Antarctica | [2024-01-15](https://worldview.earthdata.nasa.gov/?v=159,-78.5,167,-76.5&l=MODIS_Terra_CorrectedReflectance_TrueColor&t=2024-01-15) | `-78.5,159,-76.5,167` | 800 × 450 |
| Atacama Desert, Chile | [2024-06-15](https://worldview.earthdata.nasa.gov/?v=-70.7,-24.6,-67.5,-22&l=MODIS_Terra_CorrectedReflectance_TrueColor&t=2024-06-15) | `-24.6,-70.7,-22,-67.5` | 800 × 650 |

Both [Worldview](https://worldview.earthdata.nasa.gov/) links and [Worldview Snapshots](https://wvs.earthdata.nasa.gov/) exports responded. In the [documented manual workflow](https://www.earthdata.nasa.gov/data/tools/worldview-snapshots), select the date and layer, set a custom extent, and download the image. The Worldview `v` parameter uses west, south, east, north. The Snapshots API `BBOX` here uses south, west, north, east. No account for either. Credit NASA EOSDIS Worldview / GIBS and Terra MODIS, following [NASA Earthdata data use guidance](https://www.earthdata.nasa.gov/engage/open-data-services-software-policies/data-use-guidance).

```sh
curl -fLG https://wvs.earthdata.nasa.gov/api/v1/snapshot \
  --data-urlencode 'REQUEST=GetSnapshot' \
  --data-urlencode 'TIME=2024-06-15' \
  --data-urlencode 'BBOX=-24.6,-70.7,-22,-67.5' \
  --data-urlencode 'CRS=EPSG:4326' \
  --data-urlencode 'LAYERS=MODIS_Terra_CorrectedReflectance_TrueColor' \
  --data-urlencode 'WRAP=day' --data-urlencode 'FORMAT=image/jpeg' \
  --data-urlencode 'WIDTH=800' --data-urlencode 'HEIGHT=650' \
  -o /tmp/atacama.jpg
```

For Antarctica, use the other row's date, box and output dimensions. Convert the JPEG exports with `magick input.jpg -strip -quality 83 output.webp`.

## 2. LRO Diviner Lunar Data

**Verified with a sample.** [Diviner archive](https://pds-geosciences.wustl.edu/missions/lro/diviner.htm), south Polar Resource Product `DLRE_PRP_SOUTH.TAB`, [PDS3 dataset V2.0](https://doi.org/10.17189/1520650), PDS4 logical ID `urn:nasa:pds:lro_diviner_derived1:data_derived_prp:dlre_prp_south::1.0` (native product version 2). Public anonymous HTTPS. Credit NASA PDS Geosciences, LRO Diviner team / UCLA and cite [Paige et al. 2010](https://doi.org/10.1126/science.1187726) for the modeling method.

The [product notes](https://ode.rsl.wustl.edu/MArs/pagehelp/Content/Missions_Instruments/Lunar%20Reconnaissance%20Orbiter%20%28LRO%29/DIVINER/PRP.htm) identify annual thermal model fits based on polar observations from the first year of mapping orbit. The PDS4 label provides the nominal mission and leaves exact start and stop dates inapplicable. The fixed-width ASCII table covers a square south-polar region reaching 80° S at the sides and beyond that at the corners. It contains 2.88 million Kaguya DEM triangles, with roughly 0.5 km grid spacing near the pole. Geometry is Cartesian triangular vertices in km plus planetocentric centroid latitude and east-positive longitude in degrees, on a 1737.4 km reference radius. This table has no Earth map CRS.

```sh
diviner=https://pds-geosciences.wustl.edu/lro/urn-nasa-pds-lro_diviner_derived1/data_derived_prp/dlre_prp_south
curl -fL "${diviner}.xml" -o /tmp/dlre_prp_south.xml
curl -fL --range 302651370-302653469 --max-filesize 1000000 \
  -D /tmp/diviner-headers "${diviner}.tab?sample=302651370" -o /tmp/diviner.tab
awk -F, 'NR==6 || NR==7 {print $11, $12, $14}' /tmp/diviner.tab
```

Expect HTTP 206 and `Content-Range: bytes 302651370-302653469/604800210`. Rows 6 and 7 of this slice give 214.341 K and 291.989 K at their respective triangle centroids. The card rounds to 0.1 K. Field 14, `temp_max`, is the modeled annual maximum at the surface. Field 13, `temp_avg`, is the modeled annual mean **2 cm below** the surface and is outside this comparison. The `-999` exclusion value in `ice_depth` is outside the valid range and cannot serve as a detection of ice. Treat absent values as missing. Each maximum may occur at a different time. An Earth air-temperature observation, an Earth thermal-infrared land-surface estimate, and this lunar modeled surface maximum represent different quantities.

## 3. NASA Planetary Data System (Mars)

**Verified with a sample.** [PDS](https://pds.nasa.gov/) → [HiRISE product landing page](https://www.uahirise.org/ESP_023957_1755), MRO HiRISE RDR `ESP_023957_1755_RED` v1.0 from `MRO-M-HIRISE-3-RDR-V1.1`. Observed 2011-09-06 at 14:10 Mars local time. The label gives a footprint of approximately 4.7043–4.4125° S (latitude −4.7043° to −4.4125°) and 137.4275–137.5538° E. The full JP2 product is equirectangular, planetocentric, east-positive, north-up, 0.25 m/pixel. The app displays a grayscale crop of the reduced browse image. Its pixels carry no quantitative terrain values or physical units. No account. HiRISE usage policy grants public-domain reuse and requests **NASA/JPL-Caltech/UArizona** credit, as shown on the landing page.

```sh
hirise=https://hirise-pds.lpl.arizona.edu/PDS
scene=ESP/ORB_023900_023999/ESP_023957_1755/ESP_023957_1755_RED
curl -fL "$hirise/RDR/$scene.LBL" -o /tmp/hirise.lbl
curl -fL "$hirise/EXTRAS/RDR/$scene.browse.jpg" -o /tmp/hirise.jpg
magick /tmp/hirise.jpg -gravity center -crop 2048x1600+0+0 +repage \
  -resize 800x625 -strip -quality 82 /tmp/gale-hirise.webp
```

## 4. Lunar Reconnaissance Orbiter archive

[Mission archive](https://pds-geosciences.wustl.edu/missions/lro/). Both products are optional terrain context for the polar comparison. Leave them out of the app unless their labels and coordinate systems are reviewed together with Diviner.

- **LROC WAC, verified with a browse tile.** [WAC_ROI_SOUTH_SUMMER_100M](https://data.lroc.im-ldi.com/lroc/view_rdr_product/WAC_ROI_SOUTH_SUMMER_100M), RDR `LRO-L-LROC-5-RDR-V1.0`. Summer mosaic of images acquired 2010-09-21 through 2010-10-23, polar stereographic, 90–45° S, 100 m/pixel, grayscale reflectance imagery. Open the product viewer for a browse sample. The [lowest-resolution JPEG tile](https://data.lroc.im-ldi.com/ptif/zoomify/ser/estore/lroc/web/LRO-L-LROC-5-RDR-V1.0/LROLRC_2001/EXTRAS/BROWSE/WAC_ROI/WAC_ROI_SOUTH_SUMMER/WAC_ROI_SOUTH_SUMMER_100M.PYR.TIF/TileGroup0/0-0-0.jpg) returned successfully. The viewer links the full PDS IMG and browse TIFF. The legacy detached-label URL redirected to a 404. Confirm the current PDS label before ingest. No account for the public viewer. The PDS archive imagery is public domain per the [LROC Terms of Use & Citation Policy](https://lroc.im-ldi.com/about/terms). Credit NASA/GSFC/Arizona State University for educational use.
- **LOLA, verified with a browse JPEG.** [LDEM_875S_5M](https://imbrium.mit.edu/BROWSE/LOLA_GDR/POLAR/SOUTH_POLE/LDEM_875S_5M.html), 5 m grid for the lunar south pole to 87.5° S. For heights in meters use the [LOLA GDR archive](https://pds-geosciences.wustl.edu/missions/lro/lola.htm), open GDR and follow the product's IMG and label links or search the exact ID in Lunar ODE. Confirm the south polar stereographic parameters and label scaling before reading elevation. The [browse JPEG](https://imbrium.mit.edu/BROWSE/LOLA_GDR/POLAR/SOUTH_POLE/LDEM_875S_5M.JPG) was fetched anonymously. Use the label citation for data and credit NASA/GSFC LOLA for the browse. A rendered JPG is unsuitable for recovering elevations.

## 5. NASA Earthdata Search

**Verified with a metadata sample.** [Earthdata Search](https://search.earthdata.nasa.gov/) and [CMR Search API](https://cmr.earthdata.nasa.gov/search/site/docs/search/api.html). The inputs for reproducing Terra MODIS corrected-reflectance imagery are MODIS Level 1B visible-band radiances plus geolocation. The standard LAADS Collection 6.1 entries are listed below. The near-real-time records explain the parallel LANCE route. Worldview's daily export supplies no granule manifest, so the app cites the actual rendered layer and day.

| Product | Standard LAADS CMR concept (6.1) | LANCE MODIS CMR concept (6.1NRT) | Native sample spacing |
| --- | --- | --- | --- |
| [MOD02QKM](https://doi.org/10.5067/MODIS/MOD02QKM.061) | `C1378579425-LAADS` | `C1426416980-LANCEMODIS` | 250 m |
| [MOD02HKM](https://doi.org/10.5067/MODIS/MOD02HKM.061) | `C1378577630-LAADS` | `C1426415307-LANCEMODIS` | 500 m |
| [MOD021KM](https://doi.org/10.5067/MODIS/MOD021KM.061) | `C1378227407-LAADS` | `C1426414410-LANCEMODIS` | 1 km |
| [MOD03](https://doi.org/10.5067/MODIS/MOD03.061) | `C1379767668-LAADS` | `C1426422512-LANCEMODIS` | 1 km geolocation |

HDF-EOS Level 1B uses global orbit swaths and calibrated radiance in W/(m²·µm·sr), with reflectance and channel calibration information as documented. MOD03 contains geolocation fields such as latitude and longitude in degrees. Select the Calibrated Radiances collection and filter by date and drawing the site on the Earthdata Search map. Use the granule download panel or the LAADS link supplied in CMR. Catalogue search is anonymous. Granule transfer requires a [NASA Earthdata Login account](https://urs.earthdata.nasa.gov/) and LAADS authorization. A local LAADS automation can use a bearer token in `EARTHDATA_TOKEN`; raw transfer was not tested. Follow NASA Earthdata data use guidance and cite the exact granules and product DOIs.

```sh
curl -fLG https://cmr.earthdata.nasa.gov/search/granules.json \
  --data-urlencode 'collection_concept_id=C1378577630-LAADS' \
  --data-urlencode 'point=-68.19,-22.91' \
  --data-urlencode 'temporal=2024-06-15T00:00:00Z,2024-06-15T23:59:59Z' \
  --data-urlencode 'page_size=1'
```

This returned `MOD02HKM.A2024167.1430.061.2024168013750.hdf`. For Antarctica, point `163,-77.5` and date 2024-01-15 returned `MOD02HKM.A2024015.1030.061.2024015191849.hdf`.

## 6. Copernicus Data Space Ecosystem

**Verified with a metadata sample.** [CDSE](https://dataspace.copernicus.eu/) → [Sentinel-2 L2A](https://documentation.dataspace.copernicus.eu/Data/SentinelMissions/Sentinel2.html) → [OData Product Download](https://documentation.dataspace.copernicus.eu/APIs/OData.html#product-download). Atacama product `S2B_MSIL2A_20240616T143749_N0510_R096_T19KEQ_20240616T183637.SAFE`, processing baseline 05.10, MGRS tile 19KEQ, sensed June 16, 2024 at 14:37:49 UTC. Native SAFE contains JP2 bands of bottom-of-atmosphere reflectance (unitless after applying offsets and scale). The visible bands are 10 m and SWIR bands are 20 m. A SWIR/near-infrared preview could add a view of surface spectral differences around the salar. Avoid mineral or moisture identification based on color alone.

```sh
cdse_id=b70e54fe-531e-4b29-8968-0ba30f759cd9
curl -fL "https://catalogue.dataspace.copernicus.eu/odata/v1/Products($cdse_id)"
```

Use [Copernicus Browser](https://browser.dataspace.copernicus.eu/) with a free CDSE account, search Sentinel-2 L2A at 22.91° S, 68.19° W on 2024-06-16, select tile 19KEQ, and use Image Download on a small AOI. For whole-product download, use the OData `Products(<id>)/$value` endpoint on `download.dataspace.copernicus.eu` with an OAuth bearer token in `CDSE_ACCESS_TOKEN`. Token issuance and imagery transfer were untested. Use the [Sentinel terms](https://dataspace.copernicus.eu/terms-and-conditions) and credit a derived preview “Contains modified Copernicus Sentinel data 2024”.

## 7. RADARSAT-1 archive

**Verified with an Antarctic scene record and a GeoTIFF header sample.** [CSA catalogue](https://donnees-data.asc-csa.gc.ca/en/dataset/radarsat1), [CSA access guide](https://www.asc-csa.gc.ca/eng/satellites/radarsat1/data-access.asp), [EODMS STAC](https://www.eodms-sgdot.nrcan-rncan.gc.ca/search). The archived 1995–2013 RADARSAT-1 observations include `Radarsat-1-L1-COG`, a Level 1 cloud-optimized GeoTIFF collection. Antarctic coastal scene `5cca65b9-ba30-5abe-99cd-a0946f184347` / `RS1_11417_SNA_F694_19980111_105514_HH_GRF` was acquired January 11, 1998 at 10:54–10:55 UTC. It covers part of the Ross Sea coastal region. Inspect the polygon before picking a Dry Valleys crop. The catalogue lists C-band ScanSAR Narrow A, HH polarization, 50 m resolution and EPSG:4326. Read the scene calibration and georeferencing before interpreting radar values or overlaying the image. SAR can reveal surface patterns through clouds.

```sh
curl -fL 'https://www.eodms-sgdot.nrcan-rncan.gc.ca/search/search?collections=Radarsat-1-L1-COG&bbox=159,-78.5,167,-76.5&limit=1'
curl -fL --range 0-2047 --max-filesize 1000000 \
  'https://s3-ca-central-1.amazonaws.com/radarsat-r1-l1-cog/1998/1/RS1_11417_SNA_F694_19980111_105514_HH_GRF.tif' \
  -o /tmp/ross-sea-tiff-header.bin
```

Both sample requests work anonymously. For a full COG, download the selected STAC item's `assets.cog.href`. For an EODMS order from the archive, register for a free EODMS account, search **RADARSAT-1 Open Data Products**, add a scene to the cart, submit, then download the ZIP when EODMS emails the direct link. A future offline order client can read `EODMS_USERNAME` and `EODMS_PASSWORD`. The archive uses the [Open Government Licence – Canada](https://open.canada.ca/en/open-government-licence-canada). Credit “Contains information licensed under the Open Government Licence – Canada” and identify CSA and NRCan EODMS.

## 8. RADARSAT Constellation Mission

**Blocked for a McMurdo scene.** [CSA catalogue](https://donnees-data.asc-csa.gc.ca/en/dataset/rcm), [RCM access policy](https://www.asc-csa.gc.ca/eng/satellites/radarsat/access-to-data/about.asp), and [RCM User Licence Agreement](https://www.asc-csa.gc.ca/eng/satellites/radarsat/access-to-data/user-licence-agreement.asp). The [EODMS collection list](https://www.eodms-sgdot.nrcan-rncan.gc.ca/wes/rapi/collections) was accessible anonymously and lists `RCMImageProducts`. A public EODMS account grants access to a subset, including qualifying land scenes at 16 m or coarser and maritime scenes at 100 m or coarser, with latitude restrictions that vary by longitude and a west Greenland exception. The polar target at ~78° S is outside that published latitude band. An organization contact can request vetted access through CSA for additional products, subject to approval. No download or redistribution rights are assumed for a polar target.

A [public STAC query](https://www.eodms-sgdot.nrcan-rncan.gc.ca/search/search?collections=rcm-ard&bbox=-121.5,50.5,-121,50.9&limit=1) returned British Columbia CEOS-ARD L2 scene `8da4f42b-3ff0-453a-a987-9fad8bcdbe69` / `RCM1_OK3433412_PK3551239_1_SC30MCPD_20250405_141537_CH_CV_MLC` v1.2, acquired 2025-04-05. It reports 20 m product row and column spacing and provides Cloud Optimized GeoTIFF links plus a scene EULA. The image transfer is untested. Sign in to EODMS, select **RCM Image Products**, search a small AOI and time window, open one record, and check its authorization, processing level, resolution, calibration units, and supplied license before ordering. Public and vetted licences are separate. Keep `EODMS_USERNAME` and `EODMS_PASSWORD` outside the frontend if a future offline client needs them.

## 9. JAXA G-Portal

**Documented but untested for a granule.** [G-Portal](https://gportal.jaxa.jp/gpr/index/index) → [GCOM-C/SGLI L2 Snow and Ice Cover Extent (1 km)](https://eolp.jaxa.jp/GCOM-C_SGLI_L2_SICE_1km.html), `GCOM-C_SGLI_L2_SICE_1km`, current version 3. Optical daytime snow/ice coverage includes land and coastal areas over the globe. The product is tiled HDF5 in the provider's EQA projection at nominal 1 km. Read classifications and QA/cloud masks from the product format guide. A masked pixel supplies no comparable measurement.

Select GCOM-C / SGLI → Snow and Ice Cover Extent (1 km), version 3, draw the McMurdo AOI and search around 2024-01-15. Open one daytime granule, inspect its tile footprint, then download the HDF5 from the result. The DOI record and portal opened. A G-Portal account is required for file downloads. No environment variable is required for manual access. For future offline scripting, use local `JAXA_GPORTAL_USERNAME` and `JAXA_GPORTAL_PASSWORD` if required by the chosen supported method. Follow the [G-Portal terms](https://www.gportal.jaxa.jp/gpr/index/eula?lang=en) and cite JAXA and product DOI [10.57746/EO.01gs73b3r610h7k9esgkqz9b3q](https://doi.org/10.57746/EO.01gs73b3r610h7k9esgkqz9b3q).

## 10. ESA Open Science Catalog

**Verified with a provider file sample.** Open the [Antarctic Ice Sheet monthly ice velocity catalog record](https://esa-earthcode.github.io/open-science-catalog-metadata/products/ice-sheet-velocity-antarctic-2021/collection.json) from the ESA Open Science Catalog's [Ice Velocity category](https://opensciencedata.esa.int/variables/ice-velocity/catalog). ENVEO produced the 2014–2021 Sentinel-1 monthly dataset for ESA Antarctic Ice Sheet CCI. The verified January 2021 [STAC item](https://esa-earthcode.github.io/open-science-catalog-metadata/products/ice-sheet-velocity-antarctic-2021/20210101-ESACCI-L3C-AIS-IV-S1-1M_200m-fv1.0.json) is file version 1.0, NetCDF4, Antarctic Polar Stereographic (EPSG:3031), 200 m grid spacing. The velocity variables are in m/day, and the measurement count gives context about data coverage. The record links a [provider archive](https://cryoportal.enveo.at/data_files/2021-ESACCI-L3C-AIS-IV-S1-1M_200m-fv1.1_20220420.zip), which returned HTTP 500 to a sample request. Follow the STAC item's data asset for the working anonymous file route, or the collection's [notebook](https://github.com/ESA-EarthCODE/data_access_examples/blob/main/ice_velocity/access.ipynb) to subset the Zarr store.

```sh
curl -fL --range 0-511 --max-filesize 1000000 \
  'https://s3.waw4-1.cloudferro.com/EarthCODE/OSCAssets/4DANTARCTICA/antarctic-ice-velocity-monthly-2021/20210101-ESACCI-L3C-AIS-IV-S1-1M_200m-fv1.0.nc' \
  -o /tmp/antarctic-velocity-header.bin
```

The NetCDF4 header returned HTTP 206. The whole file is about 2.54 GB. The [Antarctic Ice Sheet CCI terms](https://artefacts.ceda.ac.uk/licences/specific_licences/esacci_icesheets_antarctic_terms_and_conditions.pdf) require credit to ESA CCI, the Antarctic Ice Sheet CCI project and ENVEO. Include the exact record/version and any relevant DOI. Check the month's valid-data mask when requesting a subset. An earlier [ENVEO/CEDA release](https://catalogue.ceda.ac.uk/uuid/00fe090efc58446e8980992a617f632f/) covers January 2017 to August 2020.

## 11. CSA Synthetic Aperture Radar Python tutorial

**Verified with the README sample.** [CSA SAR tutorial](https://github.com/asc-csa/Synthetic_Aperture_Radar_Tutorial) → choose **Option 1 - QGIS** or **Option 2 - Python**. The README links the [RCM3 OK2080033 British Columbia wildfire input](https://donnees-data.asc-csa.gc.ca/users/OpenData_DonneesOuvertes/pub/BC%20fires/) and [Natural Earth vector downloads](https://www.naturalearthdata.com/features/). The tutorial uses raster TIFF and vector shapefiles, illustrates plotting with GDAL/Cartopy/Matplotlib, and supplies no harmonized physical units or resolution for a Terranauta comparison. Download the [README](https://raw.githubusercontent.com/asc-csa/Synthetic_Aperture_Radar_Tutorial/main/README.md) anonymously, then open a notebook or QGIS example and follow its sample paths. No GitHub account is needed. The [tutorial code license](https://github.com/asc-csa/Synthetic_Aperture_Radar_Tutorial/blob/main/LICENSE) is a modified MIT license. For imagery use the RCM terms plus the terms shipped with the scene. Natural Earth has separate [terms of use](https://www.naturalearthdata.com/about/terms-of-use/). The CSA sample-data directory returned HTTP 503. The notebook and scene have yet to be run for the demo. If adding a radar preview, crop, mask and stretch an approved product offline and export a small attributed WebP.

## Índice de Similitud Lunar (ILS)

El catálogo ILS usa cinco pares predefinidos entre Baja California/Sonora y la Luna. Los registros de entrada están en `pipeline/catalog/`. `earth-sites.json` y `moon-sites.json` definen los sitios y sus áreas de análisis (AOI). `measurements.json` registra los valores por ID de sitio y eje. `comparisons.json` vincula los sitios por ID y guarda los textos educativos. El generador reúne estas entradas en un `Comparison` con `EarthSite`, `MoonSite` y resultados de cada `Metric`. Las longitudes se expresan en grados con este positivo de −180 a 180. Algunos puntos son referencias cartográficas, como el centro de Shackleton. Hace falta elegir un tramo de su borde para medirlo.

### Fuentes previstas por eje

| Eje | Tierra | Luna | Condiciones para calcular la similitud |
| --- | --- | --- | --- |
| Pendiente | [Copernicus DEM GLO-30](https://documentation.dataspace.copernicus.eu/APIs/SentinelHub/Data/DEM.html) | [LROC NAC DTM](https://lroc.im-ldi.com/data), [LOLA](https://pds-geosciences.wustl.edu/missions/lro/lola.htm) o [SLDEM2015](https://pgda.gsfc.nasa.gov/products/54) | Calcular la fracción con pendiente < 10° a la misma resolución efectiva. Para 30 m se necesita un DEM nativo de 30 m o más fino en ambos lados. |
| Rugosidad | [Sentinel-1 GRD IW](https://documentation.dataspace.copernicus.eu/Data/SentinelMissions/Sentinel1.html), VH–VV en dB | [LRO Mini-RF](https://pds-geosciences.wustl.edu/missions/lro/mrf.htm), CPR banda S | Documentar las poblaciones de referencia para los percentiles, así como geometría y resolución del radar. |
| Mineralogía | [ASTER GED AG100 v3](https://doi.org/10.5067/COMMUNITY/ASTER_GED/AG100.003), emisividad de 100 m y apoyo de Sentinel-2 L2A | [Diviner GDR](https://pds-geosciences.wustl.edu/missions/lro/diviner.htm), Christiansen Feature (NEN) | Calibrar ambos indicadores a la escala félsica–máfica. Distinguir la muestra del cráter del contexto regional si la resolución es insuficiente. |
| Albedo | [Sentinel-2 L2A](https://documentation.dataspace.copernicus.eu/Data/SentinelMissions/Sentinel2.html), albedo estimado con cinco bandas | Diviner GDR, reflectancia solar | Seleccionar escenas válidas, registrar geometría de iluminación y validar la equivalencia de las bandas. LROC WAC a 643 nm da contexto monocromático. |
| Amplitud térmica | [Aqua MODIS MYD11A2 v061](https://doi.org/10.5067/MODIS/MYD11A2.061), LST diurna y nocturna de 8 días a escala de 1 km | [Diviner RCP/GCP y PRP](https://pds-geosciences.wustl.edu/missions/lro/diviner.htm) según latitud y cobertura | Aplicar QA y escala 0,02 K del producto terrestre. Registrar horas y periodo. Un máximo anual polar o la media de temperatura del aire de NASA POWER representan variables distintas de la amplitud térmica superficial. |
| Aridez | Sentinel-2 L2A, mediana del NDVI en temporada seca | Referencia de vegetación lunar fijada en 0 | Identificar el 0 como convención del ILS y conservar la fecha y máscara de la escena terrestre. |
| Hielo | [SMAP SPL3SMP_E](https://nsidc.org/data/spl3smp_e), humedad del suelo en grilla de 9 km | Diviner PRP, temperatura y estabilidad térmica | Evaluar la cobertura terrestre para AOI pequeñas y documentar cómo se asigna cada clase. La estabilidad térmica indica posibilidad física de hielo. |
| Polvo | [ISRIC SoilGrids](https://www.isric.org/explore/soilgrids), limo y arcilla a 250 m | Granulometría publicada de muestras de Apolo. Diviner Rock Abundance aporta contexto. | Convertir las unidades de cada producto a fracción y documentar el umbral y la representatividad. Si el raster SoilGrids reporta g/kg, dividir entre 1000 para obtener una fracción. |
| Cráteres | Copernicus DEM o literatura de El Elegante | LROC NAC DTM o literatura de Linné | Usar profundidad dividida entre diámetro. Aberturas de tubos y domos se describen cualitativamente mientras falte una métrica de cráter comparable. |

El Elegante y Linné tienen un eje de morfología calculable a partir de dimensiones publicadas por [Gutmann y Turrin](https://gsa.confex.com/gsa/2006RM/webprogram/Paper104697.html) y [Martellato et al.](https://doi.org/10.1111/maps.12892). Sus diferencias metodológicas se indican en la ficha. Los otros pares tienen el índice pendiente. Los valores históricos de Diviner incluidos en la demo polar son máximos anuales de dos celdas. Se conservan como evidencia contextual.

### Reproducir el catálogo

Desde la raíz del repo, con Python 3.10 o superior:

```sh
python3 pipeline/ils_pipeline.py
```

El comando usa la biblioteca estándar. Genera un manifiesto y un JSON por par en `data/lunar-analogs/`. Para repetir la generación sin modificar el catálogo del repositorio, usa `--out /tmp/lunar-analogs`. Para una comparación byte a byte, agrega `--generated-at` con el valor ISO-8601 de cualquiera de los archivos publicados del catálogo.

Para incorporar una medición, edita `measurements.json` y escribe en `<id_del_sitio>.<eje>` el `value`, `status` y `source`. Incluye `source_url`, `method`, `observed_at` y `resolution_m` donde correspondan. Usa `measured` para datos procesados por el equipo, `literature` para valores publicados y `reference` para convenciones explícitas. `placeholder` identifica un valor provisional. Si falta un valor, omite el lado o usa `null`.

El ILS es la media ponderada de los ejes con dos valores utilizables. La completitud es el peso de esos ejes dividido por el peso total de los nueve. Los valores provisionales quedan fuera. Cuando ambos lados tienen clase 0 utilizable en el eje de hielo, el peso baja a 0,5 y se activa `similitud_por_ausencia`. Las notas A/B/C corresponden al método del eje. Los puntajes parciales pueden cubrir ejes distintos entre pares.

Después de editar un registro, regenera y versiona el manifiesto y los archivos de detalle juntos. Si se agrega un par, incluye su importación estática en `server/lunarAnalogs.ts` para empaquetar el JSON con Vercel.

### Extraer datos fuera del servidor

- **Óptica.** Abre Sentinel-2 L2A en Copernicus Browser, pega `pipeline/evalscript_s2_indices.js` en Custom script y elige NDVI, ALBEDO o FERRIC. Dibuja el AOI y anota el ID de la escena, fecha, resolución y fórmula del índice. Usa la mediana para el eje NDVI. El script filtra píxeles inválidos mediante SCL y `dataMask` y solicita reflectancia al servicio.
- **Relieve.** Recorta el DEM con margen para cubrir todo el radio de búsqueda y de análisis. Usa una proyección métrica, píxeles cuadrados y el mismo tamaño de píxel para las pendientes comparables. En datos lunares consulta la etiqueta del producto para proyectar el centro a coordenadas X/Y. Guarda la cobertura, resolución efectiva y dimensiones junto a la medición.

```sh
python3 -m pip install -r pipeline/requirements.txt
gdalwarp -t_srs EPSG:32612 -tr 30 30 -r bilinear elegante.tif elegante_utm.tif
python3 pipeline/crater_dD.py elegante_utm.tif \
  --lonlat -113.3913 31.8467 --rmax 1500 --aoi-radius 1200
# Sustituye X e Y por el centro en metros en la proyección del DTM lunar.
python3 pipeline/crater_dD.py linne.tif \
  --xy X Y --rmax 2000 --aoi-radius 1650 --resample 30
```

El script radial está pensado para cráteres aislados. Revisa el borde, el fondo, los perfiles válidos y `slope_coverage` antes de registrar resultados. El catálogo público contiene JSON ligero generado con antelación.
