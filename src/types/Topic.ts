import { AXIS_IDS, type AxisId } from './Axis';

/**
 * Shared topic identifiers. Each topic of the Portal Educativo is one of the
 * nine Earth–Moon comparative axes, so topic ids ARE axis ids. Student and
 * teacher modules MUST reference these identifiers so both experiences stay
 * synchronized, and Playground filters use the same ids.
 */
export const TOPIC_IDS = AXIS_IDS;

export type TopicId = AxisId;

export interface Topic {
  /** Unique, stable identifier shared across student and teacher modules (= axis id). */
  id: TopicId;
  /** User-facing topic name (Spanish) — the axis name. */
  name: string;
  /** Short user-facing description (Spanish). `null` when not yet provided. */
  description: string | null;
  /** Display order inside the portal (= axis number, 1–9). */
  order: number;
}

/** Helper type: one entry per topic, enforced at compile time. */
export type ByTopic<T> = Record<TopicId, T>;
