/**
 * Verifica la Misión 01 sin navegador (`npm run verify:mission`):
 *  - El DEM descargado reproduce las dimensiones publicadas de cada cráter.
 *  - Cada dato citado tiene una fuente registrada con URL https.
 *  - El recorrido hipótesis → evidencia → decisión → ficha se valida bien,
 *    incluido cambiar de opinión, y el avance guardado corrupto no rompe nada.
 */
import {
  CANDIDATE_SITE_IDS,
  getMissionSite,
  MISSION_SITE_IDS,
  MISSION_SOURCES,
  ROVER_FACTS,
  type CandidateSiteId,
  type SourceId,
} from '../src/data/missions/roverMission';
import {
  EMPTY_PROGRESS,
  findingSources,
  REVIEW_DECISIONS,
  revisedSite,
  sanitizeProgress,
  validateStep,
  type Finding,
  type MissionProgress,
} from '../src/hooks/useMissionProgress';
import { roverEn } from '../src/i18n/missions/rover.en';
import { roverEs } from '../src/i18n/missions/rover.es';
import { transectProfile, transectStats } from '../src/utils/terrain';

let failures = 0;
let passed = 0;
function check(condition: boolean, message: string): void {
  if (condition) passed += 1;
  else {
    failures += 1;
    console.error(`✗ ${message}`);
  }
}
const between = (value: number, min: number, max: number) => value >= min && value <= max;

// ---------------------------------------------------------------------------
console.log('DEM frente a las dimensiones publicadas');
/**
 * Rangos publicados (con margen por la resolución de 59–90 m):
 *  - El Elegante: ~1,6 km de ancho (USGS), 244–250 m de profundidad.
 *  - Meteor Crater: ~1,2 km de ancho, ~170 m de profundidad.
 *  - North Ray: 1000–1100 m de ancho y ~230 m de profundidad (ALSJ).
 */
const EXPECTED = {
  'el-elegante': { width: [1350, 1800], depth: [190, 270] },
  'meteor-crater': { width: [1000, 1300], depth: [130, 190] },
  'north-ray': { width: [850, 1200], depth: [200, 260] },
} as const;

for (const id of MISSION_SITE_IDS) {
  const site = getMissionSite(id);
  check(site.grid.elevations.length === site.grid.size ** 2, `${id}: la malla no es de ${site.grid.size}×${site.grid.size}`);
  check(site.grid.elevations.every(Number.isFinite), `${id}: hay elevaciones no numéricas`);
  // Se toma el tramo que mejor cruza el cráter (el de mayor profundidad entre bordes).
  const stats = (['west-east', 'north-south'] as const)
    .map((direction) => transectStats(transectProfile(site.grid, direction)))
    .sort((a, b) => b.depth - a.depth)[0]!;
  const expected = EXPECTED[id];
  check(
    between(stats.rimToRim, expected.width[0], expected.width[1]),
    `${id}: ancho ${stats.rimToRim} m fuera de ${expected.width.join('–')} m`,
  );
  check(
    between(stats.depth, expected.depth[0], expected.depth[1]),
    `${id}: profundidad ${stats.depth.toFixed(0)} m fuera de ${expected.depth.join('–')} m`,
  );
  check(stats.bottom === (site.grid.size - 1) / 2, `${id}: el fondo no está en el centro de la malla`);
  console.log(
    `  ✓ ${id}: ${stats.rimToRim} m de borde a borde, ${stats.depth.toFixed(0)} m de profundidad, ` +
      `pared máx. ${stats.maxSlope.toFixed(1)}°`,
  );
}

// ---------------------------------------------------------------------------
console.log('\nFuentes');
const usedSources = new Set<SourceId>([
  ROVER_FACTS.maxSlopeSource,
  ROVER_FACTS.vehicleSource,
  ROVER_FACTS.gravitySource,
  ...MISSION_SITE_IDS.flatMap((id) => [getMissionSite(id).demSourceId, getMissionSite(id).photo.sourceId]),
]);
for (const text of [roverEs, roverEn]) {
  for (const id of MISSION_SITE_IDS) for (const fact of text.sites[id].facts) usedSources.add(fact.source);
}
for (const id of usedSources) {
  const source = MISSION_SOURCES[id];
  check(Boolean(source), `Fuente sin registrar: ${id}`);
  check(source?.url.startsWith('https://') ?? false, `Fuente sin URL https: ${id}`);
}
for (const id of MISSION_SITE_IDS) {
  check(getMissionSite(id).photo.src.startsWith('https://upload.wikimedia.org/'), `${id}: la foto no es de Wikimedia Commons`);
  check(roverEs.sites[id].facts.length === roverEn.sites[id].facts.length, `${id}: distinto número de datos en ES y EN`);
  roverEs.sites[id].facts.forEach((fact, i) =>
    check(fact.source === roverEn.sites[id].facts[i]?.source, `${id}: el dato ${i + 1} cita fuentes distintas en ES y EN`),
  );
}
console.log(`  ✓ ${usedSources.size} fuentes citadas, todas registradas con URL https`);

// ---------------------------------------------------------------------------
console.log('\nRecorridos de dos equipos');

/** Hallazgo de ejemplo, con la misma forma que guarda el visor. */
const finding = (id: string, patch: Partial<Finding> = {}): Finding => ({
  id,
  site: 'el-elegante',
  kind: 'point',
  view: 'relief',
  slopeLayer: true,
  compared: true,
  direction: 'north-south',
  index: 12,
  values: { distance: 900, height: 71, slope: 43 },
  sourceIds: findingSources('el-elegante', 'point', true),
  note: 'La pared llega a 43°, más que el límite del rover lunar.',
  ...patch,
});

/** Pasos 1 a 3 comunes: hipótesis, bitácora y propuesta. */
function proposal(team: string, site: CandidateSiteId): MissionProgress {
  let p: MissionProgress = { ...EMPTY_PROGRESS, team };
  check(validateStep(1, p).includes('errorSite') && validateStep(1, p).includes('errorHypothesis'), `${team}: el paso 1 vacío pide sitio e hipótesis`);
  p = { ...p, provisionalSite: site, hypothesis: 'Creemos que este sitio sirve porque tiene paredes empinadas como North Ray.' };
  check(validateStep(1, p).length === 0, `${team}: paso 1 completo`);

  check(validateStep(2, p).includes('errorFinding'), `${team}: sin hallazgos no avanza`);
  p = { ...p, findings: [finding('f-1', { site, sourceIds: findingSources(site, 'point', true) }), finding('f-2', { kind: 'photo', note: '' })] };
  check(validateStep(2, p).includes('errorFindingNote'), `${team}: un hallazgo sin nota bloquea el paso 2`);
  p = { ...p, findings: p.findings.map((f) => ({ ...f, note: f.note || 'En la foto la pared tiene rocas sueltas.' })) };
  check(validateStep(2, p).length === 0, `${team}: bitácora completa`);

  check(validateStep(3, p).includes('errorProposal'), `${team}: sin sitio propuesto no avanza`);
  p = {
    ...p,
    proposedSite: site,
    mainFindingId: 'f-1',
    explanation: 'La pendiente de la pared es parecida a la de North Ray, así que sirve para la maniobra.',
    limitation: 'En la Luna la gravedad es 1/6 de la terrestre.',
    nextData: 'Qué tan suelto es el suelo.',
  };
  check(validateStep(3, p).length === 0, `${team}: propuesta lista para imprimir la ficha de revisión`);
  check(validateStep(4, p).includes('errorObjection') && validateStep(4, p).includes('errorDecision'), `${team}: la revisión pide objeción y decisión`);
  return p;
}

const OBJECTION = '¿La pendiente que citan corresponde a toda la ruta o solo al punto que marcaron?';

// Equipo A: mantiene su propuesta con un hallazgo nuevo de todo el tramo.
let a = proposal('Equipo A', 'el-elegante');
a = {
  ...a,
  findings: [
    ...a.findings,
    finding('f-3', { kind: 'transect', index: null, values: { depth: 226, rimToRim: 1650, maxSlope: 43.8, meanSlope: 13.6 }, note: 'En todo el tramo la pared tiene 13.6° de media.' }),
  ],
  objection: OBJECTION,
  decision: 'keep',
};
check(validateStep(4, a).includes('errorDecisionFinding'), 'Equipo A: mantener exige citar un hallazgo');
a = { ...a, decisionFindingId: 'f-3', decisionReason: 'Revisamos todo el tramo: la pendiente media también permite la maniobra.' };
check(validateStep(4, a).length === 0, 'Equipo A: decisión revisada válida (mantener)');
check(revisedSite(a) === 'el-elegante', 'Equipo A: la ficha final conserva El Elegante');
console.log('  ✓ Equipo A: hipótesis → bitácora → propuesta → objeción → mantiene su sitio');

// Equipo B: concluye que necesita más evidencia (no hace falta citar un hallazgo, sí el dato que falta).
let b = proposal('Equipo B', 'meteor-crater');
b = { ...b, objection: '¿Saben si el suelo de la pared está suelto como el regolito?', decision: 'more-evidence' };
check(!validateStep(4, b).includes('errorDecisionFinding'), 'Equipo B: «más evidencia» no exige hallazgo de respaldo');
check(validateStep(4, b).includes('errorDecisionReason'), 'Equipo B: debe decir qué dato falta');
b = { ...b, decisionReason: 'Falta saber qué tan suelto es el suelo; buscaríamos estudios de mecánica de suelos.' };
check(validateStep(4, b).length === 0, 'Equipo B: decisión revisada válida (más evidencia)');
check(revisedSite(b) === null, 'Equipo B: la ficha final no asigna sitio');
console.log('  ✓ Equipo B: hipótesis → bitácora → propuesta → objeción → necesita más evidencia');

// Cambiar de sitio lleva al otro candidato.
const c = { ...a, decision: 'change' as const };
check(revisedSite(c) === 'meteor-crater', 'Cambiar de sitio lleva al otro candidato');

// Neutralidad: ningún sitio ni decisión cambia la validación (la app no califica).
for (const site of CANDIDATE_SITE_IDS) {
  for (const decision of REVIEW_DECISIONS) {
    const p = { ...a, proposedSite: site, decision, decisionFindingId: decision === 'more-evidence' ? null : 'f-3' };
    check(validateStep(4, p).length === 0, `Neutralidad: ${site} + ${decision} es igual de válido`);
  }
}
console.log('  ✓ Cualquier sitio y cualquier decisión valen si están justificados');

// ---------------------------------------------------------------------------
console.log('\nBorrador guardado');
const withDraft: MissionProgress = { ...a, step: 2, findingDraft: { ...finding('x'), note: 'Nota a medio escribir' } };
const restored = sanitizeProgress(JSON.parse(JSON.stringify(withDraft)));
check(restored.findingDraft?.note === 'Nota a medio escribir', 'El hallazgo a medio escribir sobrevive a una recarga');
check(restored.findings.length === 3 && restored.decisionFindingId === 'f-3', 'La bitácora y la revisión sobreviven a una recarga');
check(sanitizeProgress(null).step === 1, 'null → avance vacío');
check(sanitizeProgress({ step: 9, provisionalSite: 'luna', findings: [{ id: 3 }] }).step === 1, 'Paso inválido → paso 1');
check(sanitizeProgress({ provisionalSite: 'north-ray' }).provisionalSite === null, 'North Ray no puede ser candidato');
check(sanitizeProgress({ ...a, mainFindingId: 'no-existe' }).mainFindingId === null, 'Una cita a un hallazgo inexistente se descarta');
check(sanitizeProgress({ ...a, decision: 'aprobar' }).decision === null, 'Una decisión desconocida se descarta');

// Migración del formato anterior (observaciones sin nota).
const legacy = sanitizeProgress({
  step: 4,
  provisionalSite: 'meteor-crater',
  observations: [{ id: 'obs-1', site: 'north-ray', direction: 'west-east', index: 10, distance: 750, height: 80, slope: 30 }],
  finalSite: 'el-elegante',
  citedObservationId: 'obs-1',
});
check(legacy.findings.length === 1 && legacy.findings[0]?.kind === 'point' && legacy.findings[0].note === '', 'Las observaciones antiguas pasan a la bitácora sin nota');
check(legacy.proposedSite === 'el-elegante' && legacy.mainFindingId === 'obs-1' && legacy.step === 3, 'La decisión antigua pasa a ser la propuesta (paso 3)');
check(validateStep(2, legacy).includes('errorFindingNote'), 'Tras migrar, la bitácora pide completar las notas');
console.log('  ✓ Borrador, bitácora y revisión persisten; datos corruptos o antiguos no rompen nada');

// ---------------------------------------------------------------------------
console.log('\nRúbrica y guía');
for (const text of [roverEs, roverEn]) {
  check(text.guide.rubric.length === 3, 'La rúbrica debe tener 3 criterios');
  check(text.guide.rubric.every((row) => row.levels.length === text.guide.rubricLevels.length), 'Cada criterio necesita todos los niveles');
  const minutes = text.guide.timeline.map((item) => Number(item.time.split('–')[1]?.replace(/\D/g, '')));
  check(minutes[minutes.length - 1] === 45, 'La secuencia debe terminar en el minuto 45');
  check(text.guide.reviewSteps.length >= 4, 'La guía explica cómo intercambiar y devolver las fichas');
}
check(roverEs.guide.closing === '¿Qué evidencia te haría cambiar de opinión?', 'Falta la pregunta de cierre');
check(roverEs.guide.objectionExample === OBJECTION, 'La objeción de ejemplo es la pedida');
check(
  roverEs.guide.rubric.map((row) => row.criterion).join('|') ===
    'La evidencia se puede localizar|La evidencia respalda la decisión|Reconoce qué falta investigar',
  'La rúbrica evalúa localizar, respaldar y reconocer qué falta',
);
console.log('  ✓ Guía de 45 min con revisión entre equipos, objeción de ejemplo y rúbrica de 3 criterios');

console.log('');
if (failures > 0) {
  console.error(`✗ ${failures} comprobaciones fallidas (${passed} correctas).`);
  process.exit(1);
}
console.log(`✓ Misión verificada: ${passed} comprobaciones correctas.`);
