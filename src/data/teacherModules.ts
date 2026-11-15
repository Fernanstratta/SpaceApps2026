import type { ByTopic, SubmoduleKey, TeacherModule, TeacherSubmodule, TopicId } from '../types';
import { fieldTripsBySubmodule, geographicalRecommendationsBySubmodule } from './locations';
import { mapSubmodules } from './submodules';

function pendingTeacherModule(topicId: TopicId): TeacherModule {
  return {
    topicId,
    tagline: null,
    overview: null,
    gradeLevel: null,
    estimatedDuration: null,
    learningObjectives: null,
    requiredMaterials: null,
  };
}

/**
 * "Enseñar" presentation and general information of each topic.
 *
 * INITIAL DATA STATE: every teacher-specific field is `null`.
 * Do NOT generate lesson plans, activities or recommendations here.
 */
export const teacherModules: ByTopic<TeacherModule> = {
  'size-scale': pendingTeacherModule('size-scale'),
  gravity: pendingTeacherModule('gravity'),
  'surface-terrain': pendingTeacherModule('surface-terrain'),
  'earth-moon-distance': pendingTeacherModule('earth-moon-distance'),
  temperature: pendingTeacherModule('temperature'),
  'impact-craters': pendingTeacherModule('impact-craters'),
  atmosphere: pendingTeacherModule('atmosphere'),
  'water-ice': pendingTeacherModule('water-ice'),
};

type EditableTeacherContent = Partial<
  Omit<TeacherSubmodule, 'key' | 'geographicalRecommendations' | 'fieldTrips'>
>;

/**
 * Teaching guide per submodule. Add verified content here, keyed by
 * submodule (e.g. `'gravity/saltar-en-la-luna': { estimatedDuration: '50 min' }`).
 * Geographical recommendations and field trips come from `locations.ts`.
 */
const teacherSubmoduleContent: Partial<Record<SubmoduleKey, EditableTeacherContent>> = {};

function pendingTeacherSubmodule(key: SubmoduleKey): TeacherSubmodule {
  return {
    key,
    estimatedDuration: null,
    learningObjectives: null,
    requiredMaterials: null,
    lessonPlan: null,
    activities: null,
    geographicalRecommendations: null,
    fieldTrips: null,
    classroomAlternatives: null,
    sourceIds: null,
  };
}

export const teacherSubmodules: Record<SubmoduleKey, TeacherSubmodule> = mapSubmodules((key) => ({
  ...pendingTeacherSubmodule(key),
  ...teacherSubmoduleContent[key],
  geographicalRecommendations: geographicalRecommendationsBySubmodule[key] ?? null,
  fieldTrips: fieldTripsBySubmodule[key] ?? null,
}));
