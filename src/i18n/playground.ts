import type { Language } from './config';
import { playgroundEn } from './playground.en';
import { playgroundEs, type PlaygroundText } from './playground.es';

/** Textos de Terranauta Playground por idioma. */
export const PLAYGROUND_TEXT: Record<Language, PlaygroundText> = { es: playgroundEs, en: playgroundEn };
