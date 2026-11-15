import type { Comparison, Measurement } from './Comparison';
import type { RelatedLocation } from './Location';
import type { SubmoduleKey } from './Submodule';
import type { TopicId } from './Topic';

export interface ScientificConcept {
  id: string;
  term: string;
  definition: string;
}

/** Information about a single celestial body (Earth or Moon) for a submodule. */
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
 * A "Tema" block inside a submodule: a titled passage, optionally with a photo
 * from `src/data/images.ts`. `body` may hold several paragraphs separated by a
 * blank line.
 */
export interface SubmoduleTopicBlock {
  id: string;
  title: string;
  body: string;
  imageId: string | null;
}

/**
 * "Aprender" (student) presentation of a topic: tagline and explanatory
 * paragraph shown on the topic page. Name, description and photo live in the
 * shared `Topic` / `TOPIC_VISUALS`, so they are never duplicated.
 *
 * Convention for every nullable field:
 *   - `null`  → data not yet provided (show "pending" state).
 *   - `[]`    → data provided, but there are no entries (show "empty" state).
 */
export interface StudentModule {
  topicId: TopicId;
  /** Short catchy phrase shown above the explanatory paragraph. */
  tagline: string | null;
  /** Explanatory paragraph(s) about the whole topic. */
  overview: string | null;
}

/** "Aprender" content of one submodule. Same `null` vs `[]` convention. */
export interface StudentSubmodule {
  key: SubmoduleKey;
  introduction: string | null;
  blocks: SubmoduleTopicBlock[] | null;
  scientificConcepts: ScientificConcept[] | null;
  earthInformation: CelestialBodyInformation | null;
  moonInformation: CelestialBodyInformation | null;
  comparisons: Comparison[] | null;
  relatedLocations: RelatedLocation[] | null;
  additionalFacts: string[] | null;
  learningActivities: LearningActivity[] | null;
  conclusion: string | null;
  /** Resource ids (see `data/resources.ts`) cited by this submodule. */
  sourceIds: string[] | null;
}
