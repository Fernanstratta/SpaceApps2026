/**
 * Verifies the initial data state required for this phase:
 *  - Student and teacher modules exist for every shared topic id.
 *  - Comparison and geographic fields are `null`.
 *  - All teacher-specific content fields are `null`.
 *  - Every resource has the required fields and an http(s) source URL.
 *  - Every topic has submodules; each submodule points to a real topic and
 *    image, has a unique id and no generated content (`summary` is null).
 *  - Every image has alt text, an author and an allowed license.
 *
 * Run with: npm run verify:data
 */
import {
  comparisonsByTopic,
  images,
  submodules,
  fieldTripsByTopic,
  geographicalRecommendationsByTopic,
  locationCatalog,
  relatedLocationsByTopic,
  resourceCategories,
  resources,
  studentModules,
  teacherModules,
  topics,
} from '../src/data';
import { TOPIC_IDS } from '../src/types';

const errors: string[] = [];
const check = (condition: boolean, message: string) => {
  if (!condition) errors.push(message);
};

// Topics
check(topics.length === TOPIC_IDS.length, `Expected ${TOPIC_IDS.length} topics, found ${topics.length}`);
for (const id of TOPIC_IDS) {
  check(topics.some((topic) => topic.id === id), `Missing topic: ${id}`);
}

// Student modules
const studentNullFields = ['earthInformation', 'moonInformation', 'comparisons', 'relatedLocations'] as const;
for (const id of TOPIC_IDS) {
  const module = studentModules[id];
  check(!!module, `Missing student module: ${id}`);
  if (!module) continue;
  check(module.topicId === id, `Student module topicId mismatch: ${id}`);
  for (const field of studentNullFields) {
    check(module[field] === null, `studentModules.${id}.${field} must be null`);
  }
}

// Teacher modules
const teacherNullFields = [
  'gradeLevel',
  'estimatedDuration',
  'learningObjectives',
  'requiredMaterials',
  'lessonPlan',
  'activities',
  'geographicalRecommendations',
  'fieldTrips',
  'classroomAlternatives',
] as const;
for (const id of TOPIC_IDS) {
  const module = teacherModules[id];
  check(!!module, `Missing teacher module: ${id}`);
  if (!module) continue;
  check(module.topicId === id, `Teacher module topicId mismatch: ${id}`);
  for (const field of teacherNullFields) {
    check(module[field] === null, `teacherModules.${id}.${field} must be null`);
  }
}

// Comparison & location sources
check(locationCatalog === null, 'locationCatalog must be null');
for (const id of TOPIC_IDS) {
  check(comparisonsByTopic[id] === null, `comparisonsByTopic.${id} must be null`);
  check(relatedLocationsByTopic[id] === null, `relatedLocationsByTopic.${id} must be null`);
  check(geographicalRecommendationsByTopic[id] === null, `geographicalRecommendationsByTopic.${id} must be null`);
  check(fieldTripsByTopic[id] === null, `fieldTripsByTopic.${id} must be null`);
}

// Resources
const resourceIds = new Set<string>();
for (const resource of resources) {
  check(!resourceIds.has(resource.id), `Duplicate resource id: ${resource.id}`);
  resourceIds.add(resource.id);
  check(resourceCategories.some((c) => c.id === resource.categoryId), `Unknown category in ${resource.id}`);
  for (const field of ['name', 'organization', 'description', 'informationType'] as const) {
    check(resource[field].trim().length > 0, `Resource ${resource.id} is missing ${field}`);
  }
  check(/^https?:\/\//.test(resource.sourceUrl), `Resource ${resource.id} has an invalid sourceUrl`);
}

// Images
const imageIds = new Set<string>();
const COMMONS_PATH = /^[0-9a-f]\/[0-9a-f]{2}$/;
for (const image of images) {
  check(!imageIds.has(image.id), `Duplicate image id: ${image.id}`);
  imageIds.add(image.id);
  check(COMMONS_PATH.test(image.commonsPath), `Image ${image.id} has an invalid commonsPath`);
  check(!/\s/.test(image.file), `Image ${image.id} file name must use underscores`);
  for (const field of ['alt', 'author'] as const) {
    check(image[field].trim().length > 0, `Image ${image.id} is missing ${field}`);
  }
  check(['Dominio público', 'CC0 1.0'].includes(image.license), `Image ${image.id} has an unexpected license`);
}

// Submodules
const submoduleKeys = new Set<string>();
for (const item of submodules) {
  const key = `${item.topicId}/${item.id}`;
  check(!submoduleKeys.has(key), `Duplicate submodule: ${key}`);
  submoduleKeys.add(key);
  check((TOPIC_IDS as readonly string[]).includes(item.topicId), `Submodule ${item.id} has unknown topic`);
  check(imageIds.has(item.imageId), `Submodule ${item.id} references missing image ${item.imageId}`);
  check(/^[a-z0-9-]+$/.test(item.id), `Submodule id must be a URL slug: ${item.id}`);
  check(item.summary === null, `submodules.${item.id}.summary must be null`);
}
for (const id of TOPIC_IDS) {
  check(submodules.some((item) => item.topicId === id), `Topic ${id} has no submodules`);
}

if (errors.length > 0) {
  console.error(`✗ Data verification failed (${errors.length}):`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(
  `✓ Data verified: ${topics.length} topics, ${TOPIC_IDS.length} student + ${TOPIC_IDS.length} teacher modules, ` +
    `${resources.length} resources in ${resourceCategories.length} categories, ${submodules.length} submodules, ` +
    `${images.length} images. All comparison, geographic and submodule content fields are null.`,
);
