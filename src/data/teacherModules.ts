import type { ByTopic, SubmoduleKey, TeacherModule, TeacherSubmodule } from '../types';
import { getCurriculum } from './curriculum';

/**
 * "Enseñar" content (lesson plans): presentation of each axis and the teaching
 * guide of each submodule. Built in `curriculum.ts` from the same source as
 * the student view. Fields the team has not defined yet (grade level,
 * durations, materials, places, field trips, classroom alternatives) stay
 * `null`. Spanish (source) versions; `localized.ts` serves the active language.
 */
const spanish = getCurriculum('es');

export const teacherModules: ByTopic<TeacherModule> = spanish.teacherModules;

export const teacherSubmodules: Record<SubmoduleKey, TeacherSubmodule> = spanish.teacherSubmodules;
