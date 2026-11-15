/**
 * Verifica Starman Playground sin navegador (`npm run verify:playground`):
 * áreas reales con fuente, fotos con crédito, textos ES/EN equivalentes y
 * modelo 3D solo donde el proyecto tiene datos de elevación.
 */
import { topics } from '../src/data';
import { AXIS_IDS, getLunarAnalogCatalog } from '../src/data/lunarAnalogs';
import { MISSION_SITE_IDS } from '../src/data/missions/roverMission';
import { PLAYGROUND_AREAS } from '../src/data/playground';
import { PLAYGROUND_TEXT } from '../src/i18n/playground';
import {
  clampSimilarity,
  filterAreas,
  hasActiveFilters,
  hasSimilarityData,
  matchesSimilarity,
  NO_FILTERS,
  toggleAxis,
} from '../src/utils/playgroundFilters';

let failures = 0;
let passed = 0;
function check(condition: boolean, message: string): void {
  if (condition) passed += 1;
  else {
    failures += 1;
    console.error(`✗ ${message}`);
  }
}

const { es, en } = PLAYGROUND_TEXT;
check(PLAYGROUND_AREAS.length >= 2, 'Hay al menos dos áreas');
check(new Set(PLAYGROUND_AREAS.map((a) => a.id)).size === PLAYGROUND_AREAS.length, 'Ids de área únicos');
check(es.counter(1, PLAYGROUND_AREAS.length) === `1 de ${PLAYGROUND_AREAS.length}`, 'Indicador «1 de N» calculado de las áreas');

for (const area of PLAYGROUND_AREAS) {
  const tag = area.id;
  check(Math.abs(area.lat) <= 90 && Math.abs(area.lon) <= 180, `${tag}: coordenadas válidas`);
  for (const photo of area.photos) {
    check(photo.src.startsWith('https://'), `${tag}: foto por https`);
    check(photo.page.startsWith('https://') && Boolean(photo.author.trim()), `${tag}: foto con crédito`);
  }
  check(area.terrainSiteId === null || MISSION_SITE_IDS.includes(area.terrainSiteId), `${tag}: el modelo 3D usa un DEM del proyecto`);
  for (const [lang, text] of [['es', es], ['en', en]] as const) {
    const t = text.pairs[area.id].earth;
    check(t.photos.length === area.photos.length, `${tag}/${lang}: una descripción por foto`);
    check(t.photos.every((p) => p.alt.trim() && p.caption.trim()), `${tag}/${lang}: fotos con texto alternativo y pie`);
  }
}
const with3d = PLAYGROUND_AREAS.filter((a) => a.terrainSiteId).map((a) => a.id);
console.log(`  ✓ ${PLAYGROUND_AREAS.length} áreas; con vista 3D: ${with3d.join(', ') || 'ninguna'}`);

// Selección por número: números fijos 1…n, únicos y en el orden del documento.
check(
  PLAYGROUND_AREAS.every((a, i) => a.number === i + 1),
  'Cada área tiene un número fijo (1…n) en el orden del documento',
);

// Filtro por eje: mismos ids y nombres que el Portal Educativo.
check(AXIS_IDS.length === 9, 'Hay nueve ejes comparativos');
check(
  topics.every((topic) => topic.name === es.axes[topic.id].name),
  'Los filtros usan los mismos nombres que los ejes del Portal Educativo',
);
check(filterAreas(PLAYGROUND_AREAS, NO_FILTERS).length === PLAYGROUND_AREAS.length, 'Sin filtros se ven todas las áreas');
check(!hasActiveFilters(NO_FILTERS), 'NO_FILTERS no cuenta como filtro activo');
for (const axis of AXIS_IDS) {
  const shown = filterAreas(PLAYGROUND_AREAS, { axes: [axis], minSimilarity: 0 });
  check(shown.length > 0, `El eje ${axis} tiene al menos una comparación asociada`);
  check(shown.every((a) => a.axes.includes(axis)), `Con el eje ${axis} solo se ven áreas asociadas a él`);
}
const two = filterAreas(PLAYGROUND_AREAS, { axes: ['volatiles', 'dust'], minSimilarity: 0 });
check(
  two.length > 0 && two.every((a) => a.axes.includes('volatiles') || a.axes.includes('dust')),
  'Varios ejes: se ven las áreas asociadas a cualquiera de ellos',
);
let selected = toggleAxis([], 'craters', AXIS_IDS);
selected = toggleAxis(selected, 'slope', AXIS_IDS);
check(selected.join(',') === 'slope,craters', 'toggleAxis añade ejes en el orden del documento');
check(toggleAxis(selected, 'slope', AXIS_IDS).join(',') === 'craters', 'toggleAxis quita un eje ya elegido');

// Similitud: sin datos reales, el filtro no oculta nada ni inventa valores.
check(
  getLunarAnalogCatalog().pairs.every((pair) => pair.similarityPercent === null),
  'Ningún par tiene un porcentaje de similitud inventado (todos null hasta tener datos)',
);
check(!hasSimilarityData(PLAYGROUND_AREAS), 'El Playground sabe que aún no hay datos de similitud');
for (const min of [0, 35, 100]) {
  check(
    filterAreas(PLAYGROUND_AREAS, { axes: [], minSimilarity: min }).length === PLAYGROUND_AREAS.length,
    `Similitud ≥ ${min} % sin datos no oculta áreas`,
  );
}
check(
  filterAreas(PLAYGROUND_AREAS, { axes: ['craters'], minSimilarity: 80 }).length ===
    filterAreas(PLAYGROUND_AREAS, { axes: ['craters'], minSimilarity: 0 }).length,
  'La ausencia de datos de similitud no altera el filtro por eje',
);
// Lógica preparada para datos reales (casos sintéticos, no son datos del proyecto).
check(matchesSimilarity({ axes: [], similarity: 72 }, 70), 'Con dato: 72 % pasa el mínimo de 70 %');
check(!matchesSimilarity({ axes: [], similarity: 64 }, 70), 'Con dato: 64 % no pasa el mínimo de 70 %');
check(clampSimilarity(140) === 100 && clampSimilarity(-5) === 0, 'El slider se limita a 0–100 %');
check(hasActiveFilters({ axes: [], minSimilarity: 10 }), 'Una similitud mínima > 0 cuenta como filtro activo');
console.log(`  ✓ Filtros por eje (${AXIS_IDS.length}) y de similitud (pendiente de datos) verificados`);

console.log('');
if (failures > 0) {
  console.error(`✗ ${failures} comprobaciones fallidas (${passed} correctas).`);
  process.exit(1);
}
console.log(`✓ Playground verificado: ${passed} comprobaciones correctas.`);
