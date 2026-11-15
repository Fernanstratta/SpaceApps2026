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
//  - El agua (SCL = 6) se descarta SIEMPRE: lagunas de evaporación, canales
//    o la playa inundada no son superficie seca comparable con la Luna.
//  - La vegetación (NDVI > 0.2: cultivos, matorral denso) se descarta en
//    ALBEDO y FERRIC. En NDVI se conserva por defecto, porque el eje 6 mide
//    justamente cuánta vegetación hay; cambia MASK_VEG_IN_NDVI si la quieres fuera.
//  - Mismas máscaras que pipeline/s2_aoi_stats.py.
// =====================================================================

const INDEX = "NDVI"; // "NDVI" | "ALBEDO" | "FERRIC"

// Clases SCL inválidas: 0 sin dato, 1 saturado, 3 sombra de nube,
// 8 nube media, 9 nube alta, 10 cirro, 11 nieve/hielo
const INVALID_SCL = [0, 1, 3, 8, 9, 10, 11];
const WATER_SCL = 6;          // agua: siempre fuera
const VEG_NDVI = 0.2;         // umbral de vegetación
const MASK_VEG_IN_NDVI = false;

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

function isMasked(s) {
  if (s.dataMask !== 1 || INVALID_SCL.indexOf(s.SCL) !== -1 || s.SCL === WATER_SCL) return true;
  const ndvi = (s.B08 - s.B04) / (s.B08 + s.B04);
  const vegMasked = INDEX !== "NDVI" || MASK_VEG_IN_NDVI;
  return vegMasked && ndvi > VEG_NDVI;
}

function evaluatePixel(s) {
  const v = computeIndex(s);
  const ok = !isMasked(s) && isFinite(v);
  const ramp = RAMPS[INDEX];
  const rgb = ok ? colorBlend(v, ramp.stops, ramp.colors) : [0, 0, 0];
  return {
    default: [rgb[0], rgb[1], rgb[2], ok ? 1 : 0],
    index: [ok ? v : NaN],
    eobrowserStats: [ok ? v : NaN],
    dataMask: [ok ? 1 : 0]
  };
}
