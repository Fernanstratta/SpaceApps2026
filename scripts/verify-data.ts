/**
 * Verifies the educational data (`npm run verify:data`):
 *  - The nine comparative axes are the portal's topics, in document order,
 *    with exactly the names defined by the team (same names as the
 *    Playground filters, in Spanish and English).
 *  - Every axis has three submodules: concept → measurement → analogs.
 *  - Student ("Aprender") and teacher ("Enseñar") content exist for every
 *    axis and submodule in both languages, with the SAME structure (same
 *    submodules, same activities), and each view has its own focus.
 *  - Nothing is invented: measurements, comparisons, locations, field trips,
 *    grade levels and durations stay `null` until the team provides them.
 *  - Every `sourceIds` / `imageId` points to a known resource / image.
 *  - Resources and images keep their required fields and licenses.
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
import { getCurriculum } from '../src/data/curriculum';
import { getDataApi } from '../src/data/localized';
import { ILS_AXES, pairsForAxis } from '../src/data/lunarAnalogs';
import { PLAYGROUND_TEXT } from '../src/i18n/playground';
import { AXIS_IDS, SUBMODULE_STAGES, TOPIC_IDS } from '../src/types';

const errors: string[] = [];
const check = (condition: boolean, message: string) => {
  if (!condition) errors.push(message);
};

// The nine axes, exactly as defined in the refactoring brief (section 1).
const EXPECTED_AXIS_NAMES = [
  'Pendiente y seguridad de aterrizaje',
  'Rugosidad superficial (radar)',
  'Composición mineralógica',
  'Albedo y reflectancia óptica',
  'Amplitud térmica día/noche',
  'Aridez y ausencia biológica',
  'Humedad y hielo subsuperficial',
  'Polvo y regolito fino',
  'Morfología de cráteres y cavidades',
];

// Topics = axes
check(TOPIC_IDS === AXIS_IDS, 'TOPIC_IDS must be the axis ids');
check(topics.length === 9, `Expected 9 topics (axes), found ${topics.length}`);
const sortedTopics = [...topics].sort((a, b) => a.order - b.order);
sortedTopics.forEach((topic, index) => {
  check(topic.id === AXIS_IDS[index], `Topic ${index + 1} should be axis ${AXIS_IDS[index]}, found ${topic.id}`);
  check(topic.name === EXPECTED_AXIS_NAMES[index], `Topic ${topic.id} name «${topic.name}» ≠ «${EXPECTED_AXIS_NAMES[index]}»`);
  check(topic.order === ILS_AXES[index]?.number, `Topic ${topic.id} order must be the axis number`);
  check(Boolean(topic.description?.trim()), `Topic ${topic.id} has no description`);
});
for (const language of ['es', 'en'] as const) {
  const api = getDataApi(language);
  for (const topic of api.getSortedTopics()) {
    check(
      topic.name === PLAYGROUND_TEXT[language].axes[topic.id].name,
      `${language}: topic ${topic.id} name differs from the Playground filter name`,
    );
  }
}

// Submodules: three per axis, in the progression order
const knownImageIds = new Set(images.map((image) => image.id));
const submoduleKeys = new Set<string>();
const submoduleIds = new Set<string>();
for (const item of submodules) {
  const key = `${item.topicId}/${item.id}`;
  check(!submoduleKeys.has(key), `Duplicate submodule: ${key}`);
  check(!submoduleIds.has(item.id), `Submodule id must be unique across axes (translations are keyed by id): ${item.id}`);
  submoduleKeys.add(key);
  submoduleIds.add(item.id);
  check((TOPIC_IDS as readonly string[]).includes(item.topicId), `Submodule ${item.id} has unknown topic`);
  check(knownImageIds.has(item.imageId), `Submodule ${item.id} references missing image ${item.imageId}`);
  check(/^[a-z0-9-]+$/.test(item.id), `Submodule id must be a URL slug: ${item.id}`);
}
for (const id of TOPIC_IDS) {
  const stages = submodules
    .filter((item) => item.topicId === id)
    .sort((a, b) => a.order - b.order)
    .map((item) => item.stage);
  check(
    stages.join(',') === SUBMODULE_STAGES.join(','),
    `Axis ${id} must have the submodules ${SUBMODULE_STAGES.join(' → ')} (found ${stages.join(', ') || 'none'})`,
  );
  check(pairsForAxis(id).length > 0, `Axis ${id} has no associated Playground pair`);
}

// Content of both views, in both languages
const knownResourceIds = new Set(resources.map((resource) => resource.id));
const ids = <T extends { id: string }>(items: T[] | null) => (items ?? []).map((item) => item.id).join(',');
for (const language of ['es', 'en'] as const) {
  const content = getCurriculum(language);
  for (const id of TOPIC_IDS) {
    const student = content.studentModules[id];
    const teacher = content.teacherModules[id];
    check(student?.topicId === id && Boolean(student.tagline && student.overview), `${language}: student module ${id} incomplete`);
    check(teacher?.topicId === id && Boolean(teacher.tagline && teacher.overview), `${language}: teacher module ${id} incomplete`);
    check((teacher?.learningObjectives?.length ?? 0) > 0, `${language}: teacher module ${id} has no learning objectives`);
    check(teacher?.gradeLevel === null && teacher.estimatedDuration === null, `${language}: ${id} grade level / duration must stay null`);
  }

  for (const key of SUBMODULE_KEYS) {
    const student = content.studentSubmodules[key];
    const teacher = content.teacherSubmodules[key];
    check(student?.key === key, `${language}: missing student content ${key}`);
    check(teacher?.key === key, `${language}: missing teacher content ${key}`);
    if (!student || !teacher) continue;

    // Student focus: explanations, key concepts, Earth–Moon comparisons, activities.
    check(Boolean(student.introduction?.trim()), `${language}: ${key} has no student introduction`);
    check((student.blocks?.length ?? 0) > 0, `${language}: ${key} has no explanation blocks`);
    check((student.scientificConcepts?.length ?? 0) > 0, `${language}: ${key} has no key concepts`);
    check((student.learningActivities?.length ?? 0) > 0, `${language}: ${key} has no learning activities`);
    check(Boolean(student.conclusion?.trim()), `${language}: ${key} has no conclusion`);

    // Teacher focus: objectives, content to teach, suggested activities, expected outcomes.
    const plan = teacher.lessonPlan;
    check((teacher.learningObjectives?.length ?? 0) > 0, `${language}: ${key} has no learning objectives`);
    check(Boolean(plan?.suggestedExplanation?.trim()), `${language}: ${key} has no content to teach`);
    check((plan?.classroomActivities?.length ?? 0) > 0, `${language}: ${key} has no suggested activities`);
    check((plan?.expectedOutcomes?.length ?? 0) > 0, `${language}: ${key} has no expected outcomes`);
    check((plan?.assessmentMethods?.length ?? 0) > 0, `${language}: ${key} has no assessment methods`);

    // Same topic, two approaches: the lesson plan opens with the student hook
    // and uses the student activities (except the Playground exploration).
    check(plan?.introduction === student.introduction, `${language}: ${key} lesson intro differs from the student introduction`);
    const studentActivityIds = new Set((student.learningActivities ?? []).map((a) => a.id));
    check(
      (plan?.classroomActivities ?? []).every((a) => studentActivityIds.has(a.id)),
      `${language}: ${key} lesson plan uses activities that are not in the student view`,
    );

    // Nothing invented.
    for (const field of ['earthInformation', 'moonInformation', 'comparisons', 'relatedLocations'] as const) {
      check(student[field] === null, `${language}: studentSubmodules['${key}'].${field} must be null (no data yet)`);
    }
    for (const field of ['estimatedDuration', 'requiredMaterials', 'geographicalRecommendations', 'fieldTrips', 'classroomAlternatives'] as const) {
      check(teacher[field] === null, `${language}: teacherSubmodules['${key}'].${field} must be null (not defined yet)`);
    }
    for (const sourceId of [...(student.sourceIds ?? []), ...(teacher.sourceIds ?? [])]) {
      check(knownResourceIds.has(sourceId), `${language}: ${key} cites unknown resource ${sourceId}`);
    }
    for (const block of student.blocks ?? []) {
      if (block.imageId) check(knownImageIds.has(block.imageId), `${language}: ${key} uses unknown image ${block.imageId}`);
    }
  }
}

// Both languages share exactly the same structure.
const es = getCurriculum('es');
const en = getCurriculum('en');
for (const key of SUBMODULE_KEYS) {
  const [s1, s2] = [es.studentSubmodules[key], en.studentSubmodules[key]];
  const [t1, t2] = [es.teacherSubmodules[key], en.teacherSubmodules[key]];
  check(ids(s1?.blocks ?? null) === ids(s2?.blocks ?? null), `${key}: ES/EN blocks differ`);
  check(ids(s1?.learningActivities ?? null) === ids(s2?.learningActivities ?? null), `${key}: ES/EN activities differ`);
  check(ids(t1?.lessonPlan?.classroomActivities ?? null) === ids(t2?.lessonPlan?.classroomActivities ?? null), `${key}: ES/EN lesson plans differ`);
}
check(studentModules === es.studentModules && teacherModules === es.teacherModules, 'Exported modules must be the Spanish build');
check(studentSubmodules === es.studentSubmodules && teacherSubmodules === es.teacherSubmodules, 'Exported submodules must be the Spanish build');

// Comparison & location sources (no data yet)
check(locationCatalog === null, 'locationCatalog must be null');
for (const key of SUBMODULE_KEYS) {
  check(comparisonsBySubmodule[key] === null, `comparisonsBySubmodule['${key}'] must be null`);
  check(relatedLocationsBySubmodule[key] === null, `relatedLocationsBySubmodule['${key}'] must be null`);
  check(geographicalRecommendationsBySubmodule[key] === null, `geographicalRecommendationsBySubmodule['${key}'] must be null`);
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

if (errors.length > 0) {
  console.error(`✗ Data verification failed (${errors.length}):`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(
  `✓ Data verified: ${topics.length} axes, ${submodules.length} submodules (concept → measurement → analogs) ` +
    `with student and teacher content in ES and EN, ${resources.length} resources, ${images.length} images. ` +
    'Measurements, comparisons, locations, durations and grade levels stay null.',
);
