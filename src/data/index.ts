import type { StudentModule, StudentSubmodule, SubmoduleKey, TeacherModule, TeacherSubmodule, TopicId } from '../types';
import { studentModules, studentSubmodules } from './studentModules';
import { teacherModules, teacherSubmodules } from './teacherModules';

export * from './topics';
export * from './resources';
export * from './comparisons';
export * from './locations';
export * from './images';
export * from './submodules';
export { studentModules, studentSubmodules } from './studentModules';
export { teacherModules, teacherSubmodules } from './teacherModules';

/**
 * Data-access functions used by pages. When static datasets are introduced
 * (JSON files, generated modules, etc.), only these functions need to change.
 */
export function getStudentModule(topicId: TopicId): StudentModule {
  return studentModules[topicId];
}

export function getTeacherModule(topicId: TopicId): TeacherModule {
  return teacherModules[topicId];
}

export function getStudentSubmodule(key: SubmoduleKey): StudentSubmodule | undefined {
  return studentSubmodules[key];
}

export function getTeacherSubmodule(key: SubmoduleKey): TeacherSubmodule | undefined {
  return teacherSubmodules[key];
}
