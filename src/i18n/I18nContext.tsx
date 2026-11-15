import { createContext, useCallback, useContext, useEffect, useMemo, type ReactNode } from 'react';
import { getDataApi, type DataApi } from '../data/localized';
import { useRouter } from '../router/Router';
import { LOCALES, type Language } from './config';
import { en } from './messages/en';
import { es, type Messages } from './messages/es';
import { saveLanguage } from './storage';

const MESSAGES: Record<Language, Messages> = { es, en };

interface I18nContextValue {
  language: Language;
  /** Configuración regional para `Intl` (`es-MX`, `en-US`). */
  locale: string;
  messages: Messages;
  /** Elección manual: cambia la URL a la otra versión y la recuerda para próximas visitas. */
  setLanguage: (language: Language) => void;
}

export const I18nContext = createContext<I18nContextValue | null>(null);

/**
 * El idioma activo lo dicta la URL (`/es/...`, `/en/...`), que el router ya
 * expone; este proveedor añade los textos, guarda la elección manual y
 * sincroniza `<html lang>` y la meta descripción.
 */
export function I18nProvider({ children }: { children: ReactNode }) {
  const { language, switchLanguage } = useRouter();
  const messages = MESSAGES[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.querySelector('meta[name="description"]')?.setAttribute('content', messages.META.description);
  }, [language, messages]);

  const setLanguage = useCallback(
    (next: Language) => {
      saveLanguage(next);
      switchLanguage(next);
    },
    [switchLanguage],
  );

  const value = useMemo(
    () => ({ language, locale: LOCALES[language], messages, setLanguage }),
    [language, messages, setLanguage],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n debe usarse dentro de <I18nProvider>.');
  return context;
}

/** Textos de la interfaz en el idioma activo. */
export function useMessages(): Messages {
  return useI18n().messages;
}

/** Datos (temas, submódulos, imágenes, recursos…) en el idioma activo. */
export function useData(): DataApi {
  return getDataApi(useI18n().language);
}
