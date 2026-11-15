import type { AxisId, LearningActivityType } from '../../types';
import type { Confidence } from '../../utils/ils';

/**
 * Textos pedagógicos de los nueve ejes del Portal Educativo.
 *
 * El contenido científico de cada eje (qué mide, por qué importa, fuentes,
 * consideraciones y los pares de sitios) NO está aquí: se reutiliza de
 * `i18n/playground.{es,en}.ts`, que viene del documento ILS del equipo. Aquí
 * solo va el encuadre para enseñar y aprender: presentación, ganchos,
 * conceptos clave, actividades, preguntas y plantillas de cada etapa.
 * Ninguna plantilla introduce mediciones: los únicos números provienen del
 * catálogo (`data/lunarAnalogs.ts`).
 */

export interface ConceptText {
  term: string;
  definition: string;
}

export interface ActivityText {
  title: string;
  description: string;
}

/** Lo propio de cada eje (todo lo demás se construye con las plantillas). */
export interface AxisCurriculumText {
  student: { tagline: string; overview: string };
  teacher: { tagline: string; overview: string; objectives: string[] };
  /** Submódulo 1 (concepto). */
  concept: {
    /** Gancho de entrada; lo comparten el estudiante y el plan docente. */
    introduction: string;
    concepts: ConceptText[];
    activity: ActivityText & { type: LearningActivityType };
    discussion: string[];
  };
}

/** Plantillas comunes a los nueve ejes. `axis` es el nombre del eje. */
export interface CurriculumTemplates {
  blocks: {
    measures: string;
    why: string;
    earth: string;
    moon: string;
    notes: string;
    breaks: string;
  };
  concept: {
    facts: (axisNumber: number, total: number, pairCount: number) => string[];
    conclusion: (axis: string) => string;
    objectives: (axis: string, terms: string) => string[];
    assessment: string[];
    outcomes: (axis: string) => string[];
  };
  measurement: {
    introduction: (axis: string) => string;
    metric: string;
    formulas: { linear: ConceptText; log: ConceptText };
    tolerance: { term: string; definition: (value: string) => string };
    confidence: { term: (level: Confidence) => string; definition: (meaning: string) => string };
    facts: { weight: (weight: string, total: string) => string; absence: (weight: string) => string };
    activity: (axis: string) => ActivityText;
    conclusion: string;
    objectives: (axis: string, metric: string) => string[];
    discussion: (level: Confidence) => string[];
    assessment: string[];
    outcomes: (level: Confidence) => string[];
  };
  analogs: {
    introduction: (axis: string, pairCount: number) => string;
    none: (axis: string) => string;
    concepts: ConceptText[];
    facts: {
      strong: (pair: string, axis: string) => string;
      published: (pair: string, earth: string, moon: string) => string;
      provisional: (pair: string, earth: string, moon: string) => string;
    };
    questionTitle: (pair: string) => string;
    playground: (axis: string) => ActivityText;
    conclusion: (axis: string) => string;
    explanation: (axis: string) => string;
    discussion: (axis: string) => string[];
    objectives: string[];
    assessment: string[];
    outcomes: string[];
  };
  /** Actividad del docente (sección «Actividades»): exploración guiada en Playground. */
  teacherPlayground: (axis: string, stage: 'concept' | 'measurement' | 'analogs') => ActivityText;
}

export interface CurriculumText {
  axes: Record<AxisId, AxisCurriculumText>;
  templates: CurriculumTemplates;
}
