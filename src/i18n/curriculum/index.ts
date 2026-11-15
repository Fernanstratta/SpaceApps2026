import type { Language } from '../config';
import { curriculumEn } from './en';
import { curriculumEs } from './es';
import type { CurriculumText } from './types';

/** Textos pedagógicos de los nueve ejes por idioma. */
export const CURRICULUM_TEXT: Record<Language, CurriculumText> = { es: curriculumEs, en: curriculumEn };
