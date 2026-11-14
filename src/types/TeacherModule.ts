import type { FieldTrip, GeographicalRecommendation } from './Location';
import type { TopicId } from './Topic';

export interface ClassroomActivity {
  id: string;
  title: string;
  description: string;
  durationMinutes: number | null;
  materials: string[] | null;
}

export interface Demonstration {
  id: string;
  title: string;
  description: string;
  materials: string[] | null;
  safetyNotes: string | null;
}

export interface LessonPlan {
  introduction: string | null;
  suggestedExplanation: string | null;
  classroomActivities: ClassroomActivity[] | null;
  discussionQuestions: string[] | null;
  experimentsOrDemonstrations: Demonstration[] | null;
  assessmentMethods: string[] | null;
}

export type ClassroomAlternativeType =
  | 'physical-model'
  | 'experiment'
  | 'demonstration'
  | 'printable'
  | 'exercise';

export interface ClassroomAlternative {
  id: string;
  type: ClassroomAlternativeType;
  title: string;
  description: string;
  materials: string[] | null;
  /** Link to a printable or external resource, when available. */
  resourceUrl: string | null;
}

/**
 * Teacher-facing module. Name and description come from the shared `Topic`.
 * Same `null` vs `[]` convention as `StudentModule`.
 */
export interface TeacherModule {
  topicId: TopicId;
  gradeLevel: string | null;
  estimatedDuration: string | null;
  learningObjectives: string[] | null;
  requiredMaterials: string[] | null;
  lessonPlan: LessonPlan | null;
  activities: ClassroomActivity[] | null;
  geographicalRecommendations: GeographicalRecommendation[] | null;
  fieldTrips: FieldTrip[] | null;
  classroomAlternatives: ClassroomAlternative[] | null;
}
