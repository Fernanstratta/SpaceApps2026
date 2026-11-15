import type { AxisId, ClassroomAlternativeType, EducationLevel, LearningActivityType, LessonVisualKind, SubmoduleStage } from '../../types';

/**
 * Contenido educativo de los nueve ejes: una lección de estudiante y un plan
 * docente por cada submódulo (27 en total), en cada idioma.
 *
 * CADA SUBMÓDULO SE ESCRIBE PARA SU NIVEL (`data/submodules.ts`): no es el
 * mismo texto con otro vocabulario. Primaria tiene menos bloques, frases
 * cortas y ejemplos concretos; secundaria introduce los términos y guía la
 * lectura de datos; preparatoria entra al método, a sus limitaciones y al
 * análisis crítico.
 *
 * NINGÚN NÚMERO DE COMPARACIÓN SE ESCRIBE A MANO. Los valores del backend se
 * citan con marcas que `data/curriculumTokens.ts` sustituye al construir el
 * contenido (los pares se abrevian: elegante, pinacate, cerro, laguna, cucapa):
 *
 *   [[earth laguna slope]]   valor del sitio terrestre        → «1»
 *   [[moon laguna slope]]    valor del sitio lunar            → «0.98»
 *   [[s laguna slope]]       similitud del eje en ese par     → «96.0»
 *   [[rawE elegante roughness]] / [[rawM …]]  valor crudo     → «-6.434 dB»
 *   [[times elegante thermal]]  cuántas veces mayor           → «9»
 *   [[ils laguna]]           ILS del par                      → «66.1»
 *   [[completeness laguna]]  completitud del par              → «89 %»
 *   [[R slope]] [[weight slope]] [[conf slope]]  tolerancia, peso y confianza del eje
 *   [[fact elegante earth depth_m]]  dato del sitio (`facts`) → «244»
 *
 * Si una marca apunta a un dato que el backend no tiene, la construcción
 * falla (lo detecta `npm run verify:data`): un faltante nunca se rellena.
 */

export interface ConceptText {
  term: string;
  definition: string;
}

export interface ActivityText {
  title: string;
  description: string;
}

export interface BlockText {
  /** Identificador estable del bloque (igual en todos los idiomas). */
  id: string;
  title: string;
  /** Uno o varios párrafos separados por una línea en blanco. */
  body: string;
  /** Foto de `data/images.ts`. */
  imageId?: string;
  /** Figura o visualización contextual (ver `LessonVisualKind`). */
  visual?: LessonVisualKind;
}

export interface QuizText {
  question: string;
  options: string[];
  /** Índice de la opción correcta. */
  answer: number;
  explanation: string;
}

export interface StepText {
  title: string;
  description: string;
  minutes: number;
}

export interface StudentLessonText {
  introduction: string;
  blocks: BlockText[];
  concepts: ConceptText[];
  /** El eje en la Tierra y en la Luna (paneles «La Tierra» y «La Luna»). */
  earth: string;
  moon: string;
  /** Qué mirar en los datos reales de la sección «Comparación». */
  comparisonLead: string;
  facts: string[];
  activities: (ActivityText & { type: LearningActivityType; minutes: number })[];
  quiz: QuizText[];
  conclusion: string;
}

export interface TeacherLessonText {
  objectives: string[];
  priorKnowledge: string[];
  materials: string[];
  /** Contenidos a impartir: lo esencial y el error frecuente que conviene atajar. */
  explanation: string;
  /** Secuencia de la sesión; los minutos suman la duración de la sesión. */
  steps: StepText[];
  discussion: string[];
  /** Práctica con los datos de comparación del backend. */
  dataActivity: ActivityText & { minutes: number };
  assessment: string[];
  outcomes: string[];
  /** Variante para el aula cuando no hay internet o falta algún material. */
  alternative: ActivityText & { type: ClassroomAlternativeType; materials: string[] };
  /** Qué observar en los sitios reales de la región relacionados con la lección. */
  siteActivities: string[];
}

export interface SubmoduleText {
  /** Resumen de la tarjeta del submódulo. */
  summary: string;
  student: StudentLessonText;
  teacher: TeacherLessonText;
}

/** Contenido de un eje: su presentación y sus tres submódulos. */
export interface AxisCurriculumText {
  student: { tagline: string; overview: string };
  teacher: { tagline: string; overview: string; objectives: string[] };
  submodules: Record<SubmoduleStage, SubmoduleText>;
}

/** Textos comunes a todas las lecciones (lo que se arma con datos, no la lección misma). */
export interface CurriculumShared {
  levels: Record<EducationLevel, string>;
  /** «Primaria a preparatoria». */
  levelRange: (first: string, last: string) => string;
  sessionDuration: (minutes: number) => string;
  moduleDuration: (sessions: number, minutes: number) => string;
  /** Actividad de exploración que lleva del submódulo al Playground. */
  playground: (axis: string) => ActivityText;
  /** Clave de la comprobación, añadida a la evaluación del plan docente. */
  quizKey: (number: number, question: string, answer: string) => string;
  printable: {
    title: string;
    description: (axis: string, units: string) => string;
    row: (pair: string, earth: string, moon: string, similarity: string) => string;
    rowMissing: (pair: string) => string;
    materials: string[];
  };
  location: {
    description: (type: string, radius: string, note: string) => string;
    relation: (axis: string, earthValue: string) => string;
    relationMissing: (axis: string) => string;
  };
}

export interface CurriculumText {
  axes: Record<AxisId, AxisCurriculumText>;
  shared: CurriculumShared;
}
