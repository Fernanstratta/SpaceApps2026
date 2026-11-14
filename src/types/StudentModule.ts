import type { Comparison, Measurement } from './Comparison';
import type { RelatedLocation } from './Location';
import type { TopicId } from './Topic';

export interface ScientificConcept {
  id: string;
  term: string;
  definition: string;
}

/** Information about a single celestial body (Earth or Moon) for a topic. */
export interface CelestialBodyInformation {
  summary: string | null;
  measurements: Measurement[] | null;
  sourceIds: string[] | null;
}

export type LearningActivityType =
  | 'observation'
  | 'calculation'
  | 'model'
  | 'reflection'
  | 'exploration';

export interface LearningActivity {
  id: string;
  title: string;
  description: string;
  type: LearningActivityType;
  estimatedMinutes: number | null;
}

/**
 * Student-facing module. Name and description live in the shared `Topic`
 * (looked up through `topicId`), so they are never duplicated.
 *
 * Convention for every nullable field:
 *   - `null`  → data not yet provided (show "pending" state).
 *   - `[]`    → data provided, but there are no entries (show "empty" state).
 */
export interface StudentModule {
  topicId: TopicId;
  introduction: string | null;
  scientificConcepts: ScientificConcept[] | null;
  earthInformation: CelestialBodyInformation | null;
  moonInformation: CelestialBodyInformation | null;
  comparisons: Comparison[] | null;
  relatedLocations: RelatedLocation[] | null;
  additionalFacts: string[] | null;
  learningActivities: LearningActivity[] | null;
}
