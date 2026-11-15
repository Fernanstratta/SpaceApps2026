/**
 * Verifica la misión 4Kids «Lunita necesita un camino» sin navegador
 * (`npm run verify:lunita`): campo de rocas, rutas válidas y bloqueadas,
 * corrección sin reiniciar, guardado y textos en ambos idiomas.
 */
import {
  evaluateRoute,
  GOAL,
  MAP_PIECES,
  MOON_LIKE_PIECE,
  pointAt,
  ROCKS,
  routeFromStrokes,
  SAMPLE_ROUTES,
  START,
  TRAY_ORDER,
  truncateRoute,
} from '../src/data/missions/lunitaMission';
import { EMPTY_LUNITA, sanitizeLunita } from '../src/hooks/useLunitaProgress';
import { lunitaEn } from '../src/i18n/missions/lunita.en';
import { lunitaEs } from '../src/i18n/missions/lunita.es';
import { localizePath } from '../src/i18n/paths';
import { ROUTES } from '../src/router/routes';

let failures = 0;
let passed = 0;
function check(condition: boolean, message: string): void {
  if (condition) passed += 1;
  else {
    failures += 1;
    console.error(`✗ ${message}`);
  }
}

console.log('\nCampo de rocas');
const straight = [START, GOAL];
const straightRun = evaluateRoute(straight);
check(straightRun.kind === 'blocked', 'La línea recta choca con una roca (hay que rodearlas)');
for (const [name, route] of Object.entries(SAMPLE_ROUTES)) {
  const run = evaluateRoute(route);
  check(run.kind === 'arrived', `Ruta de ejemplo «${name}» llega sin chocar (${run.kind})`);
}
check(
  SAMPLE_ROUTES.top.every((p) => p.y <= 130) && SAMPLE_ROUTES.bottom.every((p) => p.y >= 130),
  'Las dos rutas de ejemplo son distintas (una por arriba, otra por abajo)',
);
check(ROCKS.every((r) => Math.hypot(r.x - START.x, r.y - START.y) > r.r + 20), 'Ninguna roca tapa a Lunita al empezar');
check(ROCKS.every((r) => Math.hypot(r.x - GOAL.x, r.y - GOAL.y) > r.r + 20), 'Ninguna roca tapa la meta');
// Zigzag entre las rocas centrales: también vale (no hay una única respuesta).
const zigzag = [START, { x: 110, y: 75 }, { x: 150, y: 85 }, { x: 163, y: 117 }, { x: 172, y: 150 }, { x: 176, y: 205 }, { x: 240, y: 198 }, GOAL];
check(evaluateRoute(zigzag).kind === 'arrived', 'Un zigzag entre las rocas centrales también es válido');
console.log('  ✓ La recta choca; arriba, abajo y zigzag llegan a la meta');

console.log('\nPrueba y corrige');
const blocked = evaluateRoute(straight);
if (blocked.kind === 'blocked') {
  const stop = pointAt(straight, blocked.distance);
  const rock = ROCKS[blocked.rockIndex]!;
  check(Math.hypot(stop.x - rock.x, stop.y - rock.y) >= rock.r, 'Lunita se detiene antes de la roca, no dentro');
  check(stop.x > START.x && stop.x < rock.x, 'Lunita se detiene sobre el trazo, en el punto del choque');
  // Corregir sin reiniciar: recortar donde se detuvo y seguir dibujando por abajo.
  const kept = truncateRoute(straight, blocked.distance);
  check(kept.length === 2 && evaluateRoute(kept).kind !== 'blocked', 'Recortar deja un camino sin choques');
  const fixed = [...kept, { x: 100, y: 205 }, { x: 310, y: 215 }, GOAL];
  check(evaluateRoute(fixed).kind === 'arrived', 'Tras corregir desde el punto del choque, Lunita llega');
}
const shortRoute = [START, { x: 90, y: 60 }, { x: 200, y: 55 }];
check(evaluateRoute(shortRoute).kind === 'short', 'Una ruta que no llega se detecta (sin choque)');
check(evaluateRoute([START]).kind === 'empty', 'Sin ruta no hay recorrido');
// Deshacer: quitar el último trazo vuelve a la ruta anterior.
const strokes = [[{ x: 90, y: 60 }], [{ x: 320, y: 50 }], [GOAL]];
check(evaluateRoute(routeFromStrokes(strokes)).kind === 'arrived', 'Los trazos forman la ruta completa');
check(evaluateRoute(routeFromStrokes(strokes.slice(0, -1))).kind === 'short', 'Deshacer quita solo el último trazo');
// Lunita sigue el trazo: cada posición animada está sobre la ruta dibujada.
const run = evaluateRoute(SAMPLE_ROUTES.bottom);
if (run.kind === 'arrived') {
  for (let d = 0; d <= run.distance; d += 7) {
    const p = pointAt(SAMPLE_ROUTES.bottom, d);
    const onRoute = SAMPLE_ROUTES.bottom.some((a, i) => {
      const b = SAMPLE_ROUTES.bottom[i + 1];
      if (!b) return false;
      const cross = Math.abs((b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x)) / Math.hypot(b.x - a.x, b.y - a.y);
      return cross < 0.01 && p.x >= Math.min(a.x, b.x) - 0.01 && p.x <= Math.max(a.x, b.x) + 0.01;
    });
    check(onRoute, `Lunita va sobre el trazo en d=${d}`);
  }
}
console.log('  ✓ Se detiene en la roca, se corrige desde ahí, deshacer y seguir el trazo funcionan');

console.log('\nRompecabezas y guardado');
check(new Set(TRAY_ORDER).size === MAP_PIECES.length && TRAY_ORDER.join() !== MAP_PIECES.join(), 'Las piezas empiezan desordenadas');
check(MAP_PIECES.includes(MOON_LIKE_PIECE), 'La parte parecida a la Luna es una de las piezas');
const saved = sanitizeLunita(
  JSON.parse(JSON.stringify({ ...EMPTY_LUNITA, step: 4, placed: ['forest', 'lava', 'coast'], region: 'lava', strokes })),
);
check(saved.step === 4 && saved.placed.length === 3 && saved.strokes.length === 3, 'El avance sobrevive a una recarga');
check(sanitizeLunita(null).step === 1, 'Sin datos → paso 1');
check(sanitizeLunita({ step: 9, placed: ['luna'], strokes: [[{ x: 'a' }]] }).step === 1, 'Datos corruptos → paso 1');
check(sanitizeLunita({ placed: ['lava', 'lava', 'mars'] }).placed.join() === 'lava', 'Piezas repetidas o inventadas se descartan');
console.log('  ✓ Piezas desordenadas; el avance se guarda y los datos corruptos no rompen nada');

console.log('\nTextos y ruta');
type Tree = { [key: string]: unknown };
const keyPaths = (o: Tree, prefix = ''): string[] =>
  Object.entries(o).flatMap(([k, v]) =>
    v && typeof v === 'object' && !Array.isArray(v) ? keyPaths(v as Tree, `${prefix}${k}.`) : [`${prefix}${k}`],
  );
const esKeys = keyPaths(lunitaEs as unknown as Tree);
const enKeys = keyPaths(lunitaEn as unknown as Tree);
check(esKeys.join() === enKeys.join(), 'Los textos de Lunita tienen las mismas claves en ES y EN');
check(lunitaEs.meta.badge === '4Kids' && lunitaEn.meta.badge === '4Kids', 'El distintivo se llama «4Kids» en ambos idiomas');
check(lunitaEs.meta.title === 'Lunita necesita un camino', 'Título en español');
check(lunitaEs.meta.cta === 'Jugar misión', 'Botón «Jugar misión»');
check(lunitaEs.step1.challenge === 'Antes de ir a la Luna, encontremos un lugar en la Tierra para practicar.', 'Reto en una frase');
check(lunitaEs.step4.hint === 'Hay una roca aquí. ¿Por dónde podrías rodearla?', 'Pista al chocar');
check(lunitaEs.step5.because === 'Este lugar sirve para practicar porque…', 'Frase para completar');
check(lunitaEs.step5.challenge === 'Si Lunita necesitara practicar una subida, ¿qué buscarías en otro lugar?', 'Reto opcional 9–12');
check(localizePath(ROUTES.lunita, 'en') === '/en/educational-portal/mission/lunita', 'Ruta en inglés');
check(localizePath(ROUTES.lunita, 'es') === '/es/portal-educativo/mision/lunita', 'Ruta en español');
console.log(`  ✓ ${esKeys.length} textos en ES y EN; «4Kids» se conserva`);

console.log('');
if (failures > 0) {
  console.error(`✗ ${failures} comprobaciones fallidas (${passed} correctas).`);
  process.exit(1);
}
console.log(`✓ Lunita verificada: ${passed} comprobaciones correctas.`);
