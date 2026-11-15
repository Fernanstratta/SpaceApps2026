import { isLanguage, LANGUAGE_STORAGE_KEY, type Language } from './config';

/**
 * Elección manual del idioma. Solo se guarda cuando el usuario usa el
 * selector ES / EN; abrir un enlace `/en/...` no la cambia.
 * Si el almacenamiento está bloqueado, la elección dura solo la visita.
 */

export function readSavedLanguage(): Language | null {
  try {
    const value = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return isLanguage(value) ? value : null;
  } catch {
    return null;
  }
}

export function saveLanguage(language: Language): void {
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // Almacenamiento no disponible: no se recuerda la elección.
  }
}
