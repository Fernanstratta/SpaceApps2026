import { curriculumEs } from './es';
import type { CurriculumShared, CurriculumText } from './types';

/**
 * English curriculum. For now the lessons themselves fall back to the Spanish
 * text (the team decided to write Spanish first); only the shared pieces that
 * the builder composes with data are translated, so the English interface
 * stays consistent. To translate a lesson, replace its entry in `axes`.
 */
const sharedEn: CurriculumShared = {
  levels: { primaria: 'Elementary', secundaria: 'Middle school', preparatoria: 'High school' },
  levelRange: (first, last) => `${first} to ${last}`,
  sessionDuration: (minutes) => `${minutes} minutes (one session)`,
  moduleDuration: (sessions, minutes) => `${sessions} sessions, ${minutes} minutes in total`,
  playground: (axis) => ({
    title: 'Explore in Terranauta Playground',
    description: `Open Terranauta Playground, choose the “${axis}” axis in “One axis across the five pairs” and compare this lesson’s sites with the other pairs.`,
  }),
  quizKey: (number, question, answer) => `Answer key, question ${number} (“${question}”): ${answer}.`,
  printable: {
    title: 'Printable data table',
    description: (axis, units) => `Backend values for the “${axis}” axis (${units}), to work offline.`,
    row: (pair, earth, moon, similarity) => `${pair}: Earth ${earth}, Moon ${moon}, similarity ${similarity}.`,
    rowMissing: (pair) => `${pair}: no comparable data on this axis.`,
    materials: ['One copy of the table per team', 'Pencil and ruler'],
  },
  location: {
    description: (type, radius, note) => `${type}. Analysis area: a circle with a ${radius} radius. ${note}`,
    relation: (axis, earthValue) => `On the “${axis}” axis, its value is ${earthValue}.`,
    relationMissing: (axis) => `It has no comparable data on the “${axis}” axis.`,
  },
};

export const curriculumEn: CurriculumText = { axes: curriculumEs.axes, shared: sharedEn };
