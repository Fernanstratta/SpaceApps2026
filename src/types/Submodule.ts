import type { TopicId } from './Topic';

/**
 * Learning progression inside every axis (same three steps in both views):
 *  1. `concept`     — what the axis describes and why it matters on the Moon.
 *  2. `measurement` — how it is measured on the Earth and on the Moon.
 *  3. `analogs`     — the axis applied to real Baja California / Sonora ↔ Moon pairs.
 */
export const SUBMODULE_STAGES = ['concept', 'measurement', 'analogs'] as const;
export type SubmoduleStage = (typeof SUBMODULE_STAGES)[number];

/**
 * Educational level of a submodule, assigned from its actual conceptual
 * difficulty (not from its stage). It decides how much content the lesson has
 * and how complex its language is.
 */
export const EDUCATION_LEVELS = ['primaria', 'secundaria', 'preparatoria'] as const;
export type EducationLevel = (typeof EDUCATION_LEVELS)[number];

/**
 * A submodule inside a topic (shown as a card in the topic's row of the
 * Portal Educativo and in the topic page).
 */
export interface Submodule {
  id: string;
  topicId: TopicId;
  /** Step of the axis' learning progression. */
  stage: SubmoduleStage;
  /** Educational level the lesson is written for. */
  level: EducationLevel;
  title: string;
  /** Short subject label shown as a pill on the card, e.g. "Geología". */
  tag: string;
  /** Id of an image in `src/data/images.ts`. */
  imageId: string;
  order: number;
  /** One-line summary of the lesson; `null` until localized (see `data/localized.ts`). */
  summary: string | null;
}

/** Globally unique submodule key: `topicId/submoduleId`. */
export type SubmoduleKey = `${TopicId}/${string}`;
