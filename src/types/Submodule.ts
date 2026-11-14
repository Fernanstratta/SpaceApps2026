import type { TopicId } from './Topic';

/**
 * A submodule inside a topic (shown as a card in the topic's row of the
 * Portal Educativo). Titles are proposals pending review by the team; the
 * educational content (`summary`) stays `null` until it is provided.
 */
export interface Submodule {
  id: string;
  topicId: TopicId;
  title: string;
  /** Short subject label shown as a pill on the card, e.g. "Geología". */
  tag: string;
  /** Id of an image in `src/data/images.ts`. */
  imageId: string;
  order: number;
  summary: string | null;
}
