import type { AxisId } from './Axis';
import type { Measurement } from './Comparison';
import type { RelatedLocation } from './Location';
import type { EducationLevel, SubmoduleKey } from './Submodule';
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
 * Contextual visual of a lesson block. Each kind is a diagram or an
 * interactive figure of `components/lesson`; the data-driven ones read the
 * backend catalog for the submodule's pairs.
 */
export const LESSON_VISUAL_KINDS = [
  'slope-ramp',
  'slope-waffle',
  'radar-scatter',
  'felsic-mafic',
  'albedo-swatches',
  'thermal-bars',
  'ndvi-bands',
  'ice-section',
  'grain-sizes',
  'crater-profile',
  'terrain-3d',
] as const;
export type LessonVisualKind = (typeof LESSON_VISUAL_KINDS)[number];

/**
 * A "Tema" block inside a submodule: a titled passage, optionally with a photo
 * from `src/data/images.ts` or a contextual visual. `body` may hold several
 * paragraphs separated by a blank line.
 */
export interface SubmoduleTopicBlock {
  id: string;
  title: string;
  body: string;
  imageId: string | null;
  visual: LessonVisualKind | null;
  /** Catalog pair (`PairId`) the visual shows; `null` = the pairs of the lesson. */
  visualPairId: string | null;
}

/** How much of the backend data a lesson shows, by educational level. */
export type ComparisonDetail = 'simple' | 'guided' | 'full';

/**
 * The Earth–Moon comparison of a submodule: one axis of the backend catalog
 * for some of its pairs. Values, statuses and similarities are read from the
 * catalog at render time; nothing is copied here.
 */
export interface SubmoduleComparison {
  axisId: AxisId;
  /** Ids of the catalog pairs (`PairId`) the lesson works with. */
  pairIds: string[];
  detail: ComparisonDetail;
  /** What to look at in the data, in the student's words. */
  lead: string;
}

/** One multiple-choice question of the "Comprueba lo que aprendiste" section. */
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  /** Shown after answering, right or wrong. */
  explanation: string;
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
  level: EducationLevel;
  introduction: string | null;
  blocks: SubmoduleTopicBlock[] | null;
  scientificConcepts: ScientificConcept[] | null;
  earthInformation: CelestialBodyInformation | null;
  moonInformation: CelestialBodyInformation | null;
  /** Real backend data for the lesson's axis and pairs. */
  comparison: SubmoduleComparison | null;
  relatedLocations: RelatedLocation[] | null;
  additionalFacts: string[] | null;
  learningActivities: LearningActivity[] | null;
  knowledgeCheck: QuizQuestion[] | null;
  conclusion: string | null;
  /** Resource ids (see `data/resources.ts`) cited by this submodule. */
  sourceIds: string[] | null;
}
