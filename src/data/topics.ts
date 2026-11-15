import { playgroundEs } from '../i18n/playground.es';
import type { Topic, TopicId } from '../types';
import { TOPIC_IDS } from '../types';
import { ILS_AXES } from './lunarAnalogs';

/**
 * Shared topics for the Portal Educativo: the nine Earth–Moon comparative
 * axes. Both student and teacher modules reference these ids, and Starman
 * Playground uses them as filters.
 *
 * - `name` is the axis name, read from the Playground texts so the portal and
 *   the filters can never drift apart.
 * - `order` is the axis number in the team's ILS document (1–9).
 * - Descriptions describe the topic only; they contain no measurements.
 */
const DESCRIPTIONS: Record<TopicId, string> = {
  slope: 'Qué tan plano es un terreno y por qué eso decide dónde puede aterrizar una nave o circular un vehículo.',
  roughness: 'Qué tan lisa o rocosa es una superficie y cómo el radar permite verlo desde el espacio.',
  mineralogy: 'De qué están hechas las rocas de la Tierra y de la Luna, y cómo se reconoce su composición desde el espacio.',
  albedo: 'Cuánta luz solar refleja una superficie y qué revela eso sobre su composición y su temperatura.',
  thermal: 'Cuánto cambia la temperatura entre el día y la noche, y por qué la falta de atmósfera hace extrema a la Luna.',
  aridity: 'Qué tan seco y libre de vegetación es un lugar, y por qué los desiertos son buenos análogos de un mundo sin vida.',
  volatiles: 'Dónde puede haber agua o hielo bajo la superficie, y por qué el hielo lunar es clave para una base permanente.',
  dust: 'Qué tan fino es el suelo y por qué el polvo lunar es un reto para los astronautas y sus equipos.',
  craters: 'Cómo se forman los cráteres y las cavidades, y qué revela su forma sobre su origen y su erosión.',
};

export const topics: Topic[] = ILS_AXES.map((axis) => ({
  id: axis.id,
  name: playgroundEs.axes[axis.id].name,
  description: DESCRIPTIONS[axis.id],
  order: axis.number,
}));

const topicMap = new Map<TopicId, Topic>(topics.map((topic) => [topic.id, topic]));

export function getTopicById(id: TopicId): Topic {
  const topic = topicMap.get(id);
  if (!topic) {
    throw new Error(`Topic not found: ${id}`);
  }
  return topic;
}

export function isTopicId(value: string | undefined | null): value is TopicId {
  return typeof value === 'string' && (TOPIC_IDS as readonly string[]).includes(value);
}

export function getSortedTopics(): Topic[] {
  return [...topics].sort((a, b) => a.order - b.order);
}
