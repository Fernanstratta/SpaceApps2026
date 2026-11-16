import type { CurriculumShared } from '../types';

/** Textos comunes a todas las lecciones (español de México). */
export const sharedEs: CurriculumShared = {
  levels: { primaria: 'Primaria', secundaria: 'Secundaria', preparatoria: 'Preparatoria' },
  levelRange: (first, last) => `De ${first} a ${last}`,
  sessionDuration: (minutes) => `${minutes} minutos (una sesión)`,
  moduleDuration: (sessions, minutes) => `${sessions} sesiones, ${minutes} minutos en total`,
  playground: (axis) => ({
    title: 'Explora en la sección Similitud',
    description: `Abre la sección Similitud, elige el eje «${axis}» en «Un eje en los cinco pares» y compara los sitios de esta lección con los otros pares.`,
  }),
  quizKey: (number, question, answer) => `Clave de la pregunta ${number} («${question}»): ${answer}.`,
  printable: {
    title: 'Tabla de datos para imprimir',
    description: (axis, units) => `Valores del backend para el eje «${axis}» (${units}), para trabajar sin internet.`,
    row: (pair, earth, moon, similarity) => `${pair}: Tierra ${earth}, Luna ${moon}, similitud ${similarity}.`,
    rowMissing: (pair) => `${pair}: sin dato comparable en este eje.`,
    materials: ['Una copia de la tabla por equipo', 'Lápiz y regla'],
  },
  location: {
    description: (type, radius, note) => `${type}. Área de análisis: un círculo de ${radius} de radio. ${note}`,
    relation: (axis, earthValue) => `En el eje «${axis}», su valor es ${earthValue}.`,
    relationMissing: (axis) => `No tiene dato comparable en el eje «${axis}».`,
  },
};
