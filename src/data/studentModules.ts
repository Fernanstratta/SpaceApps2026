import type { ByTopic, StudentModule, StudentSubmodule, SubmoduleKey } from '../types';
import { getCurriculum } from './curriculum';

/**
 * "Aprender" content: presentation of each axis and its submodules. Built in
 * `curriculum.ts` from the same source as the teacher view, so both stay in
 * sync. These are the Spanish (source) versions; `localized.ts` serves the
 * active language.
 */
const spanish = getCurriculum('es');

export const studentModules: ByTopic<StudentModule> = spanish.studentModules;

export const studentSubmodules: Record<SubmoduleKey, StudentSubmodule> = spanish.studentSubmodules;
