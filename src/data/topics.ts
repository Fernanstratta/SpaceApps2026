import type { Topic, TopicId } from '../types';
import { TOPIC_IDS } from '../types';

/**
 * Shared topics for the Portal Educativo. Both student and teacher modules
 * reference these ids. Descriptions describe the topic only; they contain no
 * measurements or comparisons.
 */
export const topics: Topic[] = [
  {
    id: 'size-scale',
    name: 'Tamaño y escala',
    description: 'Cómo se relacionan el tamaño de la Tierra y el de la Luna, y cómo representarlos a escala.',
    order: 1,
  },
  {
    id: 'gravity',
    name: 'Gravedad',
    description: 'Qué es la gravedad y cómo influye en los objetos y en las personas en cada cuerpo celeste.',
    order: 2,
  },
  {
    id: 'surface-terrain',
    name: 'Superficie y terreno',
    description: 'Las formas del relieve de la Tierra y de la Luna: montañas, llanuras, valles y mares lunares.',
    order: 3,
  },
  {
    id: 'earth-moon-distance',
    name: 'Distancia entre la Tierra y la Luna',
    description: 'Cuánto nos separa de la Luna y cómo se puede imaginar esa distancia.',
    order: 4,
  },
  {
    id: 'temperature',
    name: 'Temperatura',
    description: 'Por qué la temperatura cambia de forma distinta en la Tierra y en la Luna.',
    order: 5,
  },
  {
    id: 'impact-craters',
    name: 'Cráteres de impacto',
    description: 'Cómo se forman los cráteres y por qué se conservan de manera diferente en cada cuerpo.',
    order: 6,
  },
  {
    id: 'atmosphere',
    name: 'Atmósfera',
    description: 'Qué es una atmósfera y qué diferencias existen entre la de la Tierra y el entorno lunar.',
    order: 7,
  },
  {
    id: 'water-ice',
    name: 'Agua y hielo',
    description: 'Dónde se encuentra el agua en la Tierra y qué se sabe sobre el hielo en la Luna.',
    order: 8,
  },
];

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
