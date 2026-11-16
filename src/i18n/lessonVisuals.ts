import type { Language } from './config';
import { lessonVisualsEn } from './lessonVisuals.en';
import { lessonVisualsEs, type LessonVisualsText } from './lessonVisuals.es';

export type { LessonVisualsText };

export const LESSON_VISUALS_TEXT: Record<Language, LessonVisualsText> = { es: lessonVisualsEs, en: lessonVisualsEn };
