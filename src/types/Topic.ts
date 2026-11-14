/**
 * Shared topic identifiers. Student and teacher modules MUST reference these
 * identifiers so both experiences stay synchronized.
 */
export const TOPIC_IDS = [
  'size-scale',
  'gravity',
  'surface-terrain',
  'earth-moon-distance',
  'temperature',
  'impact-craters',
  'atmosphere',
  'water-ice',
] as const;

export type TopicId = (typeof TOPIC_IDS)[number];

export interface Topic {
  /** Unique, stable identifier shared across student and teacher modules. */
  id: TopicId;
  /** User-facing topic name (Spanish). */
  name: string;
  /** Short user-facing description (Spanish). `null` when not yet provided. */
  description: string | null;
  /** Display order inside the portal. */
  order: number;
}

/** Helper type: one entry per topic, enforced at compile time. */
export type ByTopic<T> = Record<TopicId, T>;
