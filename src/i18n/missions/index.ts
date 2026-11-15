import type { Language } from '../config';
import { useI18n } from '../I18nContext';
import { roverEn } from './rover.en';
import { lunitaEn } from './lunita.en';
import { lunitaEs, type LunitaMissionText } from './lunita.es';
import { roverEs, type RoverMissionText } from './rover.es';

export const ROVER_MISSION_TEXT: Record<Language, RoverMissionText> = { es: roverEs, en: roverEn };

/** Textos de la Misión 01 en el idioma activo. */
export function useRoverMissionText(): RoverMissionText {
  return ROVER_MISSION_TEXT[useI18n().language];
}

export const LUNITA_MISSION_TEXT: Record<Language, LunitaMissionText> = { es: lunitaEs, en: lunitaEn };

/** Textos de la misión 4Kids en el idioma activo. */
export function useLunitaMissionText(): LunitaMissionText {
  return LUNITA_MISSION_TEXT[useI18n().language];
}

export type { LunitaMissionText, RoverMissionText };
