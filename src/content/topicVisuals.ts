import type { CSSProperties } from 'react';
import type { ByTopic, TopicId } from '../types';

/**
 * Visual identity of each topic: a distinctive color and the cover photo used
 * on its banner. `strong` is a darker shade for text on white (WCAG AA) and
 * `soft` a light tint for backgrounds. Change colors here only.
 */
export interface TopicVisual {
  color: string;
  strong: string;
  soft: string;
  coverImageId: string;
}

export const TOPIC_VISUALS: ByTopic<TopicVisual> = {
  'size-scale': { color: '#4f46e5', strong: '#3730a3', soft: '#eef2ff', coverImageId: 'blue-marble' },
  gravity: { color: '#9333ea', strong: '#6b21a8', soft: '#f5ecff', coverImageId: 'young-jump' },
  'surface-terrain': { color: '#d97706', strong: '#92400e', soft: '#fef3c7', coverImageId: 'genesis-rock' },
  'earth-moon-distance': { color: '#16a34a', strong: '#166534', soft: '#dcfce7', coverImageId: 'earthrise' },
  temperature: { color: '#dc2626', strong: '#991b1b', soft: '#fee2e2', coverImageId: 'diviner-south-pole' },
  'impact-craters': { color: '#db2777', strong: '#9d174d', soft: '#fce7f3', coverImageId: 'barringer' },
  atmosphere: { color: '#0ea5e9', strong: '#0369a1', soft: '#e0f2fe', coverImageId: 'top-of-atmosphere' },
  'water-ice': { color: '#0d9488', strong: '#115e59', soft: '#ccfbf1', coverImageId: 'greenland-iceberg' },
};

/** Inline CSS custom properties so any element can use the topic's palette. */
export function topicStyle(topicId: TopicId): CSSProperties {
  const visual = TOPIC_VISUALS[topicId];
  return {
    '--topic': visual.color,
    '--topic-strong': visual.strong,
    '--topic-soft': visual.soft,
  } as CSSProperties;
}
