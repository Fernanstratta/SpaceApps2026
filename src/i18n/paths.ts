import { isLanguage, LOCALIZED_SEGMENTS, type Language } from './config';

/**
 * Conversión entre rutas internas (sin idioma, slugs en español) y rutas
 * públicas con prefijo de idioma:
 *   interna `/portal-educativo/gravity`
 *   → `/es/portal-educativo/gravity`  |  `/en/educational-portal/gravity`
 * Son funciones puras (sin `window`) para poder probarlas en Node.
 */

const REVERSE_SEGMENTS: Record<Language, Record<string, string>> = {
  es: invert(LOCALIZED_SEGMENTS.es),
  en: invert(LOCALIZED_SEGMENTS.en),
};

function invert(map: Readonly<Record<string, string>>): Record<string, string> {
  return Object.fromEntries(Object.entries(map).map(([internal, localized]) => [localized, internal]));
}

function normalize(path: string): string {
  const withSlash = path.startsWith('/') ? path : `/${path}`;
  return withSlash.length > 1 && withSlash.endsWith('/') ? withSlash.slice(0, -1) : withSlash;
}

export interface ParsedPath {
  /** Idioma explícito del prefijo, o `null` si la URL no lo trae. */
  language: Language | null;
  /** Ruta interna, sin prefijo y con los slugs internos. */
  path: string;
}

/** `/en/educational-portal/gravity` → `{ language: 'en', path: '/portal-educativo/gravity' }`. */
export function parsePath(pathname: string): ParsedPath {
  const parts = normalize(pathname).split('/').filter(Boolean);
  const [first, ...rest] = parts;
  if (!isLanguage(first)) return { language: null, path: normalize(parts.join('/')) };

  const reverse = REVERSE_SEGMENTS[first];
  const internal = rest.map((segment) => reverse[segment] ?? segment);
  return { language: first, path: normalize(internal.join('/')) };
}

/** Ruta interna + idioma → ruta pública con prefijo y slugs traducidos. */
export function localizePath(path: string, language: Language): string {
  const segments = normalize(path)
    .split('/')
    .filter(Boolean)
    .map((segment) => LOCALIZED_SEGMENTS[language][segment] ?? segment);
  return segments.length > 0 ? `/${language}/${segments.join('/')}` : `/${language}`;
}
