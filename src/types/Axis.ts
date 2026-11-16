/**
 * Los nueve ejes comparativos Tierra–Luna del proyecto (documento del equipo
 * «Índice de Similitud Lunar (ILS)», esquema 1.0.0). Son a la vez:
 *  - la estructura temática del Portal Educativo (un tema por eje), y
 *  - las categorías de filtro de Terranauta Playground.
 * El orden es el del documento (eje 1 a eje 9). Los nombres visibles están en
 * `i18n/playground.{es,en}.ts` (`axes[id].name`), una sola vez por idioma.
 */
export const AXIS_IDS = ['slope', 'roughness', 'mineralogy', 'albedo', 'thermal', 'aridity', 'ice', 'dust', 'craters'] as const;

export type AxisId = (typeof AXIS_IDS)[number];

export function isAxisId(value: unknown): value is AxisId {
  return typeof value === 'string' && (AXIS_IDS as readonly string[]).includes(value);
}
