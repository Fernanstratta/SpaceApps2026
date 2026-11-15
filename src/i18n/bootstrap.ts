import { stripBase, toHref } from '../router/base';
import type { Language } from './config';
import { planInitialLanguage, type LanguageSource } from './detect';
import { detectCountry, type CountrySource } from './geo';
import { readSavedLanguage } from './storage';

export interface LanguageDiagnostics {
  language: Language;
  source: LanguageSource;
  country: string | null;
  countrySource: CountrySource | null;
}

declare global {
  interface Window {
    /** Cómo se eligió el idioma en esta carga (útil para probar la detección). */
    __STARMAN_I18N__?: LanguageDiagnostics;
  }
}

/**
 * Se ejecuta una vez, antes de montar React. Si la URL no trae idioma
 * (`/`, `/portal-educativo`…), elige uno y reescribe la URL con
 * `history.replaceState` (sin recargar ni añadir entradas al historial).
 * Si ya trae `/es` o `/en`, se respeta tal cual.
 */
export async function bootstrapLanguage(): Promise<Language> {
  const pathname = stripBase(window.location.pathname);
  const savedLanguage = readSavedLanguage();
  const browserLanguages = navigator.languages?.length ? navigator.languages : [navigator.language];

  // Solo se consulta el país si hace falta: URL sin idioma y sin elección guardada.
  const needsCountry = !/^\/(es|en)(\/|$)/.test(pathname) && !savedLanguage;
  const country = needsCountry ? await detectCountry() : { code: null, source: null };

  const plan = planInitialLanguage(pathname, {
    savedLanguage,
    countryCode: country.code,
    browserLanguages,
  });

  if (plan.redirectTo) {
    const url = toHref(plan.redirectTo) + window.location.search + window.location.hash;
    window.history.replaceState(window.history.state, '', url);
  }

  document.documentElement.lang = plan.language;
  window.__STARMAN_I18N__ = {
    language: plan.language,
    source: plan.source,
    country: country.code,
    countrySource: country.source,
  };
  if (import.meta.env.DEV) console.info('[Starman i18n]', window.__STARMAN_I18N__);

  return plan.language;
}
