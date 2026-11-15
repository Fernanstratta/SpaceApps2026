import { DEFAULT_LANGUAGE, SPANISH_SPEAKING_COUNTRIES, type Language } from './config';
import { localizePath, parsePath } from './paths';

/**
 * Lógica pura de elección de idioma (sin `window`), compartida por la app y
 * por `scripts/verify-i18n.ts`.
 *
 * Prioridad:
 *  1. Idioma explícito en la URL (`/es/...`, `/en/...`): se respeta siempre.
 *  2. Elección guardada del usuario (selector ES / EN).
 *  3. País detectado: español si es hispanohablante, inglés en otro caso.
 *  4. Idioma preferido del navegador: español o inglés; cualquier otro → español.
 */

export type LanguageSource = 'url' | 'saved' | 'country' | 'browser' | 'default';

export interface LanguageInput {
  urlLanguage: Language | null;
  savedLanguage: Language | null;
  /** Código ISO 3166-1 alfa-2 (p. ej. `MX`), o `null` si no se pudo detectar. */
  countryCode: string | null;
  /** `navigator.languages` (el primero es el preferido). */
  browserLanguages: readonly string[];
}

export interface LanguageResult {
  language: Language;
  source: LanguageSource;
}

/**
 * Normaliza un código de país. Devuelve `null` para valores desconocidos,
 * incluidos los marcadores de algunos proveedores (`XX` desconocido y `T1`
 * Tor en Cloudflare, `ZZ` en otros servicios de GeoIP).
 */
export function normalizeCountryCode(value: string | null | undefined): string | null {
  const code = value?.trim().toUpperCase() ?? '';
  if (!/^[A-Z]{2}$/.test(code) || code === 'XX' || code === 'ZZ') return null;
  return code;
}

/** Idioma que corresponde a un país, o `null` si el país es desconocido. */
export function languageForCountry(countryCode: string | null | undefined): Language | null {
  const code = normalizeCountryCode(countryCode);
  if (!code) return null;
  return SPANISH_SPEAKING_COUNTRIES.has(code) ? 'es' : 'en';
}

/** Idioma preferido del navegador: `es-*` → es, `en-*` → en, otro o ninguno → `null`. */
export function languageFromBrowser(browserLanguages: readonly string[]): Language | null {
  const preferred = browserLanguages[0]?.toLowerCase().split('-')[0];
  if (preferred === 'es' || preferred === 'en') return preferred;
  return null;
}

export function resolveLanguage(input: LanguageInput): LanguageResult {
  if (input.urlLanguage) return { language: input.urlLanguage, source: 'url' };
  if (input.savedLanguage) return { language: input.savedLanguage, source: 'saved' };

  const byCountry = languageForCountry(input.countryCode);
  if (byCountry) return { language: byCountry, source: 'country' };

  const byBrowser = languageFromBrowser(input.browserLanguages);
  if (byBrowser) return { language: byBrowser, source: 'browser' };

  return { language: DEFAULT_LANGUAGE, source: 'default' };
}

export interface InitialPlan extends LanguageResult {
  /** Ruta pública a la que hay que reescribir la URL, o `null` si ya tiene idioma. */
  redirectTo: string | null;
}

/**
 * Decide el idioma de la primera carga y si hay que reescribir la URL.
 * Una URL con prefijo de idioma nunca se redirige, así que aplicar el plan
 * dos veces no produce otra redirección (no hay bucles).
 */
export function planInitialLanguage(
  pathname: string,
  input: Omit<LanguageInput, 'urlLanguage'>,
): InitialPlan {
  const parsed = parsePath(pathname);
  const result = resolveLanguage({ ...input, urlLanguage: parsed.language });
  return {
    ...result,
    redirectTo: parsed.language ? null : localizePath(parsed.path, result.language),
  };
}
