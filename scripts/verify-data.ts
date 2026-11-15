/**
 * Verifies the initial data state required for this phase:
 *  - Student ("Aprender") and teacher ("Enseñar") modules exist for every
 *    shared topic id, and every submodule has content for both views.
 *  - Comparison and geographic fields are `null`.
 *  - All teacher-specific content fields are `null`.
 *  - Every `sourceIds` / `imageId` used by submodule content points to a known
 *    resource / image.
 *  - Every resource has the required fields and an http(s) source URL.
 *  - Every topic has submodules; each submodule points to a real topic and
 *    image, has a unique id and no generated content (`summary` is null).
 *  - Every image has alt text, an author and an allowed license.
 *
 * Run with: npm run verify:data
 */
import {
  comparisonsBySubmodule,
  fieldTripsBySubmodule,
  geographicalRecommendationsBySubmodule,
  images,
  locationCatalog,
  relatedLocationsBySubmodule,
  resourceCategories,
  resources,
  studentModules,
  studentSubmodules,
  SUBMODULE_KEYS,
  submodules,
  teacherModules,
  teacherSubmodules,
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

// Topic-level modules ("Aprender" / "Enseñar")
const teacherModuleNullFields = ['gradeLevel', 'estimatedDuration', 'learningObjectives', 'requiredMaterials'] as const;
for (const id of TOPIC_IDS) {
  const student = studentModules[id];
  check(!!student, `Missing student module: ${id}`);
  if (student) check(student.topicId === id, `Student module topicId mismatch: ${id}`);

  const teacher = teacherModules[id];
  check(!!teacher, `Missing teacher module: ${id}`);
  if (!teacher) continue;
  check(teacher.topicId === id, `Teacher module topicId mismatch: ${id}`);
  for (const field of teacherModuleNullFields) {
    check(teacher[field] === null, `teacherModules.${id}.${field} must be null`);
  }
}

// Submodule content for both views
const knownResourceIds = new Set(resources.map((resource) => resource.id));
const knownImageIds = new Set(images.map((image) => image.id));
const studentNullFields = ['earthInformation', 'moonInformation', 'comparisons', 'relatedLocations'] as const;
const teacherNullFields = [
  'estimatedDuration',
  'learningObjectives',
  'requiredMaterials',
  'lessonPlan',
  'activities',
  'geographicalRecommendations',
  'fieldTrips',
  'classroomAlternatives',
] as const;
for (const key of SUBMODULE_KEYS) {
  const student = studentSubmodules[key];
  check(!!student && student.key === key, `Missing or mismatched student content: ${key}`);
  if (student) {
    for (const field of studentNullFields) {
      check(student[field] === null, `studentSubmodules['${key}'].${field} must be null`);
    }
    for (const sourceId of student.sourceIds ?? []) {
      check(knownResourceIds.has(sourceId), `studentSubmodules['${key}'] cites unknown resource ${sourceId}`);
    }
    for (const block of student.blocks ?? []) {
      if (block.imageId) check(knownImageIds.has(block.imageId), `studentSubmodules['${key}'] uses unknown image ${block.imageId}`);
    }
  }

  const teacher = teacherSubmodules[key];
  check(!!teacher && teacher.key === key, `Missing or mismatched teacher content: ${key}`);
  if (teacher) {
    for (const field of teacherNullFields) {
      check(teacher[field] === null, `teacherSubmodules['${key}'].${field} must be null`);
    }
    for (const sourceId of teacher.sourceIds ?? []) {
      check(knownResourceIds.has(sourceId), `teacherSubmodules['${key}'] cites unknown resource ${sourceId}`);
    }
  }
}

// Comparison & location sources
check(locationCatalog === null, 'locationCatalog must be null');
for (const key of SUBMODULE_KEYS) {
  check(comparisonsBySubmodule[key] === null, `comparisonsBySubmodule['${key}'] must be null`);
  check(relatedLocationsBySubmodule[key] === null, `relatedLocationsBySubmodule['${key}'] must be null`);
  check(
    geographicalRecommendationsBySubmodule[key] === null,
    `geographicalRecommendationsBySubmodule['${key}'] must be null`,
  );
  check(fieldTripsBySubmodule[key] === null, `fieldTripsBySubmodule['${key}'] must be null`);
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
  `✓ Data verified: ${topics.length} topics (Aprender + Enseñar), ${submodules.length} submodules with content for both views, ` +
    `${resources.length} resources in ${resourceCategories.length} categories, ` +
    `${images.length} images. All comparison, geographic and submodule content fields are null.`,
);
