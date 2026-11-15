/**
 * Contraste de las tres propuestas de modo claro (`npm run verify:preview`).
 * Usa las mismas paletas que la vista previa (`src/preview/missionPalettes.ts`).
 */
import { contrast, contrastPairs, PALETTES, PROPOSALS } from '../src/preview/missionPalettes';

let failures = 0;
for (const id of PROPOSALS) {
  const palette = PALETTES[id];
  const pairs = contrastPairs(palette);
  let worst = { label: '', ratio: Infinity };
  for (const pair of pairs) {
    const ratio = contrast(pair.fg, pair.bg);
    if (ratio < worst.ratio) worst = { label: pair.label, ratio };
    if (ratio < pair.min) {
      failures += 1;
      console.error(`✗ ${id}: ${pair.label} ${pair.fg} / ${pair.bg} = ${ratio.toFixed(2)} (mínimo ${pair.min})`);
    }
  }
  // Fondo, superficie y acción deben ser colores distintos.
  const families = [palette.bg, palette.surface, palette.action];
  if (new Set(families.map((c) => c.toLowerCase())).size !== 3) {
    failures += 1;
    console.error(`✗ ${id}: fondo, superficie y acción repiten color`);
  }
  console.log(`  ${id}: ${pairs.length} pares revisados; el más justo es «${worst.label}» (${worst.ratio.toFixed(2)}:1)`);
}
if (failures > 0) {
  console.error(`\n✗ ${failures} problemas de contraste`);
  process.exit(1);
}
console.log('\n✓ Contraste AA en las tres propuestas');
