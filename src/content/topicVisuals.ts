import type { CSSProperties } from 'react';
import type { ByTopic, TopicId } from '../types';

/**
 * Visual identity of each topic (comparative axis): a distinctive color and
 * the cover photo used on its banner. `strong` is a darker shade for text on
 * white (WCAG AA) and `soft` a light tint for backgrounds. Change colors here only.
 */
export interface TopicVisual {
  color: string;
  strong: string;
  soft: string;
  coverImageId: string;
}

export const TOPIC_VISUALS: ByTopic<TopicVisual> = {
  slope: { color: '#16a34a', strong: '#166534', soft: '#dcfce7', coverImageId: 'aldrin' },
  roughness: { color: '#d97706', strong: '#92400e', soft: '#fef3c7', coverImageId: 'young-jump' },
  mineralogy: { color: '#9333ea', strong: '#6b21a8', soft: '#f5ecff', coverImageId: 'genesis-rock' },
  albedo: { color: '#4f46e5', strong: '#3730a3', soft: '#eef2ff', coverImageId: 'blue-marble' },
  thermal: { color: '#dc2626', strong: '#991b1b', soft: '#fee2e2', coverImageId: 'diviner-south-pole' },
  aridity: { color: '#ca8a04', strong: '#854d0e', soft: '#fef9c3', coverImageId: 'earthrise' },
  ice: { color: '#0d9488', strong: '#115e59', soft: '#ccfbf1', coverImageId: 'greenland-iceberg' },
  dust: { color: '#64748b', strong: '#334155', soft: '#f1f5f9', coverImageId: 'bootprint' },
  craters: { color: '#db2777', strong: '#9d174d', soft: '#fce7f3', coverImageId: 'barringer' },
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
