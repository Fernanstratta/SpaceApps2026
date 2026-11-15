import type { ByTopic, StudentModule, StudentSubmodule, SubmoduleKey } from '../types';
import { comparisonsBySubmodule } from './comparisons';
import { relatedLocationsBySubmodule } from './locations';
import { mapSubmodules } from './submodules';

/**
 * "Aprender" presentation of each topic: tagline and explanatory paragraph
 * shown on the topic page.
 *
 * INITIAL DATA STATE: `null` until verified static content is provided;
 * nothing is generated or estimated.
 */
export const studentModules: ByTopic<StudentModule> = {
  'size-scale': { topicId: 'size-scale', tagline: null, overview: null },
  gravity: { topicId: 'gravity', tagline: null, overview: null },
  'surface-terrain': { topicId: 'surface-terrain', tagline: null, overview: null },
  'earth-moon-distance': { topicId: 'earth-moon-distance', tagline: null, overview: null },
  temperature: { topicId: 'temperature', tagline: null, overview: null },
  'impact-craters': { topicId: 'impact-craters', tagline: null, overview: null },
  atmosphere: { topicId: 'atmosphere', tagline: null, overview: null },
  'water-ice': { topicId: 'water-ice', tagline: null, overview: null },
};

type EditableStudentContent = Partial<Omit<StudentSubmodule, 'key' | 'comparisons' | 'relatedLocations'>>;

/**
 * "Aprender" content per submodule. Add verified content here, e.g.:
 *
 *   'gravity/saltar-en-la-luna': {
 *     introduction: '…',
 *     sourceIds: ['nasa-science-moon'],
 *   },
 *
 * `comparisons` and `relatedLocations` are not set here: they come from
 * `comparisons.ts` and `locations.ts` so each dataset lives in one place.
 */
const studentSubmoduleContent: Partial<Record<SubmoduleKey, EditableStudentContent>> = {};

function pendingStudentSubmodule(key: SubmoduleKey): StudentSubmodule {
  return {
    key,
    introduction: null,
    blocks: null,
    scientificConcepts: null,
    earthInformation: null,
    moonInformation: null,
    comparisons: null,
    relatedLocations: null,
    additionalFacts: null,
    learningActivities: null,
    conclusion: null,
    sourceIds: null,
  };
}

export const studentSubmodules: Record<SubmoduleKey, StudentSubmodule> = mapSubmodules((key) => ({
  ...pendingStudentSubmodule(key),
  ...studentSubmoduleContent[key],
  comparisons: comparisonsBySubmodule[key] ?? null,
  relatedLocations: relatedLocationsBySubmodule[key] ?? null,
}));
