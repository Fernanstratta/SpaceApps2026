import type { StudentModule, TeacherModule, TopicId } from '../types';
import { studentModules } from './studentModules';
import { teacherModules } from './teacherModules';

export * from './topics';
export * from './resources';
export * from './comparisons';
export * from './locations';
export * from './images';
export * from './submodules';
export { studentModules } from './studentModules';
export { teacherModules } from './teacherModules';

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
