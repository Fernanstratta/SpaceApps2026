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
 * A submodule inside a topic (shown as a card in the topic's row of the
 * Portal Educativo and in the topic page). `summary` stays `null` until the
 * team writes one.
 */
export interface Submodule {
  id: string;
  topicId: TopicId;
  /** Step of the axis' learning progression. */
  stage: SubmoduleStage;
  title: string;
  /** Short subject label shown as a pill on the card, e.g. "Geología". */
  tag: string;
  /** Id of an image in `src/data/images.ts`. */
  imageId: string;
  order: number;
  summary: string | null;
}

/** Globally unique submodule key: `topicId/submoduleId`. */
export type SubmoduleKey = `${TopicId}/${string}`;
