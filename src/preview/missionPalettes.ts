/**
 * Paletas de las tres propuestas de modo claro para la sección de Misiones.
 * Una sola fuente de verdad: la vista previa las aplica como variables CSS
 * (`--mp-*`) y `npm run verify:preview` comprueba su contraste (WCAG 2.1).
 *
 * Cada propuesta separa tres familias de color:
 *  - fondo general (`bg`, y las bandas de sección `band1`/`band2`),
 *  - superficies (`surface`, `surfaceAlt`),
 *  - acciones (`action`, `actionText`, `actionAlt`…).
 */

export const PROPOSALS = ['atlas', 'cuaderno', 'museo'] as const;
export type ProposalId = (typeof PROPOSALS)[number];

export interface Palette {
  /** Fondo general de la página. */
  bg: string;
  /** Bandas de sección de ancho completo (primera y segunda misión). */
  band1: string;
  band2: string;
  /** Superficies (paneles, marcos de imagen, columnas). */
  surface: string;
  surfaceAlt: string;
  /** Títulos y texto. */
  title: string;
  text: string;
  muted: string;
  /** Líneas y bordes. */
  rule: string;
  /** Acción principal (12–17). */
  action: string;
  actionHover: string;
  actionText: string;
  /** Acción secundaria (borde + texto sobre la superficie). */
  actionAlt: string;
  /** Acento de texto (eyebrows, pies de foto destacados). */
  accent: string;
  /** 4Kids: amarillo y turquesa. `kidsTealText` es la versión legible como texto. */
  kidsYellow: string;
  kidsYellowText: string;
  kidsTeal: string;
  kidsTealText: string;
  /** Etiquetas de edad. */
  chip: string;
  chipText: string;
}

export const PALETTES: Record<ProposalId, Palette> = {
  /** 1. Atlas Tierra–Luna: azul niebla, tinta azul y superficies celestes. */
  atlas: {
    bg: '#e4ebf3',
    band1: '#e4ebf3',
    band2: '#dbe5f0',
    surface: '#cfe3f5',
    surfaceAlt: '#bcd7ef',
    title: '#102446',
    text: '#1d3357',
    muted: '#3b5272',
    rule: '#9fb8d3',
    action: '#1d4f9e',
    actionHover: '#163f80',
    actionText: '#ffffff',
    actionAlt: '#163f80',
    accent: '#22508f',
    kidsYellow: '#ffc83d',
    kidsYellowText: '#102446',
    kidsTeal: '#17b3a3',
    kidsTealText: '#0b5f57',
    chip: '#102446',
    chipText: '#ffffff',
  },
  /** 2. Cuaderno de campo: arena suave, títulos azul marino y acentos verde petróleo. */
  cuaderno: {
    bg: '#f3ead8',
    band1: '#f3ead8',
    band2: '#efe4cf',
    surface: '#faf4e8',
    surfaceAlt: '#e9dcc2',
    title: '#18284a',
    text: '#2f3443',
    muted: '#595243',
    rule: '#c9b993',
    action: '#0d5c58',
    actionHover: '#0a4744',
    actionText: '#ffffff',
    actionAlt: '#0a4744',
    accent: '#0d5c58',
    kidsYellow: '#f2b631',
    kidsYellowText: '#18284a',
    kidsTeal: '#169e91',
    kidsTealText: '#0a4f49',
    chip: '#e3d3b0',
    chipText: '#18284a',
  },
  /** 3. Museo interactivo: bandas de ancho completo en azul hielo y lavanda suave. */
  museo: {
    bg: '#f1f2f7',
    band1: '#d3e8f5',
    band2: '#e2d9f4',
    surface: '#f8fbfd',
    surfaceAlt: '#f6f3fd',
    title: '#1a2040',
    text: '#272d4a',
    muted: '#4a5070',
    rule: '#b9c3d8',
    action: '#3a3d9b',
    actionHover: '#2e3180',
    actionText: '#ffffff',
    actionAlt: '#2e3180',
    accent: '#3a3d9b',
    kidsYellow: '#ffc83d',
    kidsYellowText: '#1c2b4f',
    kidsTeal: '#17b3a3',
    kidsTealText: '#0a6158',
    chip: '#1a2040',
    chipText: '#ffffff',
  },
};

/** Variables CSS de una paleta (`--mp-bg`, `--mp-action-text`…). */
export function paletteVars(palette: Palette): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const [key, value] of Object.entries(palette)) {
    vars[`--mp-${key.replace(/[A-Z0-9]/g, (c) => `-${c.toLowerCase()}`)}`] = value;
  }
  return vars;
}

/* ---------------- Contraste (WCAG 2.1) ---------------- */

function channel(value: number): number {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function luminance(hex: string): number {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return 0.2126 * channel(r ?? 0) + 0.7152 * channel(g ?? 0) + 0.0722 * channel(b ?? 0);
}

export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Pares texto/fondo que aparecen en la vista previa, con el mínimo exigido:
 * 4.5 para texto normal y 3 para títulos grandes o bordes de botones.
 */
export function contrastPairs(p: Palette): { label: string; fg: string; bg: string; min: number }[] {
  const backgrounds = { bg: p.bg, band1: p.band1, band2: p.band2, surface: p.surface, surfaceAlt: p.surfaceAlt };
  const pairs: { label: string; fg: string; bg: string; min: number }[] = [];
  for (const [name, bg] of Object.entries(backgrounds)) {
    pairs.push({ label: `texto sobre ${name}`, fg: p.text, bg, min: 4.5 });
    pairs.push({ label: `texto secundario sobre ${name}`, fg: p.muted, bg, min: 4.5 });
    pairs.push({ label: `título sobre ${name}`, fg: p.title, bg, min: 4.5 });
    pairs.push({ label: `acento sobre ${name}`, fg: p.accent, bg, min: 4.5 });
    pairs.push({ label: `botón secundario sobre ${name}`, fg: p.actionAlt, bg, min: 4.5 });
    pairs.push({ label: `turquesa 4Kids (texto) sobre ${name}`, fg: p.kidsTealText, bg, min: 4.5 });
    pairs.push({ label: `botón principal (borde) sobre ${name}`, fg: p.action, bg, min: 3 });
  }
  pairs.push({ label: 'texto del botón principal', fg: p.actionText, bg: p.action, min: 4.5 });
  pairs.push({ label: 'texto del botón principal (hover)', fg: p.actionText, bg: p.actionHover, min: 4.5 });
  pairs.push({ label: 'texto del botón 4Kids', fg: p.kidsYellowText, bg: p.kidsYellow, min: 4.5 });
  pairs.push({ label: 'etiqueta de edad', fg: p.chipText, bg: p.chip, min: 4.5 });
  return pairs;
}
