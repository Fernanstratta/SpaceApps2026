/**
 * Verifies the educational data (`npm run verify:data`):
 *  - The nine comparative axes are the portal's topics, in the backend order,
 *    with the backend names (`name_es`) and units.
 *  - Every axis has three submodules (concept → measurement → analogs), each
 *    with an educational level, and every submodule has a complete student
 *    lesson and teacher plan in both languages, sized for its level (session
 *    minutes and number of quiz questions).
 *  - Comparison data is never copied into the lessons: the comparison of each
 *    lesson points to backend pairs, numbers inside texts are `[[…]]` tokens
 *    resolved from the backend, and no backend value is typed by hand.
 *  - Missing data stays missing: lessons only cite axes that the backend marks
 *    as comparable, or explain that they are not.
 *  - Stale backend texts flagged in `STALE_BACKEND_TEXTS` are still present
 *    (otherwise the entry is no longer needed).
 *  - Resources and images keep their required fields and licenses.
 *
 * Run with: npm run verify:data
 */
import {
  images,
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
import { QUIZ_SIZE, SESSION_MINUTES, SUBMODULE_PAIRS } from '../src/data/curriculumPlan';
import { hasUnresolvedTokens } from '../src/data/curriculumTokens';
import { getDataApi } from '../src/data/localized';
import {
  BODIES,
  getLunarAnalogCatalog,
  getPair,
  isPairId,
  pairAxis,
  STALE_BACKEND_TEXTS,
} from '../src/data/lunarAnalogs';
import { CURRICULUM_TEXT } from '../src/i18n/curriculum';
import { PLAYGROUND_TEXT } from '../src/i18n/playground';
import { AXIS_IDS, EDUCATION_LEVELS, LESSON_VISUAL_KINDS, SUBMODULE_STAGES, TOPIC_IDS } from '../src/types';
import { formatAxisNumber, formatScore } from '../src/utils/analogFormat';

const errors: string[] = [];
const check = (condition: boolean, message: string) => {
  if (!condition) errors.push(message);
};

const catalog = getLunarAnalogCatalog();
const firstPair = catalog.pairs[0]!;

// Topics = axes, named as in the backend
check(TOPIC_IDS === AXIS_IDS, 'TOPIC_IDS must be the axis ids');
check(topics.length === 9, `Expected 9 topics (axes), found ${topics.length}`);
const sortedTopics = [...topics].sort((a, b) => a.order - b.order);
sortedTopics.forEach((topic, index) => {
  const axis = firstPair.data.axes[index]!;
  check(topic.id === axis.key, `Topic ${index + 1} should be axis ${axis.key}, found ${topic.id}`);
  check(topic.name === axis.name_es, `Topic ${topic.id} name «${topic.name}» ≠ backend «${axis.name_es}»`);
  check(PLAYGROUND_TEXT.es.axes[axis.key].units === axis.units, `Axis ${axis.key}: units differ from the backend`);
  check(topic.order === axis.id, `Topic ${topic.id} order must be the axis number`);
  check(Boolean(topic.description?.trim()), `Topic ${topic.id} has no description`);
});
for (const language of ['es', 'en'] as const) {
  for (const topic of getDataApi(language).getSortedTopics()) {
    check(topic.name === PLAYGROUND_TEXT[language].axes[topic.id].name, `${language}: topic ${topic.id} name differs from the Playground name`);
  }
}

// Submodules: three per axis, in the progression order, each with a level
const knownImageIds = new Set(images.map((image) => image.id));
const submoduleIds = new Set<string>();
for (const item of submodules) {
  check(!submoduleIds.has(item.id), `Submodule id must be unique across axes: ${item.id}`);
  submoduleIds.add(item.id);
  check(knownImageIds.has(item.imageId), `Submodule ${item.id} references missing image ${item.imageId}`);
  check(/^[a-z0-9-]+$/.test(item.id), `Submodule id must be a URL slug: ${item.id}`);
  check((EDUCATION_LEVELS as readonly string[]).includes(item.level), `Submodule ${item.id} has an unknown level`);
}
for (const id of TOPIC_IDS) {
  const stages = submodules
    .filter((item) => item.topicId === id)
    .sort((a, b) => a.order - b.order)
    .map((item) => item.stage);
  check(stages.join(',') === SUBMODULE_STAGES.join(','), `Axis ${id} must have ${SUBMODULE_STAGES.join(' → ')} (found ${stages.join(', ')})`);
}
check(new Set(submodules.map((item) => item.level)).size === EDUCATION_LEVELS.length, 'The three educational levels are used');

// Lesson pairs: real backend pairs
for (const id of TOPIC_IDS) {
  for (const stage of SUBMODULE_STAGES) {
    const pairIds = SUBMODULE_PAIRS[id][stage];
    check(pairIds.length > 0, `${id}/${stage} has no pairs`);
    check(pairIds.every(isPairId), `${id}/${stage} uses an unknown pair`);
  }
}

// Hand-typed backend values: every similarity and every compared value of
// the backend, formatted as the app shows them. None may appear literally in
// the lesson sources (they must be `[[…]]` tokens).
const backendNumbers = new Set<string>();
for (const pair of catalog.pairs) {
  if (pair.data.ils.value !== null) backendNumbers.add(formatScore(pair.data.ils.value, 'es-MX'));
  for (const axis of pair.data.axes) {
    if (axis.similarity !== null) backendNumbers.add(formatScore(axis.similarity, 'es-MX'));
    for (const body of BODIES) {
      const side = axis[body];
      if (side) backendNumbers.add(formatAxisNumber(axis.key, side.value, 'es-MX'));
    }
  }
}
// Only values specific enough to be recognisable (e.g. «0.667», «48.7», «281.5»).
const distinctive = [...backendNumbers].filter((value) => /\d\.\d/.test(value) && value.length >= 4 && !['100.0', '0.0'].includes(value));
const rawSources = JSON.stringify(CURRICULUM_TEXT.es.axes);
const stripped = rawSources.replace(/\[\[[^\]]*\]\]/g, '');
for (const value of distinctive) {
  const pattern = new RegExp(`(^|[^\\d.])${value.replace('.', '\\.')}(?![\\d])`);
  check(!pattern.test(stripped), `Lesson text contains the backend value «${value}» typed by hand: use a [[…]] token`);
}

// Content of both views, in both languages
const knownResourceIds = new Set(resources.map((resource) => resource.id));
const ids = <T extends { id: string }>(items: T[] | null) => (items ?? []).map((item) => item.id).join(',');
for (const language of ['es', 'en'] as const) {
  const content = getCurriculum(language);
  const allText = JSON.stringify(content);
  check(!hasUnresolvedTokens(allText), `${language}: the built curriculum has unresolved [[…]] tokens`);

  for (const id of TOPIC_IDS) {
    const student = content.studentModules[id];
    const teacher = content.teacherModules[id];
    check(Boolean(student?.tagline && student.overview), `${language}: student module ${id} incomplete`);
    check(Boolean(teacher?.tagline && teacher.overview), `${language}: teacher module ${id} incomplete`);
    check((teacher?.learningObjectives?.length ?? 0) > 0, `${language}: teacher module ${id} has no objectives`);
    check(Boolean(teacher?.gradeLevel && teacher.estimatedDuration), `${language}: teacher module ${id} has no level or duration`);
  }

  for (const item of submodules) {
    const key = `${item.topicId}/${item.id}` as const;
    const student = content.studentSubmodules[key];
    const teacher = content.teacherSubmodules[key];
    check(student?.key === key && teacher?.key === key, `${language}: missing content ${key}`);
    if (!student || !teacher) continue;
    check(student.level === item.level && teacher.level === item.level, `${language}: ${key} level mismatch`);

    // Student lesson
    check(Boolean(student.introduction?.trim()), `${language}: ${key} has no introduction`);
    check((student.blocks?.length ?? 0) >= 2, `${language}: ${key} needs at least two explanation blocks`);
    check((student.scientificConcepts?.length ?? 0) > 0, `${language}: ${key} has no concepts`);
    check(Boolean(student.earthInformation?.summary && student.moonInformation?.summary), `${language}: ${key} has no Earth/Moon panels`);
    check((student.learningActivities?.length ?? 0) >= 2, `${language}: ${key} needs a hands-on activity and the Playground link`);
    check(Boolean(student.conclusion?.trim()), `${language}: ${key} has no conclusion`);
    const [quizMin, quizMax] = QUIZ_SIZE[item.level];
    const quiz = student.knowledgeCheck ?? [];
    check(quiz.length >= quizMin && quiz.length <= quizMax, `${language}: ${key} must have ${quizMin}–${quizMax} quiz questions for ${item.level}`);
    for (const question of quiz) {
      check(question.answerIndex >= 0 && question.answerIndex < question.options.length, `${language}: ${key} quiz answer out of range`);
      check(new Set(question.options).size === question.options.length, `${language}: ${key} quiz has repeated options`);
    }
    for (const block of student.blocks ?? []) {
      if (block.imageId) check(knownImageIds.has(block.imageId), `${language}: ${key} uses unknown image ${block.imageId}`);
      if (block.visual) check((LESSON_VISUAL_KINDS as readonly string[]).includes(block.visual), `${language}: ${key} unknown visual ${block.visual}`);
      if (block.visualPairId) check(isPairId(block.visualPairId), `${language}: ${key} visual uses an unknown pair`);
    }

    // Comparison: real backend pairs for this axis
    const comparison = student.comparison;
    check(comparison?.axisId === item.topicId, `${language}: ${key} comparison must use its own axis`);
    for (const pairId of comparison?.pairIds ?? []) {
      check(isPairId(pairId), `${language}: ${key} comparison uses unknown pair ${pairId}`);
      if (isPairId(pairId)) pairAxis(getPair(pairId), item.topicId);
    }

    // Teacher plan
    const plan = teacher.lessonPlan;
    const minutes = (plan?.classroomActivities ?? []).reduce((sum, step) => sum + (step.durationMinutes ?? 0), 0);
    check(minutes === SESSION_MINUTES[item.level], `${language}: ${key} session is ${minutes} min, expected ${SESSION_MINUTES[item.level]} for ${item.level}`);
    check((teacher.learningObjectives?.length ?? 0) > 0, `${language}: ${key} has no objectives`);
    check((teacher.priorKnowledge?.length ?? 0) > 0, `${language}: ${key} has no prior knowledge`);
    check((teacher.requiredMaterials?.length ?? 0) > 0 || item.level === 'preparatoria', `${language}: ${key} has no materials`);
    check(Boolean(plan?.suggestedExplanation?.trim()), `${language}: ${key} has no content to teach`);
    check((plan?.discussionQuestions?.length ?? 0) > 0, `${language}: ${key} has no discussion questions`);
    check((plan?.assessmentMethods?.length ?? 0) > quiz.length, `${language}: ${key} assessment must include the quiz key and other methods`);
    check((plan?.expectedOutcomes?.length ?? 0) > 0, `${language}: ${key} has no expected outcomes`);
    check(plan?.introduction === student.introduction, `${language}: ${key} plan must open with the student hook`);
    check((teacher.activities?.length ?? 0) > 0, `${language}: ${key} has no data activity`);
    check((teacher.classroomAlternatives?.length ?? 0) >= 2, `${language}: ${key} needs an offline alternative and the printable table`);
    check(Array.isArray(teacher.fieldTrips) && teacher.fieldTrips.length === 0, `${language}: ${key} field trips stay empty (no verified access data)`);
    for (const sourceId of [...(student.sourceIds ?? []), ...(teacher.sourceIds ?? [])]) {
      check(knownResourceIds.has(sourceId), `${language}: ${key} cites unknown resource ${sourceId}`);
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

// Stale backend texts: each entry must still match the backend (else it can go).
for (const stale of STALE_BACKEND_TEXTS) {
  const found = catalog.pairs.some(
    (pair) =>
      pair.data.education.breaks_es.some((item) => item.text === stale.original) ||
      pair.data.earth_site.aoi.note === stale.original ||
      pair.data.moon_site.aoi.note === stale.original,
  );
  check(found, `STALE_BACKEND_TEXTS «${stale.id}» no longer matches the backend: remove the entry`);
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

const levels = EDUCATION_LEVELS.map((level) => `${submodules.filter((item) => item.level === level).length} ${level}`).join(', ');
console.log(
  `✓ Data verified: ${topics.length} axes, ${submodules.length} submodules (${levels}) with student lessons and teacher plans ` +
    `in ES and EN, backend data through ${distinctive.length} guarded values, ${resources.length} resources, ${images.length} images.`,
);
