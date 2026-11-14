import type { ByTopic, StudentModule } from '../types';
import { comparisonsByTopic } from './comparisons';
import { relatedLocationsByTopic } from './locations';

/**
 * Student modules, one per shared topic.
 *
 * INITIAL DATA STATE
 * - earthInformation, moonInformation, comparisons and relatedLocations are
 *   `null` as required.
 * - Remaining educational fields are also `null` until verified static
 *   content is provided; nothing is generated or estimated.
 *
 * `comparisons` and `relatedLocations` are sourced from their own modules so
 * future datasets can be integrated in one place.
 */
export const studentModules: ByTopic<StudentModule> = {
  'size-scale': {
    topicId: 'size-scale',
    introduction: null,
    scientificConcepts: null,
    earthInformation: null,
    moonInformation: null,
    comparisons: comparisonsByTopic['size-scale'],
    relatedLocations: relatedLocationsByTopic['size-scale'],
    additionalFacts: null,
    learningActivities: null,
  },
  gravity: {
    topicId: 'gravity',
    introduction: null,
    scientificConcepts: null,
    earthInformation: null,
    moonInformation: null,
    comparisons: comparisonsByTopic.gravity,
    relatedLocations: relatedLocationsByTopic.gravity,
    additionalFacts: null,
    learningActivities: null,
  },
  'surface-terrain': {
    topicId: 'surface-terrain',
    introduction: null,
    scientificConcepts: null,
    earthInformation: null,
    moonInformation: null,
    comparisons: comparisonsByTopic['surface-terrain'],
    relatedLocations: relatedLocationsByTopic['surface-terrain'],
    additionalFacts: null,
    learningActivities: null,
  },
  'earth-moon-distance': {
    topicId: 'earth-moon-distance',
    introduction: null,
    scientificConcepts: null,
    earthInformation: null,
    moonInformation: null,
    comparisons: comparisonsByTopic['earth-moon-distance'],
    relatedLocations: relatedLocationsByTopic['earth-moon-distance'],
    additionalFacts: null,
    learningActivities: null,
  },
  temperature: {
    topicId: 'temperature',
    introduction: null,
    scientificConcepts: null,
    earthInformation: null,
    moonInformation: null,
    comparisons: comparisonsByTopic.temperature,
    relatedLocations: relatedLocationsByTopic.temperature,
    additionalFacts: null,
    learningActivities: null,
  },
  'impact-craters': {
    topicId: 'impact-craters',
    introduction: null,
    scientificConcepts: null,
    earthInformation: null,
    moonInformation: null,
    comparisons: comparisonsByTopic['impact-craters'],
    relatedLocations: relatedLocationsByTopic['impact-craters'],
    additionalFacts: null,
    learningActivities: null,
  },
  atmosphere: {
    topicId: 'atmosphere',
    introduction: null,
    scientificConcepts: null,
    earthInformation: null,
    moonInformation: null,
    comparisons: comparisonsByTopic.atmosphere,
    relatedLocations: relatedLocationsByTopic.atmosphere,
    additionalFacts: null,
    learningActivities: null,
  },
  'water-ice': {
    topicId: 'water-ice',
    introduction: null,
    scientificConcepts: null,
    earthInformation: null,
    moonInformation: null,
    comparisons: comparisonsByTopic['water-ice'],
    relatedLocations: relatedLocationsByTopic['water-ice'],
    additionalFacts: null,
    learningActivities: null,
  },
};
