import type { ByTopic, Comparison } from '../types';

/**
 * Earth–Moon comparisons per topic.
 *
 * INITIAL DATA STATE: every entry is `null` (data not yet provided).
 * Future static datasets should replace `null` with an array of sourced
 * `Comparison` objects. Do NOT estimate or generate values here.
 */
export const comparisonsByTopic: ByTopic<Comparison[] | null> = {
  'size-scale': null,
  gravity: null,
  'surface-terrain': null,
  'earth-moon-distance': null,
  temperature: null,
  'impact-craters': null,
  atmosphere: null,
  'water-ice': null,
};
