/**
 * Verifica Starman Playground sin navegador (`npm run verify:playground`):
 *  - Las cinco áreas son los cinco pares del backend, con sus coordenadas,
 *    radios de análisis e ILS tal como los envía (nunca recalculados).
 *  - Los ejes sin dato comparable nunca se muestran como 0.
 *  - Fotos de los dos sitios con crédito y textos ES/EN equivalentes.
 *  - Filtro de ILS mínimo y enlaces `#par=…&eje=…`.
 */
import { topics } from '../src/data';
import { AXIS_IDS, getLunarAnalogCatalog, isComparable } from '../src/data/lunarAnalogs';
import { PLAYGROUND_AREAS, playgroundLink, readPlaygroundTarget } from '../src/data/playground';
import { PLAYGROUND_TEXT } from '../src/i18n/playground';
import { clampSimilarity, filterAreas, hasActiveFilters, matchesSimilarity, NO_FILTERS } from '../src/utils/playgroundFilters';

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
const catalog = getLunarAnalogCatalog();
check(PLAYGROUND_AREAS.length === catalog.summaries.length, 'Un área por par del backend');
check(new Set(PLAYGROUND_AREAS.map((a) => a.id)).size === PLAYGROUND_AREAS.length, 'Ids de área únicos');
check(PLAYGROUND_AREAS.every((a, i) => a.number === i + 1), 'Números fijos 1…n en el orden del backend');

for (const area of PLAYGROUND_AREAS) {
  const tag = area.id;
  const summary = catalog.summaries.find((item) => item.pair_id === area.id);
  check(summary !== undefined, `${tag}: está en index.json`);
  check(area.similarity === area.pair.data.ils.value, `${tag}: el ILS es el del backend`);
  check(summary?.ils.value === area.pair.data.ils.value, `${tag}: el ILS coincide con index.json`);
  check(area.lat === area.pair.data.earth_site.lat && area.lon === area.pair.data.earth_site.lon, `${tag}: coordenadas del backend`);
  check(area.radiusM === area.pair.data.earth_site.aoi.radius_m, `${tag}: radio de análisis del backend`);
  for (const axis of area.pair.data.axes) {
    if (!axis.available) check(axis.similarity === null && !isComparable(axis), `${tag}/${axis.key}: sin dato comparable, nunca 0`);
  }
  for (const body of ['earth', 'moon'] as const) {
    const photos = area.pair.photos[body];
    check(photos.length > 0, `${tag}: tiene fotos de ${body}`);
    for (const photo of photos) {
      check(photo.src.startsWith('https://'), `${tag}: foto por https`);
      check(photo.page.startsWith('https://') && Boolean(photo.author.trim()), `${tag}: foto con crédito`);
    }
    for (const [lang, text] of [['es', es], ['en', en]] as const) {
      const texts = text.pairs[area.id].photos[body];
      check(texts.length === photos.length, `${tag}/${lang}/${body}: una descripción por foto`);
      check(texts.every((p) => p.alt.trim() && p.caption.trim()), `${tag}/${lang}/${body}: fotos con texto alternativo y pie`);
    }
  }
}
console.log(`  ✓ ${PLAYGROUND_AREAS.length} pares con datos, fotos y textos del backend`);

// Ejes: mismos ids y nombres que el Portal Educativo.
check(AXIS_IDS.length === 9, 'Hay nueve ejes comparativos');
check(topics.every((topic) => topic.name === es.axes[topic.id].name), 'Los ejes usan los mismos nombres que el Portal Educativo');

// Filtro de ILS mínimo
check(filterAreas(PLAYGROUND_AREAS, NO_FILTERS).length === PLAYGROUND_AREAS.length, 'Sin filtros se ven todos los pares');
check(!hasActiveFilters(NO_FILTERS), 'NO_FILTERS no cuenta como filtro activo');
for (const min of [0, 50, 60, 100]) {
  const shown = filterAreas(PLAYGROUND_AREAS, { minSimilarity: min });
  check(
    shown.every((a) => a.similarity === null || a.similarity >= min),
    `ILS ≥ ${min}: solo pares que lo alcanzan (o sin índice)`,
  );
}
// Casos sintéticos de la lógica (no son datos del proyecto).
check(matchesSimilarity({ similarity: null }, 90), 'Un par sin índice no se excluye ni se trata como 0');
check(!matchesSimilarity({ similarity: 40 }, 50), 'Un índice menor al mínimo se excluye');
check(clampSimilarity(140) === 100 && clampSimilarity(-5) === 0, 'El control se limita a 0–100');

// Enlaces desde las lecciones
const link = playgroundLink({ pair: 'laguna_salada_tranquillitatis', axis: 'slope' });
check(link === '/playground#par=laguna_salada_tranquillitatis&eje=slope', 'Enlace con par y eje');
const target = readPlaygroundTarget(link.split('#')[1] ?? '');
check(target.pair === 'laguna_salada_tranquillitatis' && target.axis === 'slope', 'El enlace se lee de vuelta');
check(readPlaygroundTarget('#par=marte&eje=x').pair === null, 'Un par desconocido se ignora');

console.log('');
if (failures > 0) {
  console.error(`✗ ${failures} comprobaciones fallidas (${passed} correctas).`);
  process.exit(1);
}
console.log(`✓ Playground verificado: ${passed} comprobaciones correctas.`);
