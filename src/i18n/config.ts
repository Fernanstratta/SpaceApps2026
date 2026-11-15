/**
 * Configuración central del bilingüismo (español / inglés).
 * Todo lo que decide "qué idioma" vive aquí y en `detect.ts`.
 */

export const LANGUAGES = ['es', 'en'] as const;
export type Language = (typeof LANGUAGES)[number];

/** Idioma de último recurso (también cuando el navegador no prefiere ni español ni inglés). */
export const DEFAULT_LANGUAGE: Language = 'es';

/** Clave de `localStorage` con la elección manual del usuario (selector ES / EN). */
export const LANGUAGE_STORAGE_KEY = 'starman-lang';

/** Configuración regional para formatear números y fechas. */
export const LOCALES: Record<Language, string> = { es: 'es-MX', en: 'en-US' };

export function isLanguage(value: unknown): value is Language {
  return typeof value === 'string' && (LANGUAGES as readonly string[]).includes(value);
}

/**
 * Países (ISO 3166-1 alfa-2) donde el español es idioma oficial o predominante.
 * Estados Unidos no está: el inglés es el idioma predominante.
 */
export const SPANISH_SPEAKING_COUNTRIES: ReadonlySet<string> = new Set([
  'AR', // Argentina
  'BO', // Bolivia
  'CL', // Chile
  'CO', // Colombia
  'CR', // Costa Rica
  'CU', // Cuba
  'DO', // República Dominicana
  'EC', // Ecuador
  'ES', // España
  'GQ', // Guinea Ecuatorial
  'GT', // Guatemala
  'HN', // Honduras
  'MX', // México
  'NI', // Nicaragua
  'PA', // Panamá
  'PE', // Perú
  'PR', // Puerto Rico
  'PY', // Paraguay
  'SV', // El Salvador
  'UY', // Uruguay
  'VE', // Venezuela
]);

/**
 * Segmentos de URL traducidos. Internamente las rutas usan los slugs en
 * español (`/portal-educativo`); en la URL en inglés se muestran estos.
 * Los ids de temas y submódulos no se traducen (son identificadores).
 */
export const LOCALIZED_SEGMENTS: Record<Language, Readonly<Record<string, string>>> = {
  es: {},
  en: {
    'portal-educativo': 'educational-portal',
    'iniciar-sesion': 'sign-in',
    'crear-cuenta': 'sign-up',
    mision: 'mission',
    'rover-lunar': 'lunar-rover',
    iniciar: 'start',
    clase: 'teach',
  },
};
