/**
 * Verifica Starman Playground sin navegador (`npm run verify:playground`):
 * áreas reales con fuente, fotos con crédito, textos ES/EN equivalentes y
 * modelo 3D solo donde el proyecto tiene datos de elevación.
 */
import { MISSION_SITE_IDS } from '../src/data/missions/roverMission';
import { PLAYGROUND_AREAS } from '../src/data/playground';
import { PLAYGROUND_TEXT } from '../src/i18n/playground';

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

console.log('');
if (failures > 0) {
  console.error(`✗ ${failures} comprobaciones fallidas (${passed} correctas).`);
  process.exit(1);
}
console.log(`✓ Playground verificado: ${passed} comprobaciones correctas.`);
