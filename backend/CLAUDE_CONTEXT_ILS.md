# CONTEXTO DEL PROYECTO: Índice de Similitud Lunar (ILS), NASA Space Apps 2026

> **Para Claude en VS Code:** este archivo resume una conversación de diseño previa. Léelo completo antes de tocar el repositorio. Contiene las decisiones científicas ya tomadas, el contrato JSON entre Backend y Frontend, el código del pipeline de datos (al final, en el Apéndice) y la lista de tareas de implementación. **Explora primero el repo** (sección 7, tarea 0) y adapta todo a sus convenciones reales. Si algo de aquí contradice el código existente, el código existente manda; avísale al usuario en vez de imponer este documento.

---

## 1. Resumen

- **Evento:** NASA Space Apps Challenge 2026. Reto: *"Identify Earth Locations that Analog the Permanent Moon Base Locations and Mars"*.
- **Alcance decidido:** **solo la Luna** (Marte quedó fuera para tener más profundidad científica).
- **Equipo:** Mexicali, Baja California, México.
  - Pipeline de datos: el usuario (dueño de este documento).
  - Backend: Davis, Dylan, Magda.
  - Frontend y módulos educativos: Emmanuel, Sergio.
- **Entregable:** una WebApp educativa gratuita y abierta para estudiantes de secundaria, preparatoria y universidad, con un comparador visual Tierra vs. Luna lado a lado, módulos descargables y planes de lección para maestros.
- **Arquitectura:**
  1. **Pipeline (Python, offline):** pre-calcula las métricas y exporta JSON ligero. Nada de procesar datos satelitales pesados en el servidor.
  2. **API (Vercel Functions, TypeScript, solo lectura):** sirve esos JSON pre-calculados.
  3. **Frontend (React + Vite + TypeScript):** comparador y contenido educativo.

## 2. El repositorio base ("Terranauta Space Explorer")

Resumen del README que compartió el usuario:

- React + Vite + TypeScript, con **tres Vercel Functions de solo lectura en TypeScript** en `api/`. La UI y la API comparten origen.
- No hay cuentas, base de datos ni API key de NASA. **Mantener estas restricciones.**
- Node.js 24 y npm. Comandos: `npm ci`, `npm run dev:vercel` (que corre `vercel dev --local` en http://localhost:3000), `npm run build`, `npm run typecheck`.
- Endpoints actuales:

| Endpoint | Respuesta | Caché compartida |
|---|---|---|
| `GET /api/health` | `{ "status": "ok" }` | sin caché |
| `GET /api/planets` | `{ "data": Planet[] }` | 24 h |
| `GET /api/apod` | `{ "data": Apod }` | 15 min (NASA), 1 min (respaldo) |

- Cualquier método distinto de GET devuelve **405** con `Allow: GET` y este cuerpo:
  `{ "error": { "code": "METHOD_NOT_ALLOWED", "message": "Use GET for this endpoint." } }`
- Cliente: `src/lib/spaceApi.ts` exporta `getHealth`, `getPlanets` y `getApod`. Devuelven el payload sin envolver, aceptan `AbortSignal` opcional y lanzan `SpaceApiError` (con status y code) cuando falla HTTP.
- Tipos compartidos: `src/lib/spaceApiTypes.ts`.
- Ejemplos de estados de UI: `src/examples/ApodCard.tsx` (carga, error, imagen, archivo, crédito). La lista de planetas vive en `src/main.tsx`.
- Ya existe una sección **"Earth analogs"** que compara McMurdo con el polo sur lunar y Atacama con el cráter Gale, usando previsualizaciones empaquetadas y registros de productos curados. La documentación está en `docs/dataset-access.md`.
  - **Choca con lo que decidió el equipo:** solo Luna, y solo sitios de BC y Sonora. Gale está en Marte, y Atacama es justo el cliché que se quería evitar.
  - **No borres esa sección sin preguntar.** Propón reemplazarla o dejarla como "ejemplo previo".
- Si el frontend agrega rutas de cliente, la regla catch-all debe excluir `/api`, como indica el README: `"/((?!api(?:/|$)).*)"`.

## 3. Los 5 pares de sitios (todos en Baja California y Sonora)

| # | `pair_id` sugerido | Sitio terrestre | Lat, Lon | Sitio lunar | Lat, Lon (lunar) | Ejes fuertes |
|---|---|---|---|---|---|---|
| 1 | `laguna_salada_tranquillitatis` | Laguna Salada, BC (playa seca) | 32.36, −115.65 | Mare Tranquillitatis, sitio del Apolo 11 | 0.67°N, 23.47°E | 1, 6, 8 |
| 2 | `elegante_linne` | Cráter El Elegante, Son. (maar) | 31.8467, −113.3913 | Cráter Linné (Mare Serenitatis) | 27.73°N, 11.79°E | 9, 3, 4 |
| 3 | `pinacate_marius` | Escudo del Pinacate, Son. (coladas y conos) | 31.77, −113.49 | Marius Hills | ~14°N, ~56.8°W | 3, 4, 9, 2 |
| 4 | `cerro_prieto_gruithuisen` | Volcán Cerro Prieto, BC (domo de dacita) | 32.418, −115.305 | Domos de Gruithuisen | 36°N, 40°W | 3, 9 |
| 5 | `cucapa_shackleton` | Sierra Cucapá, BC (relieve escarpado) | 32.40, −115.50 | Borde del cráter Shackleton (Polo Sur) | ≈89.7°S | 1 (como zona de riesgo), 2, 4 |

Las coordenadas de Apolo 11, Marius Hills y Shackleton son valores de referencia. Hay que confirmarlas en LROC QuickMap antes de fijar las áreas de análisis (AOI).

Ranking esperado del ILS, útil para detectar errores en el pipeline: Elegante–Linné ≈ Pinacate–Marius > Cerro Prieto–Gruithuisen > Laguna Salada–Tranquillitatis > Cucapá–Shackleton.

### Datos clave y textos educativos de cada par

Estos son los textos base para el bloque `education` del JSON (match, gancho y dónde se rompe la analogía).

**1. Laguna Salada ↔ Tranquillitatis (Apolo 11)**
- *Datos:* lago seco endorreico a ~10 m bajo el nivel del mar, ~60 km × 17 km, a 30 km al SO de Mexicali. Famoso por sus tormentas de polvo de verano. Fue el epicentro del sismo de 2010.
- *Match:* el Apolo 11 eligió Tranquillitatis por ser una planicie plana; la laguna es casi toda pendiente < 10° y NDVI ≈ 0.
- *Gancho:* "¿Dónde aterrizarías si fueras la NASA?" El polvo sirve para hablar del polvo lunar.
- *Dónde se rompe:* el albedo (playa clara α ≈ 0.3–0.4 contra mare oscuro ≈ 0.07–0.1); los evaporitas; en la Tierra el polvo lo mueve el viento y en la Luna los impactos y la carga electrostática; además la laguna a veces se inunda (elegir fechas secas).
- *Extra:* el pozo de Mare Tranquillitatis (8.3355°N, 33.222°E) lleva a un conducto de cueva, según evidencia de radar publicada por Carrer et al. en Nature Astronomy en 2024.

**2. El Elegante ↔ Linné** (primer par que se implementa)
- *Datos:* El Elegante mide D = 1.6 km y d = 244 m, con coladas basálticas en las paredes; tiene ~32 ka y es freatomagmático; tuvo un lago (Gutmann, GSA 2006). Linné mide D = 2.23 km y d = 0.52 km; es un cráter simple Copernicano en Mare Serenitatis.
- *Match:* la escala más parecida del proyecto. Dos tazones con borde elevado y basalto.
- *Gancho:* calcular d/D en clase (0.15 contra 0.23). En el Pinacate entrenaron astronautas del Apolo 14 del 14 al 18 de febrero de 1970.
- *Dónde se rompe:* el origen es opuesto (explosión de vapor contra impacto); la erosión y el antiguo lago de El Elegante; la amplitud térmica (~40 K contra ~270 K); la gravedad de 1/6; El Elegante tiene plantas.

**3. Pinacate ↔ Marius Hills**
- *Datos:* escudo basáltico con coladas de más de 20 km, más de 400 conos cineríticos, varios tubos de lava y maares. Patrimonio de la UNESCO desde 2013.
- *Match:* basalto oscuro contra basalto oscuro, conos y domos, tubos de lava (Marius Hills tiene un *skylight*).
- *Gancho:* los astronautas del Apolo estudiaron estas rocas; está a ~3 h de Mexicali.
- *Dónde se rompe:* los tubos del Pinacate son demasiado pequeños para Sentinel-2 (el eje 9 usa presencia sí/no de literatura); con 1/6 de gravedad los tubos lunares pueden ser mucho más grandes; hay vegetación en los conos (enmascarar con NDVI).

**4. Cerro Prieto ↔ Domos de Gruithuisen**
- *Datos:* domo de dacita de 223 m, con ~68% de SiO₂; está en el campo geotérmico, a ~30 km al SSE de Mexicali. Su nombre en cucapá es Wee Ñaay ("Cerro Oscuro"). Los domos de Gruithuisen son silícicos, ricos en torio y pobres en FeO, de ~20 km cada uno; la misión Lunar-VISE (CLPS) va a Gruithuisen Gamma.
- *Match:* volcanismo silícico, el raro en la Luna. Es el mejor uso del Christiansen Feature (CF) de Diviner.
- *Gancho:* "Tenemos en Mexicali un tipo de volcán que en la Luna es un misterio sin resolver."
- *Dónde se rompe:* la Luna no tiene tectónica de placas ni agua, así que su magma silícico se formó de otra manera; la escala (223 m contra ~20 km); usar un AOI de ~2 km para no incluir cultivos ni lagunas geotérmicas.

**5. Sierra Cucapá ↔ Borde de Shackleton**
- *Datos:* sierra al SO de Mexicali, visible desde el Centro Cívico; su pico norte es El Centinela (32.62, −115.71, 781 m). Rocas graníticas y metamórficas.
- *Match:* el contraejemplo de seguridad: "aquí NO aterrizarías". Pendientes > 15°, rugosidad alta, roca clara rica en feldespato.
- *Gancho:* se ve todos los días desde la ciudad; el sismo El Mayor–Cucapah de 2010 lleva a hablar de los sismos lunares del Apolo.
- *Dónde se rompe:* el Sol rasante del polo, las trampas frías con hielo (eje 7: clase 3 contra 0, S = 0), granito con cuarzo y no anortosita.

**Nota general:** ningún sitio de la región tiene anortosita, la roca de las tierras altas lunares. Hay que explicarlo en la WebApp.

## 4. Los 9 ejes: métricas, fuentes y normalización

### Fórmulas

- **Lineal:** `S_i = 100 · max(0, 1 − |x_T − x_L| / R_i)`
- **Razón logarítmica** (para magnitudes que difieren por órdenes de magnitud): `S_i = 100 · max(0, 1 − |log10(x_T/x_L)| / log10(R_i))`
- **Percentiles:** cuando cada cuerpo usa un instrumento distinto, el valor se convierte a percentil dentro de su propio cuerpo y se compara linealmente con R = 1.
- **Índice total:** `ILS = Σ w_i·S_i / Σ w_i`, solo sobre los ejes disponibles.

### Tabla de ejes

| # | key | Métrica | Tierra (producto → fórmula) | Luna (producto → fórmula) | Modo | R | w | Conf. |
|---|---|---|---|---|---|---|---|---|
| 1 | slope | `f_safe`: fracción de píxeles con pendiente < 10° | Copernicus DEM GLO-30 → UTM | LOLA / SLDEM2015 / NAC DTM; **re-muestrear a la misma resolución (30 m)** | lineal | 0.5 | 1.5 | A |
| 2 | roughness | percentil | Sentinel-1 GRD IW: CR = σ⁰VH − σ⁰VV (dB) | Mini-RF CPR (banda S) | lineal | 1.0 | 1.0 | B |
| 3 | mineralogy | `mafic_score` 0–1 | ASTER GED AG100: índice máfico ε12/ε13; S2: B4/B2 (Fe³⁺), B12/B8A + B3/B4 (Fe²⁺) | Diviner GDR_L3 CF (versión NEN); opcional M3 IBD 1 µm | lineal | 1.0 | 1.5 | B |
| 4 | albedo | α de banda ancha | S2 L2A: 0.356·B2 + 0.130·B4 + 0.373·B8 + 0.085·B11 + 0.072·B12 − 0.0018 | Diviner GDR_L2, reflectancia solar 0.3–3 µm cerca del mediodía; alternativa LROC WAC 643 nm | lineal | 0.15 | 1.0 | A |
| 5 | thermal | ΔT (K) | MODIS MYD11A2 v061: LST_Day − LST_Night (factor 0.02) | Diviner RCP (128 ppd) o GCP: T(12:00) − T(05:30); polo: PRP | log | 10 | 1.0 | A |
| 6 | aridity | NDVI mediana | S2: (B8 − B4)/(B8 + B4), temporada seca más máximo anual | referencia = 0 | lineal | 0.3 | 0.5 | A |
| 7 | ice | clase 0–3 | SMAP SPL3SMP_E | Diviner PRP (hielo estable si T_max < ~110 K) | lineal | 3 | 1.0 (0.5 si ambos secos) | C |
| 8 | dust | fracción < ~63 µm | SoilGrids (limo + arcilla) | granulometría de suelos Apolo (literatura); Diviner RA como contexto | lineal | 1.0 | 0.75 | C |
| 9 | craters | d/D | DEM → `crater_dD.py` | NAC DTM / SLDEM2015 → `crater_dD.py` | lineal | 0.2 | 1.0 | B |

### Notas técnicas que no hay que olvidar

- **Sentinel-2 L2A:** desde la línea base 04.00 (enero de 2022), los .SAFE crudos usan ρ = (DN − 1000)/10000. En un Evalscript con unidades REFLECTANCE ya viene corregido. Enmascarar con SCL las clases 0, 1, 3, 8, 9, 10 y 11. Sentinel-2 **no tiene canal térmico**: para el eje 5 usar MODIS.
- **Diviner:**
  - Data Set ID: `LRO-L-DLRE-5-GDR-V1.0`. Bundle PDS4: `urn:nasa:pds:lro_diviner_derived1`.
  - GDR_L3 contiene CF, Rock Abundance (RA), temperatura del suelo y RMS. Los nombres de archivo siguen el patrón `DGDR_..._CF_CLC_CYL_rrr` y `DGDR_RA_AVG_CYL_rrr`.
  - GDR_L2 contiene la reflectancia solar y la temperatura de brillo.
  - Productos acumulados: GCP (2 ppd), RCP (128 ppd), PCP (polar), GHRM (128 ppd entre ±70°).
  - A ~1 km/px, el CF muestra un cráter de 2 km en ~2 píxeles: es un valor de contexto, no del cráter.
- **Eje 7 en los pares no polares:** seco contra seco da S = 100. Marcarlo con `flag: "similitud_por_ausencia"` y bajar su peso a 0.5.
- **Pendiente:** depende de la escala. Siempre comparar a la misma resolución.

## 5. Guía de extracción del par El Elegante ↔ Linné

**El Elegante:**
1. En Copernicus Browser, elige Sentinel-2 L2A con nubes < 10% y una fecha seca (abril–junio).
2. Pega `evalscript_s2_indices.js` en Custom script y cambia `INDEX` a `"NDVI"`, `"ALBEDO"` o `"FERRIC"`.
3. Dibuja un círculo de 1.2 km de radio y abre **Statistical info**. Anota la media y la desviación estándar.
4. DEM: descarga Copernicus DEM GLO-30 (OpenTopography o Copernicus Browser) y re-proyéctalo: `gdalwarp -t_srs EPSG:32612 -tr 30 30 -r bilinear in.tif elegante_utm.tif`.
5. Mide: `python crater_dD.py elegante_utm.tif --lonlat -113.3913 31.8467 --rmax 1500`.

**Linné:**
1. Busca el NAC DTM de Linné en LROC RDR (NAC DTMs); como respaldo, usa SLDEM2015.
2. Mide: `python crater_dD.py <dtm>.tif --xy <X> <Y> --rmax 2000`. Para el eje de pendiente agrega `--resample 30`.
3. En Lunar ODE (`ode.rsl.wustl.edu/moon`): Product Search → LRO → DIVINER → GDR_L2 (albedo) y GDR_L3 (CF NEN). Son mosaicos globales: recórtalos con GDAL, que lee etiquetas PDS3. Para la temperatura usa RCP o GCP.
4. LROC QuickMap sirve para revisar rápido el d/D (herramienta de perfil) y las capas de Diviner.

## 6. Contrato JSON (Backend → Frontend)

El pipeline genera un archivo por par. Ejemplo actual: `elegante_linne.json`. **Hoy la mayoría de los valores son `placeholder`.** El ILS de 75.6 es solo una prueba del pipeline, y `data_completeness` vale 0.11.

```ts
// Tipos sugeridos para src/lib/spaceApiTypes.ts (adaptar al estilo del repo)
export type ValueStatus = "measured" | "literature" | "reference" | "placeholder";
export type Confidence = "A" | "B" | "C";
export type SimilarityMode = "linear" | "log_ratio";

export interface AxisSideValue {
  value: number;
  status: ValueStatus;   // la UI NUNCA debe mostrar un placeholder como dato real
  source: string;
}

export interface AnalogAxis {
  id: number;            // 1..9
  key: "slope" | "roughness" | "mineralogy" | "albedo" | "thermal"
     | "aridity" | "ice" | "dust" | "craters";
  name_es: string;
  metric: string;
  units: string;
  mode: SimilarityMode;
  tolerance_R: number;
  weight: number;
  confidence: Confidence;
  flag: string | null;   // p. ej. "similitud_por_ausencia"
  earth: AxisSideValue | null;
  moon: AxisSideValue | null;
  similarity: number | null;  // 0..100
  available: boolean;
}

export interface AnalogSite {
  name: string;
  region: string;
  type_es: string;
  lat: number;
  lon: number;
  aoi: { shape: "circle"; radius_m: number; note: string };
  facts: Record<string, number>;
}

export interface AnalogPair {
  schema_version: string;
  generated_at: string;  // ISO-8601 UTC
  pair_id: string;
  title_es: string;
  earth_site: AnalogSite;
  moon_site: AnalogSite;
  axes: AnalogAxis[];    // siempre 9
  ils: {
    value: number | null;
    formula: string;
    axes_used: number;
    data_completeness: number;  // 0..1, fracción del peso con datos reales
    has_placeholders: boolean;
  };
  education: {
    match_es: string;
    hook_es: string;
    breaks_es: { axis: string; text: string }[];
  };
}
```

## 7. Tareas de implementación (en orden)

**0. Explorar antes de escribir código.** Lee el README, `vercel.json`, `tsconfig*.json`, `package.json`, `api/*.ts` (cómo validan el método, ponen caché y manejan errores), `src/lib/spaceApi.ts`, `src/lib/spaceApiTypes.ts`, la sección actual de Earth analogs y `docs/dataset-access.md`. Fíjate en cómo `api/planets` empaqueta sus datos estáticos y reutiliza ese mismo mecanismo.

1. **Pipeline:** crea `pipeline/` con `ils_pipeline.py`, `crater_dD.py`, `evalscript_s2_indices.js` y un `requirements.txt` (numpy y rasterio, solo para `crater_dD.py`). El código está en el Apéndice.
   - Cambia la salida por defecto a la ubicación de datos del repo (p. ej. `data/analogs/pairs/<pair_id>.json`; confirma la carpeta según cómo se empaquetan los datos de `planets`).
   - Agrega la generación de un manifiesto `data/analogs/index.json` con `pair_id`, `title_es`, los nombres de los sitios, las coordenadas, `ils.value`, `data_completeness` y `has_placeholders`.
   - Refactoriza para que haya un bloque `PAIR` por cada uno de los 5 pares (p. ej. `pipeline/pairs/*.py` o un YAML/JSON de entrada) y que el comando genere todos.
   - Rellena los otros 4 pares con los datos de la sección 3, con valores `placeholder` donde no haya medición.

2. **API** (siguiendo el patrón de `api/planets`):
   - `GET /api/analogs` → `{ "data": AnalogPairSummary[] }`
   - `GET /api/analogs?id=<pair_id>` → `{ "data": AnalogPair }`, o bien la ruta dinámica `api/analogs/[id].ts` si el repo ya usa ese estilo.
   - Para un id inexistente: **404** con `{ "error": { "code": "PAIR_NOT_FOUND", "message": "…" } }`.
   - Para métodos distintos de GET: 405 con `Allow: GET`, igual que los otros endpoints.
   - Caché compartida de 24 h, como `planets`. Los datos son estáticos y se regeneran con el pipeline.
   - Valida el `id` contra el manifiesto. Nunca construyas rutas de archivo a partir de la entrada del usuario.

3. **Cliente:** en `src/lib/spaceApi.ts`, agrega `getAnalogPairs(signal?)` y `getAnalogPair(id, signal?)`, que lancen `SpaceApiError`. Agrega los tipos de la sección 6 a `spaceApiTypes.ts`.

4. **Frontend** (lo trabajan Emmanuel y Sergio; prepara componentes base):
   - Comparador lado a lado Tierra vs. Luna.
   - Barras de S_i para los 9 ejes, con insignia de confianza A/B/C.
   - Insignia **"provisional"** en cada valor `placeholder`, y aviso global cuando `has_placeholders` sea true.
   - El ILS con su `data_completeness`.
   - Secciones Match, Gancho y "Dónde se rompe la analogía".
   - Estados de carga y error como en `ApodCard.tsx`. El texto se renderiza como texto de React, sin HTML.
   - **Pregunta al usuario** antes de quitar o reemplazar la sección McMurdo/Atacama/Gale.

5. **Documentación:** actualiza `docs/dataset-access.md` con la procedencia de cada producto (Sentinel-2 L2A, Copernicus DEM, MODIS MYD11A2, Diviner GDR/RCP, LROC NAC DTM, SLDEM2015, Mini-RF, ASTER GED, SMAP, SoilGrids) y cómo reproducir el pipeline.

6. **Verificación:** corre `npm run typecheck` y `npm run build`, y haz pruebas con curl de `/api/analogs`, `/api/analogs?id=elegante_linne`, un id inválido (debe dar 404) y un POST (debe dar 405).

**Restricciones:** sin base de datos, sin cuentas, sin API keys, Node 24, mismo origen y API de solo lectura. Los datos pesados nunca se procesan en el servidor.

## 8. Ideas pendientes (no implementadas todavía)

- Un script que recorte automáticamente los mosaicos de Diviner (GDR/RCP) a cada AOI y escriba los valores en los bloques `PAIR`.
- Usar la Statistical API de Sentinel Hub para automatizar las estadísticas de Sentinel-2, en lugar de copiarlas a mano desde Copernicus Browser.
- Módulos descargables y planes de lección para maestros, generados a partir de los textos de `education`.

---

# APÉNDICE: Código del pipeline (verificado)

Los tres archivos se ejecutaron y probaron:
- `ils_pipeline.py` genera y valida el JSON.
- `crater_dD.py` midió d/D = 0.151 en un cráter sintético de 1,600 m × 244 m (el valor real es 0.1525).
- La lógica de `evalscript_s2_indices.js` se probó con píxeles de ejemplo.


## `ils_pipeline.py`

```python
#!/usr/bin/env python3
"""
Pipeline ILS (Índice de Similitud Lunar) — NASA Space Apps Challenge 2026
Equipo Mexicali · Reto: Earth analogs of permanent Moon base locations

Toma los valores crudos de un sitio terrestre y uno lunar para los 9 ejes,
calcula la similitud por eje (S_i), el ILS ponderado y exporta el JSON que
el Backend sirve al Frontend.

Fórmulas:
  lineal:     S_i = 100 * max(0, 1 - |x_T - x_L| / R_i)
  log_ratio:  S_i = 100 * max(0, 1 - |log10(x_T / x_L)| / log10(R_i))
  ILS        = sum(w_i * S_i) / sum(w_i)   (solo ejes con dato disponible)

Solo usa la biblioteca estándar (json, math, datetime, pathlib).

Uso:
    python ils_pipeline.py                 # genera output/pairs/elegante_linne.json
    python ils_pipeline.py --out otra/ruta.json
"""

from __future__ import annotations

import argparse
import json
import math
from datetime import datetime, timezone
from pathlib import Path

SCHEMA_VERSION = "1.0.0"

# ---------------------------------------------------------------------------
# 1. DEFINICIÓN DE LOS 9 EJES (compartida por todos los pares)
#    R = tolerancia, w = peso por defecto, confidence = A/B/C (calidad del dato)
# ---------------------------------------------------------------------------
AXES = [
    {"id": 1, "key": "slope", "name_es": "Pendiente y seguridad de aterrizaje",
     "metric": "f_safe", "units": "fracción de píxeles con pendiente < 10°",
     "mode": "linear", "R": 0.5, "w": 1.5, "confidence": "A"},
    {"id": 2, "key": "roughness", "name_es": "Rugosidad superficial (radar)",
     "metric": "roughness_percentile", "units": "percentil dentro de su propio cuerpo (0–1)",
     "mode": "linear", "R": 1.0, "w": 1.0, "confidence": "B"},
    {"id": 3, "key": "mineralogy", "name_es": "Composición mineralógica",
     "metric": "mafic_score", "units": "escala félsico (0) – máfico (1)",
     "mode": "linear", "R": 1.0, "w": 1.5, "confidence": "B"},
    {"id": 4, "key": "albedo", "name_es": "Albedo y reflectancia óptica",
     "metric": "albedo_broadband", "units": "adimensional (0–1)",
     "mode": "linear", "R": 0.15, "w": 1.0, "confidence": "A"},
    {"id": 5, "key": "thermal", "name_es": "Amplitud térmica día/noche",
     "metric": "delta_T", "units": "K",
     "mode": "log_ratio", "R": 10.0, "w": 1.0, "confidence": "A"},
    {"id": 6, "key": "aridity", "name_es": "Aridez y ausencia biológica",
     "metric": "ndvi_median", "units": "NDVI (−1 a 1)",
     "mode": "linear", "R": 0.3, "w": 0.5, "confidence": "A"},
    {"id": 7, "key": "ice", "name_es": "Humedad / hielo subsuperficial",
     "metric": "volatile_class", "units": "clase 0–3 (0 seco … 3 hielo estable)",
     "mode": "linear", "R": 3.0, "w": 1.0, "confidence": "C"},
    {"id": 8, "key": "dust", "name_es": "Polvo y regolito fino",
     "metric": "fine_fraction", "units": "fracción de partículas < ~63 µm",
     "mode": "linear", "R": 1.0, "w": 0.75, "confidence": "C"},
    {"id": 9, "key": "craters", "name_es": "Morfología de cráteres y cavidades",
     "metric": "depth_diameter_ratio", "units": "d/D (adimensional)",
     "mode": "linear", "R": 0.2, "w": 1.0, "confidence": "B"},
]

# ---------------------------------------------------------------------------
# 2. DATOS DEL PAR  El Elegante ↔ Linné
#    status: "measured"    -> medido por el equipo con el pipeline
#            "literature"  -> tomado de una publicación (citar en `source`)
#            "reference"   -> valor teórico por definición (p. ej. NDVI lunar = 0)
#            "placeholder" -> VALOR PROVISIONAL, reemplazar antes de publicar
# ---------------------------------------------------------------------------
PAIR = {
    "pair_id": "elegante_linne",
    "title_es": "Cráter El Elegante ↔ Cráter Linné",
    "earth_site": {
        "name": "Cráter El Elegante",
        "region": "Reserva de la Biosfera El Pinacate y Gran Desierto de Altar, Sonora, México",
        "type_es": "Maar (cráter volcánico freatomagmático)",
        "lat": 31.8467, "lon": -113.3913,
        "aoi": {"shape": "circle", "radius_m": 1200,
                "note": "Interior + borde del cráter (borde a ~800 m del centro)"},
        "facts": {"diameter_m": 1609, "depth_m": 244, "age_ka": 32},
    },
    "moon_site": {
        "name": "Cráter Linné",
        "region": "Noroeste de Mare Serenitatis, Luna",
        "type_es": "Cráter de impacto simple (Copernicano)",
        "lat": 27.73, "lon": 11.79,
        "aoi": {"shape": "circle", "radius_m": 1650,
                "note": "Interior + borde del cráter (borde a ~1,115 m del centro)"},
        "facts": {"diameter_m": 2230, "depth_m": 520},
    },
    "raw": {
        "slope": {
            "earth": {"value": 0.62, "status": "placeholder",
                      "source": "Copernicus DEM GLO-30 re-proyectado a UTM 12N (EPSG:32612)"},
            "moon": {"value": 0.58, "status": "placeholder",
                     "source": "LROC NAC DTM de Linné re-muestreado a 30 m"},
        },
        "roughness": {
            "earth": {"value": 0.55, "status": "placeholder",
                      "source": "Sentinel-1 GRD IW, CR = σ⁰VH − σ⁰VV (dB) → percentil entre desiertos"},
            "moon": {"value": 0.85, "status": "placeholder",
                     "source": "LRO Mini-RF CPR → percentil lunar (cráter fresco: CPR alto)"},
        },
        "mineralogy": {
            "earth": {"value": 0.85, "status": "placeholder",
                      "source": "ASTER GED AG100, índice máfico ε12/ε13 calibrado a 0–1"},
            "moon": {"value": 0.85, "status": "placeholder",
                     "source": "Diviner GDR_L3 CF (NEN), calibrado a 0–1 con modas tierras altas/mares"},
        },
        "albedo": {
            "earth": {"value": 0.14, "status": "placeholder",
                      "source": "Sentinel-2 L2A, α de banda ancha (Liang 2001), mediana del AOI"},
            "moon": {"value": 0.11, "status": "placeholder",
                     "source": "Diviner GDR_L2 reflectancia solar (0.3–3 µm) cerca del mediodía"},
        },
        "thermal": {
            "earth": {"value": 40.0, "status": "placeholder",
                      "source": "MODIS MYD11A2 v061, LST_Day − LST_Night (promedio anual)"},
            "moon": {"value": 270.0, "status": "placeholder",
                     "source": "Diviner RCP/GCP, T(≈12:00) − T(≈05:30)"},
        },
        "aridity": {
            "earth": {"value": 0.08, "status": "placeholder",
                      "source": "Sentinel-2 L2A NDVI, mediana del AOI en temporada seca"},
            "moon": {"value": 0.0, "status": "reference",
                     "source": "Sin biología: NDVI de referencia = 0"},
        },
        "ice": {
            "earth": {"value": 0, "status": "placeholder",
                      "source": "SMAP SPL3SMP_E: suelo seco → clase 0"},
            "moon": {"value": 0, "status": "literature",
                     "source": "Latitud media, sin trampas frías (Paige et al. 2010) → clase 0"},
        },
        "dust": {
            "earth": {"value": 0.30, "status": "placeholder",
                      "source": "SoilGrids 250 m, (limo + arcilla)/100, 0–5 cm"},
            "moon": {"value": 0.50, "status": "placeholder",
                     "source": "Granulometría de suelos Apolo (fracción < ~63 µm); verificar en literatura"},
        },
        "craters": {
            "earth": {"value": round(244 / 1609, 3), "status": "literature",
                      "source": "Gutmann (GSA 2006): D = 1.6 km, d = 244 m. Recalcular con crater_dD.py"},
            "moon": {"value": round(520 / 2230, 3), "status": "literature",
                     "source": "Linné: D = 2.23 km, d = 0.52 km (modelado numérico, 2017). Recalcular con NAC DTM"},
        },
    },
    # Ajustes de peso específicos del par (opcional)
    "weight_overrides": {
        # Los dos sitios son secos: la similitud en hielo es "por ausencia"
        "ice": 0.5,
    },
    "flags": {
        "ice": "similitud_por_ausencia",
    },
    "education": {
        "match_es": (
            "Es el par con la escala más parecida del proyecto: dos cráteres en forma de tazón, "
            "de 1.6 y 2.2 km de diámetro, con bordes elevados y paredes de basalto."
        ),
        "hook_es": (
            "Calcula en clase la razón profundidad/diámetro: El Elegante da 244/1609 ≈ 0.15 y "
            "Linné 520/2230 ≈ 0.23. ¿Por qué el cráter lunar es más hondo en proporción? "
            "Además, en el Pinacate entrenaron astronautas del Apolo 14 en 1970."
        ),
        "breaks_es": [
            {"axis": "origen",
             "text": "Se ven casi iguales pero se formaron al revés: El Elegante nació de una explosión de "
                     "vapor cuando el magma tocó agua subterránea; Linné, del impacto de un meteorito. "
                     "En la Luna no hay agua líquida para hacer maares."},
            {"axis": "craters",
             "text": "El Elegante tuvo un lago y lleva ~32 mil años de erosión por lluvia y viento, que "
                     "suavizan sus paredes. Linné conserva su forma original porque la Luna no tiene atmósfera."},
            {"axis": "thermal",
             "text": "Sin atmósfera que guarde el calor, en Linné la temperatura cambia unos 270 K entre el día "
                     "y la noche; en el desierto de Sonora, unos 40 K."},
            {"axis": "gravedad",
             "text": "Con 1/6 de la gravedad terrestre, la eyecta lunar viaja más lejos y las paredes "
                     "pueden sostener otras pendientes."},
            {"axis": "aridity",
             "text": "El Elegante es árido, pero no está muerto: tiene gobernadoras y otras plantas del "
                     "desierto. En la Luna no hay vida."},
        ],
    },
}


# ---------------------------------------------------------------------------
# 3. FUNCIONES DE SIMILITUD
# ---------------------------------------------------------------------------
def similarity(x_t: float, x_l: float, R: float, mode: str) -> float:
    """Devuelve S_i en [0, 100]."""
    if mode == "linear":
        s = 1.0 - abs(x_t - x_l) / R
    elif mode == "log_ratio":
        if x_t <= 0 or x_l <= 0:
            raise ValueError("log_ratio requiere valores positivos")
        s = 1.0 - abs(math.log10(x_t / x_l)) / math.log10(R)
    else:
        raise ValueError(f"Modo de similitud desconocido: {mode}")
    return 100.0 * max(0.0, s)


def build_pair_json(pair: dict, axes: list[dict]) -> dict:
    axes_out = []
    num, den = 0.0, 0.0
    w_total, w_real = 0.0, 0.0  # para medir qué tanto del ILS viene de datos reales

    for ax in axes:
        key = ax["key"]
        raw = pair["raw"].get(key)
        w = pair.get("weight_overrides", {}).get(key, ax["w"])
        entry = {
            "id": ax["id"],
            "key": key,
            "name_es": ax["name_es"],
            "metric": ax["metric"],
            "units": ax["units"],
            "mode": ax["mode"],
            "tolerance_R": ax["R"],
            "weight": w,
            "confidence": ax["confidence"],
            "flag": pair.get("flags", {}).get(key),
        }
        if raw is None or raw["earth"]["value"] is None or raw["moon"]["value"] is None:
            entry.update({"earth": raw["earth"] if raw else None,
                          "moon": raw["moon"] if raw else None,
                          "similarity": None, "available": False})
        else:
            s = similarity(raw["earth"]["value"], raw["moon"]["value"], ax["R"], ax["mode"])
            entry.update({"earth": raw["earth"], "moon": raw["moon"],
                          "similarity": round(s, 1), "available": True})
            num += w * s
            den += w
            w_total += w
            real = {"measured", "literature", "reference"}
            if raw["earth"]["status"] in real and raw["moon"]["status"] in real:
                w_real += w
        axes_out.append(entry)

    ils = round(num / den, 1) if den else None
    statuses = [a[s]["status"] for a in axes_out if a["available"] for s in ("earth", "moon")]

    return {
        "schema_version": SCHEMA_VERSION,
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "pair_id": pair["pair_id"],
        "title_es": pair["title_es"],
        "earth_site": pair["earth_site"],
        "moon_site": pair["moon_site"],
        "axes": axes_out,
        "ils": {
            "value": ils,
            "formula": "sum(w_i * S_i) / sum(w_i)",
            "axes_used": sum(a["available"] for a in axes_out),
            # Fracción del peso total que viene de datos medidos/literatura/referencia
            "data_completeness": round(w_real / w_total, 2) if w_total else 0.0,
            "has_placeholders": "placeholder" in statuses,
        },
        "education": pair["education"],
    }


def validate(doc: dict) -> list[str]:
    """Revisiones básicas del contrato antes de entregar al Frontend."""
    problems = []
    if len(doc["axes"]) != 9:
        problems.append("Se esperaban 9 ejes")
    for a in doc["axes"]:
        if a["available"] and not (0 <= a["similarity"] <= 100):
            problems.append(f"S fuera de rango en {a['key']}")
    if doc["ils"]["value"] is not None and not (0 <= doc["ils"]["value"] <= 100):
        problems.append("ILS fuera de rango")
    for side in ("earth_site", "moon_site"):
        s = doc[side]
        if not (-90 <= s["lat"] <= 90 and -180 <= s["lon"] <= 360):
            problems.append(f"Coordenadas inválidas en {side}")
    return problems


def main() -> None:
    parser = argparse.ArgumentParser(description="Genera el JSON del par para la WebApp")
    parser.add_argument("--out", default="output/pairs/elegante_linne.json")
    args = parser.parse_args()

    doc = build_pair_json(PAIR, AXES)
    problems = validate(doc)
    if problems:
        raise SystemExit("Errores de validación:\n  - " + "\n  - ".join(problems))

    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(doc, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"✔ {out}")
    print(f"  ILS = {doc['ils']['value']}  |  datos reales: {doc['ils']['data_completeness']:.0%}"
          f"  |  placeholders: {doc['ils']['has_placeholders']}")
    for a in doc["axes"]:
        s = "—" if a["similarity"] is None else f"{a['similarity']:5.1f}"
        print(f"  {a['id']}. {a['name_es']:<38} S = {s}  (w={a['weight']})")


if __name__ == "__main__":
    main()
```

## `crater_dD.py`

```python
#!/usr/bin/env python3
"""
crater_dD.py — Mide d/D (profundidad/diámetro) y f_safe (fracción con pendiente
< umbral) de un cráter a partir de un DEM GeoTIFF en proyección MÉTRICA.

Funciona igual para la Tierra (Copernicus DEM re-proyectado a UTM) y para la
Luna (LROC NAC DTM o SLDEM2015 en proyección equirectangular/estereográfica en metros).

Método:
  1. Traza N perfiles radiales desde el centro hasta r_max.
  2. En cada perfil, el borde (rim) es el punto de máxima elevación.
  3. D = 2 * radio medio del borde;  borde_z = elevación media del borde.
  4. Fondo = elevación mínima dentro de 0.3 * radio del borde.
  5. d = borde_z - fondo;  d/D = d / D.
  6. Pendiente con gradiente central; f_safe = % de píxeles con pendiente
     < umbral dentro de un círculo de radio = aoi_factor * radio del borde.

Requiere: numpy, rasterio   (pip install numpy rasterio)

Ejemplos:
  # Tierra (centro en lon/lat, el DEM debe estar en UTM):
  python crater_dD.py elegante_utm12.tif --lonlat -113.3913 31.8467 --rmax 1500

  # Luna (centro en coordenadas del mapa, en metros del CRS del DTM):
  python crater_dD.py NAC_DTM_LINNE.tif --xy 0 0 --rmax 2000 --resample 30
"""

from __future__ import annotations

import argparse
import json

import numpy as np
import rasterio
from rasterio.enums import Resampling
from rasterio.warp import transform as warp_transform


def load_dem(path: str, resample_m: float | None):
    src = rasterio.open(path)
    if src.crs is not None and src.crs.is_geographic:
        raise SystemExit("El DEM está en grados. Re-proyéctalo a metros, p. ej.:\n"
                         "  gdalwarp -t_srs EPSG:32612 -tr 30 30 -r bilinear in.tif out_utm.tif")
    px = abs(src.transform.a)
    if resample_m and resample_m > px:
        scale = px / resample_m
        h, w = int(src.height * scale), int(src.width * scale)
        z = src.read(1, out_shape=(h, w), resampling=Resampling.average, masked=True)
        tr = src.transform * src.transform.scale(src.width / w, src.height / h)
    else:
        z = src.read(1, masked=True)
        tr = src.transform
    z = z.astype("float64").filled(np.nan)
    return src, z, tr


def center_to_pixel(src, tr, args):
    if args.lonlat:
        xs, ys = warp_transform("EPSG:4326", src.crs, [args.lonlat[0]], [args.lonlat[1]])
        x, y = xs[0], ys[0]
    else:
        x, y = args.xy
    col, row = ~tr * (x, y)
    return col, row


def bilinear(z, col, row):
    c0, r0 = np.floor(col).astype(int), np.floor(row).astype(int)
    c1, r1 = c0 + 1, r0 + 1
    h, w = z.shape
    ok = (c0 >= 0) & (r0 >= 0) & (c1 < w) & (r1 < h)
    out = np.full(col.shape, np.nan)
    dc, dr = col[ok] - c0[ok], row[ok] - r0[ok]
    out[ok] = (z[r0[ok], c0[ok]] * (1 - dc) * (1 - dr) + z[r0[ok], c1[ok]] * dc * (1 - dr)
               + z[r1[ok], c0[ok]] * (1 - dc) * dr + z[r1[ok], c1[ok]] * dc * dr)
    return out


def measure(z, px, col0, row0, rmax_m, n_profiles=72, slope_deg=10.0, aoi_factor=1.5):
    radii_m = np.arange(0, rmax_m, px / 2)
    rim_r, rim_z = [], []
    for ang in np.linspace(0, 2 * np.pi, n_profiles, endpoint=False):
        cols = col0 + np.cos(ang) * radii_m / px
        rows = row0 - np.sin(ang) * radii_m / px
        prof = bilinear(z, cols, rows)
        if np.all(np.isnan(prof)):
            continue
        i = int(np.nanargmax(prof))
        if i == 0 or i == len(prof) - 1:
            continue  # el borde no quedó dentro de r_max: perfil descartado
        rim_r.append(radii_m[i])
        rim_z.append(prof[i])
    if len(rim_r) < n_profiles * 0.5:
        raise SystemExit("Menos de la mitad de los perfiles encontró borde: ajusta --rmax o el centro.")

    rim_r, rim_z = np.array(rim_r), np.array(rim_z)
    R_rim = float(np.median(rim_r))
    rim_elev = float(np.mean(rim_z))

    rr, cc = np.indices(z.shape)
    dist = np.hypot((cc - col0) * px, (rr - row0) * px)
    floor = float(np.nanmin(np.where(dist <= 0.3 * R_rim, z, np.nan)))

    D = 2 * R_rim
    d = rim_elev - floor

    gy, gx = np.gradient(z, px)
    slope = np.degrees(np.arctan(np.hypot(gx, gy)))
    aoi = (dist <= aoi_factor * R_rim) & np.isfinite(slope)
    f_safe = float(np.mean(slope[aoi] < slope_deg))

    return {
        "diameter_m": round(D, 1),
        "depth_m": round(d, 1),
        "depth_diameter_ratio": round(d / D, 3),
        "rim_radius_std_m": round(float(np.std(rim_r)), 1),
        "rim_elev_m": round(rim_elev, 1),
        "floor_elev_m": round(floor, 1),
        "profiles_used": int(len(rim_r)),
        "pixel_m": round(px, 2),
        "f_safe": round(f_safe, 3),
        "f_safe_threshold_deg": slope_deg,
        "f_safe_aoi_radius_m": round(aoi_factor * R_rim, 1),
        "slope_mean_deg": round(float(np.mean(slope[aoi])), 2),
    }


def main():
    p = argparse.ArgumentParser(description="d/D y pendiente de un cráter desde un DEM")
    p.add_argument("dem")
    g = p.add_mutually_exclusive_group(required=True)
    g.add_argument("--lonlat", nargs=2, type=float, metavar=("LON", "LAT"),
                   help="Centro en grados (solo DEM terrestres)")
    g.add_argument("--xy", nargs=2, type=float, metavar=("X", "Y"),
                   help="Centro en metros del CRS del DEM (Luna o Tierra)")
    p.add_argument("--rmax", type=float, required=True, help="Radio máximo de búsqueda del borde (m)")
    p.add_argument("--resample", type=float, default=None,
                   help="Re-muestrear a este tamaño de píxel (m) antes de medir (p. ej. 30)")
    p.add_argument("--slope-threshold", type=float, default=10.0)
    p.add_argument("--profiles", type=int, default=72)
    args = p.parse_args()

    src, z, tr = load_dem(args.dem, args.resample)
    col0, row0 = center_to_pixel(src, tr, args)
    res = measure(z, abs(tr.a), col0, row0, args.rmax, args.profiles, args.slope_threshold)
    print(json.dumps(res, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
```

## `evalscript_s2_indices.js`

```javascript
//VERSION=3
// =====================================================================
// Pipeline ILS (Índice de Similitud Lunar) — NASA Space Apps 2026
// Sentinel-2 L2A: NDVI, albedo de banda ancha y razón de hierro férrico
//
// USO EN COPERNICUS BROWSER:
//   1. Elige la colección Sentinel-2 L2A y una fecha sin nubes.
//   2. Abre "Custom" -> "Custom script" y pega TODO este archivo.
//   3. Cambia INDEX abajo ("NDVI", "ALBEDO" o "FERRIC") y aplica.
//   4. Dibuja el polígono del área de análisis y abre "Statistical info".
//
// Notas:
//  - En unidades REFLECTANCE (por defecto) el desfase de la línea base
//    04.00 (BOA_ADD_OFFSET = -1000) ya viene corregido. Si descargas .SAFE
//    crudos, aplica rho = (DN - 1000) / 10000.
//  - B11 y B12 son de 20 m; se re-muestrean automáticamente a 10 m.
//  - Se descartan los píxeles que la capa SCL marca como sin dato,
//    saturados, sombra de nube, nube, cirro o nieve.
// =====================================================================

const INDEX = "NDVI"; // "NDVI" | "ALBEDO" | "FERRIC"

// Clases SCL inválidas: 0 sin dato, 1 saturado, 3 sombra de nube,
// 8 nube media, 9 nube alta, 10 cirro, 11 nieve/hielo
const INVALID_SCL = [0, 1, 3, 8, 9, 10, 11];

function setup() {
  return {
    input: [{
      bands: ["B02", "B04", "B08", "B11", "B12", "SCL", "dataMask"],
      units: ["REFLECTANCE", "REFLECTANCE", "REFLECTANCE", "REFLECTANCE",
              "REFLECTANCE", "DN", "DN"]
    }],
    output: [
      { id: "default", bands: 4 },                                  // visualización
      { id: "index", bands: 1, sampleType: "FLOAT32" },             // valor crudo (descarga)
      { id: "eobrowserStats", bands: 1, sampleType: "FLOAT32" },    // "Statistical info"
      { id: "dataMask", bands: 1 }
    ]
  };
}

function computeIndex(s) {
  if (INDEX === "NDVI") {
    return (s.B08 - s.B04) / (s.B08 + s.B04);
  }
  if (INDEX === "ALBEDO") {
    // Albedo de banda ancha (coeficientes de Liang 2001 aplicados a bandas S2)
    return 0.356 * s.B02 + 0.130 * s.B04 + 0.373 * s.B08
         + 0.085 * s.B11 + 0.072 * s.B12 - 0.0018;
  }
  // FERRIC: hierro férrico (óxidos de Fe3+), razón roja/azul
  return s.B04 / s.B02;
}

// Rampas de color solo para la vista; los números reales salen de "index"
const RAMPS = {
  NDVI:   { stops: [-0.1, 0.05, 0.15, 0.3, 0.6],
            colors: [[0.35,0.2,0.1],[0.75,0.65,0.5],[0.9,0.9,0.4],[0.4,0.75,0.3],[0.05,0.45,0.1]] },
  ALBEDO: { stops: [0.0, 0.1, 0.2, 0.35, 0.5],
            colors: [[0,0,0],[0.25,0.25,0.25],[0.5,0.5,0.5],[0.8,0.8,0.8],[1,1,1]] },
  FERRIC: { stops: [0.8, 1.2, 1.6, 2.0, 2.5],
            colors: [[0.2,0.2,0.5],[0.5,0.5,0.6],[0.85,0.6,0.4],[0.85,0.35,0.15],[0.6,0.1,0.05]] }
};

function evaluatePixel(s) {
  const v = computeIndex(s);
  const ok = s.dataMask === 1 && INVALID_SCL.indexOf(s.SCL) === -1 && isFinite(v);
  const ramp = RAMPS[INDEX];
  const rgb = ok ? colorBlend(v, ramp.stops, ramp.colors) : [0, 0, 0];
  return {
    default: [rgb[0], rgb[1], rgb[2], ok ? 1 : 0],
    index: [ok ? v : NaN],
    eobrowserStats: [ok ? v : NaN],
    dataMask: [ok ? 1 : 0]
  };
}
```

## `output/pairs/elegante_linne.json`

```json
{
  "schema_version": "1.0.0",
  "generated_at": "2026-11-14T23:22:46+00:00",
  "pair_id": "elegante_linne",
  "title_es": "Cráter El Elegante ↔ Cráter Linné",
  "earth_site": {
    "name": "Cráter El Elegante",
    "region": "Reserva de la Biosfera El Pinacate y Gran Desierto de Altar, Sonora, México",
    "type_es": "Maar (cráter volcánico freatomagmático)",
    "lat": 31.8467,
    "lon": -113.3913,
    "aoi": {
      "shape": "circle",
      "radius_m": 1200,
      "note": "Interior + borde del cráter (borde a ~800 m del centro)"
    },
    "facts": {
      "diameter_m": 1609,
      "depth_m": 244,
      "age_ka": 32
    }
  },
  "moon_site": {
    "name": "Cráter Linné",
    "region": "Noroeste de Mare Serenitatis, Luna",
    "type_es": "Cráter de impacto simple (Copernicano)",
    "lat": 27.73,
    "lon": 11.79,
    "aoi": {
      "shape": "circle",
      "radius_m": 1650,
      "note": "Interior + borde del cráter (borde a ~1,115 m del centro)"
    },
    "facts": {
      "diameter_m": 2230,
      "depth_m": 520
    }
  },
  "axes": [
    {
      "id": 1,
      "key": "slope",
      "name_es": "Pendiente y seguridad de aterrizaje",
      "metric": "f_safe",
      "units": "fracción de píxeles con pendiente < 10°",
      "mode": "linear",
      "tolerance_R": 0.5,
      "weight": 1.5,
      "confidence": "A",
      "flag": null,
      "earth": {
        "value": 0.62,
        "status": "placeholder",
        "source": "Copernicus DEM GLO-30 re-proyectado a UTM 12N (EPSG:32612)"
      },
      "moon": {
        "value": 0.58,
        "status": "placeholder",
        "source": "LROC NAC DTM de Linné re-muestreado a 30 m"
      },
      "similarity": 92.0,
      "available": true
    },
    {
      "id": 2,
      "key": "roughness",
      "name_es": "Rugosidad superficial (radar)",
      "metric": "roughness_percentile",
      "units": "percentil dentro de su propio cuerpo (0–1)",
      "mode": "linear",
      "tolerance_R": 1.0,
      "weight": 1.0,
      "confidence": "B",
      "flag": null,
      "earth": {
        "value": 0.55,
        "status": "placeholder",
        "source": "Sentinel-1 GRD IW, CR = σ⁰VH − σ⁰VV (dB) → percentil entre desiertos"
      },
      "moon": {
        "value": 0.85,
        "status": "placeholder",
        "source": "LRO Mini-RF CPR → percentil lunar (cráter fresco: CPR alto)"
      },
      "similarity": 70.0,
      "available": true
    },
    {
      "id": 3,
      "key": "mineralogy",
      "name_es": "Composición mineralógica",
      "metric": "mafic_score",
      "units": "escala félsico (0) – máfico (1)",
      "mode": "linear",
      "tolerance_R": 1.0,
      "weight": 1.5,
      "confidence": "B",
      "flag": null,
      "earth": {
        "value": 0.85,
        "status": "placeholder",
        "source": "ASTER GED AG100, índice máfico ε12/ε13 calibrado a 0–1"
      },
      "moon": {
        "value": 0.85,
        "status": "placeholder",
        "source": "Diviner GDR_L3 CF (NEN), calibrado a 0–1 con modas tierras altas/mares"
      },
      "similarity": 100.0,
      "available": true
    },
    {
      "id": 4,
      "key": "albedo",
      "name_es": "Albedo y reflectancia óptica",
      "metric": "albedo_broadband",
      "units": "adimensional (0–1)",
      "mode": "linear",
      "tolerance_R": 0.15,
      "weight": 1.0,
      "confidence": "A",
      "flag": null,
      "earth": {
        "value": 0.14,
        "status": "placeholder",
        "source": "Sentinel-2 L2A, α de banda ancha (Liang 2001), mediana del AOI"
      },
      "moon": {
        "value": 0.11,
        "status": "placeholder",
        "source": "Diviner GDR_L2 reflectancia solar (0.3–3 µm) cerca del mediodía"
      },
      "similarity": 80.0,
      "available": true
    },
    {
      "id": 5,
      "key": "thermal",
      "name_es": "Amplitud térmica día/noche",
      "metric": "delta_T",
      "units": "K",
      "mode": "log_ratio",
      "tolerance_R": 10.0,
      "weight": 1.0,
      "confidence": "A",
      "flag": null,
      "earth": {
        "value": 40.0,
        "status": "placeholder",
        "source": "MODIS MYD11A2 v061, LST_Day − LST_Night (promedio anual)"
      },
      "moon": {
        "value": 270.0,
        "status": "placeholder",
        "source": "Diviner RCP/GCP, T(≈12:00) − T(≈05:30)"
      },
      "similarity": 17.1,
      "available": true
    },
    {
      "id": 6,
      "key": "aridity",
      "name_es": "Aridez y ausencia biológica",
      "metric": "ndvi_median",
      "units": "NDVI (−1 a 1)",
      "mode": "linear",
      "tolerance_R": 0.3,
      "weight": 0.5,
      "confidence": "A",
      "flag": null,
      "earth": {
        "value": 0.08,
        "status": "placeholder",
        "source": "Sentinel-2 L2A NDVI, mediana del AOI en temporada seca"
      },
      "moon": {
        "value": 0.0,
        "status": "reference",
        "source": "Sin biología: NDVI de referencia = 0"
      },
      "similarity": 73.3,
      "available": true
    },
    {
      "id": 7,
      "key": "ice",
      "name_es": "Humedad / hielo subsuperficial",
      "metric": "volatile_class",
      "units": "clase 0–3 (0 seco … 3 hielo estable)",
      "mode": "linear",
      "tolerance_R": 3.0,
      "weight": 0.5,
      "confidence": "C",
      "flag": "similitud_por_ausencia",
      "earth": {
        "value": 0,
        "status": "placeholder",
        "source": "SMAP SPL3SMP_E: suelo seco → clase 0"
      },
      "moon": {
        "value": 0,
        "status": "literature",
        "source": "Latitud media, sin trampas frías (Paige et al. 2010) → clase 0"
      },
      "similarity": 100.0,
      "available": true
    },
    {
      "id": 8,
      "key": "dust",
      "name_es": "Polvo y regolito fino",
      "metric": "fine_fraction",
      "units": "fracción de partículas < ~63 µm",
      "mode": "linear",
      "tolerance_R": 1.0,
      "weight": 0.75,
      "confidence": "C",
      "flag": null,
      "earth": {
        "value": 0.3,
        "status": "placeholder",
        "source": "SoilGrids 250 m, (limo + arcilla)/100, 0–5 cm"
      },
      "moon": {
        "value": 0.5,
        "status": "placeholder",
        "source": "Granulometría de suelos Apolo (fracción < ~63 µm); verificar en literatura"
      },
      "similarity": 80.0,
      "available": true
    },
    {
      "id": 9,
      "key": "craters",
      "name_es": "Morfología de cráteres y cavidades",
      "metric": "depth_diameter_ratio",
      "units": "d/D (adimensional)",
      "mode": "linear",
      "tolerance_R": 0.2,
      "weight": 1.0,
      "confidence": "B",
      "flag": null,
      "earth": {
        "value": 0.152,
        "status": "literature",
        "source": "Gutmann (GSA 2006): D = 1.6 km, d = 244 m. Recalcular con crater_dD.py"
      },
      "moon": {
        "value": 0.233,
        "status": "literature",
        "source": "Linné: D = 2.23 km, d = 0.52 km (modelado numérico, 2017). Recalcular con NAC DTM"
      },
      "similarity": 59.5,
      "available": true
    }
  ],
  "ils": {
    "value": 75.6,
    "formula": "sum(w_i * S_i) / sum(w_i)",
    "axes_used": 9,
    "data_completeness": 0.11,
    "has_placeholders": true
  },
  "education": {
    "match_es": "Es el par con la escala más parecida del proyecto: dos cráteres en forma de tazón, de 1.6 y 2.2 km de diámetro, con bordes elevados y paredes de basalto.",
    "hook_es": "Calcula en clase la razón profundidad/diámetro: El Elegante da 244/1609 ≈ 0.15 y Linné 520/2230 ≈ 0.23. ¿Por qué el cráter lunar es más hondo en proporción? Además, en el Pinacate entrenaron astronautas del Apolo 14 en 1970.",
    "breaks_es": [
      {
        "axis": "origen",
        "text": "Se ven casi iguales pero se formaron al revés: El Elegante nació de una explosión de vapor cuando el magma tocó agua subterránea; Linné, del impacto de un meteorito. En la Luna no hay agua líquida para hacer maares."
      },
      {
        "axis": "craters",
        "text": "El Elegante tuvo un lago y lleva ~32 mil años de erosión por lluvia y viento, que suavizan sus paredes. Linné conserva su forma original porque la Luna no tiene atmósfera."
      },
      {
        "axis": "thermal",
        "text": "Sin atmósfera que guarde el calor, en Linné la temperatura cambia unos 270 K entre el día y la noche; en el desierto de Sonora, unos 40 K."
      },
      {
        "axis": "gravedad",
        "text": "Con 1/6 de la gravedad terrestre, la eyecta lunar viaja más lejos y las paredes pueden sostener otras pendientes."
      },
      {
        "axis": "aridity",
        "text": "El Elegante es árido, pero no está muerto: tiene gobernadoras y otras plantas del desierto. En la Luna no hay vida."
      }
    ]
  }
}```
