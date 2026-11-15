import { LOCALES, type Language } from '../i18n/config';
import { CURRICULUM_TEXT } from '../i18n/curriculum';
import { PLAYGROUND_TEXT } from '../i18n/playground';
import {
  type ByTopic,
  type ClassroomActivity,
  type ClassroomAlternative,
  type Demonstration,
  EDUCATION_LEVELS,
  type GeoLocation,
  type GeographicalRecommendation,
  type LearningActivity,
  type QuizQuestion,
  type RelatedLocation,
  type StudentModule,
  type StudentSubmodule,
  type Submodule,
  type SubmoduleKey,
  type SubmoduleTopicBlock,
  type TeacherModule,
  type TeacherSubmodule,
  type TopicId,
} from '../types';
import { formatAxisValue, formatKm, formatScore } from '../utils/analogFormat';
import { getPairLabels } from './analogText';
import { DETAIL_BY_LEVEL, SUBMODULE_PAIRS } from './curriculumPlan';
import { resolveTokens } from './curriculumTokens';
import { AXIS_IDS, getPair, isComparable, pairAxis } from './lunarAnalogs';
import { submoduleKey, submodules } from './submodules';

/**
 * Contenido educativo de los nueve ejes, para las dos vistas del portal.
 *
 * UNA SOLA FUENTE, DOS ENFOQUES. Cada submódulo tiene una lección de
 * estudiante («Aprender») y un plan docente («Enseñar») escritos para su
 * nivel educativo (`i18n/curriculum/{es,en}`), y los dos se arman aquí con
 * los mismos pares del catálogo (`curriculumPlan.ts`), así que no pueden
 * desincronizarse:
 *  - Los datos de comparación NO se copian: la lección guarda qué eje y qué
 *    pares usa, y la vista los lee del catálogo del backend al dibujarse.
 *  - Los números que aparecen dentro de un texto son marcas `[[…]]` que se
 *    sustituyen por el valor del backend (`curriculumTokens.ts`).
 *  - Los lugares relacionados son los sitios terrestres del backend.
 *
 * Lo único que queda sin contenido son las excursiones: ninguna fuente del
 * proyecto trae información verificada de acceso, permisos ni seguridad.
 */

export interface CurriculumContent {
  studentModules: ByTopic<StudentModule>;
  teacherModules: ByTopic<TeacherModule>;
  studentSubmodules: Record<SubmoduleKey, StudentSubmodule>;
  teacherSubmodules: Record<SubmoduleKey, TeacherSubmodule>;
  /** Resumen de cada submódulo (tarjetas del portal). */
  summaries: Record<SubmoduleKey, string>;
}

function buildCurriculum(language: Language): CurriculumContent {
  const locale = LOCALES[language];
  const science = PLAYGROUND_TEXT[language];
  const { axes, shared } = CURRICULUM_TEXT[language];
  const fill = (text: string) => resolveTokens(text, language);

  const studentModules = {} as ByTopic<StudentModule>;
  const teacherModules = {} as ByTopic<TeacherModule>;
  const studentSubmodules = {} as Record<SubmoduleKey, StudentSubmodule>;
  const teacherSubmodules = {} as Record<SubmoduleKey, TeacherSubmodule>;
  const summaries = {} as Record<SubmoduleKey, string>;

  for (const id of AXIS_IDS) {
    const topicId: TopicId = id;
    const axisText = science.axes[id];
    const content = axes[id];
    const lessons = submodules.filter((item) => item.topicId === id).sort((a, b) => a.order - b.order);

    for (const item of lessons) {
      const key = submoduleKey(item);
      const built = buildSubmodule(item);
      studentSubmodules[key] = built.student;
      teacherSubmodules[key] = built.teacher;
      summaries[key] = fill(content.submodules[item.stage].summary);
    }

    // Ficha del módulo: se deriva de sus tres sesiones.
    const sessions = lessons.map((item) => teacherSubmodules[submoduleKey(item)]!);
    const levels = EDUCATION_LEVELS.filter((level) => lessons.some((item) => item.level === level));
    const totalMinutes = lessons.reduce((sum, item) => sum + sessionMinutes(item), 0);
    studentModules[topicId] = { topicId, tagline: content.student.tagline, overview: fill(content.student.overview) };
    teacherModules[topicId] = {
      topicId,
      tagline: content.teacher.tagline,
      overview: fill(content.teacher.overview),
      gradeLevel:
        levels.length > 1 ? shared.levelRange(shared.levels[levels[0]!], shared.levels[levels[levels.length - 1]!]) : shared.levels[levels[0]!],
      estimatedDuration: shared.moduleDuration(lessons.length, totalMinutes),
      learningObjectives: content.teacher.objectives,
      requiredMaterials: [...new Set(sessions.flatMap((session) => session.requiredMaterials ?? []))],
    };

    function sessionMinutes(item: Submodule): number {
      return content.submodules[item.stage].teacher.steps.reduce((sum, step) => sum + step.minutes, 0);
    }

    function buildSubmodule(item: Submodule): { student: StudentSubmodule; teacher: TeacherSubmodule } {
      const key = submoduleKey(item);
      const prefix = `${id}-${item.stage}`;
      const text = content.submodules[item.stage];
      const pairIds = SUBMODULE_PAIRS[id][item.stage];
      const pairs = pairIds.map(getPair);

      // Sitios terrestres reales de los pares de la lección (coordenadas y área del backend).
      const sites = pairs.map((pair) => {
        const site = pair.data.earth_site;
        const labels = getPairLabels(pair, language);
        const axis = pairAxis(pair, id);
        const location: GeoLocation = {
          id: site.site_id,
          name: labels.earth.name,
          description: shared.location.description(labels.earth.type, formatKm(site.aoi.radius_m, locale), labels.earth.aoiNote),
          geographicFeatures: [labels.earth.type],
          coordinates: { latitude: site.lat, longitude: site.lon },
          region: labels.earth.region,
          sourceIds: null,
        };
        const relation = axis.earth
          ? shared.location.relation(axisText.name, formatAxisValue(id, axis.earth.value, locale, science.table.value))
          : shared.location.relationMissing(axisText.name);
        return { location, relation: `${labels.match} ${relation}` };
      });
      const relatedLocations: RelatedLocation[] = sites.map(({ location, relation }) => ({ location, relationToTopic: relation }));
      const geographicalRecommendations: GeographicalRecommendation[] = sites.map(({ location, relation }) => ({
        location,
        relationToTopic: relation,
        suggestedActivities: text.teacher.siteActivities.map(fill),
      }));

      // Estudiante
      const blocks: SubmoduleTopicBlock[] = text.student.blocks.map((block) => ({
        id: `${prefix}-${block.id}`,
        title: block.title,
        body: fill(block.body),
        imageId: block.imageId ?? null,
        visual: block.visual ?? null,
      }));
      const handsOn: LearningActivity[] = text.student.activities.map((activity, index) => ({
        id: `${prefix}-actividad-${index + 1}`,
        title: activity.title,
        description: fill(activity.description),
        type: activity.type,
        estimatedMinutes: activity.minutes,
      }));
      const playground: LearningActivity = {
        id: `${prefix}-playground`,
        ...shared.playground(axisText.name),
        type: 'exploration',
        estimatedMinutes: null,
      };
      const knowledgeCheck: QuizQuestion[] = text.student.quiz.map((question, index) => ({
        id: `${prefix}-pregunta-${index + 1}`,
        question: fill(question.question),
        options: question.options.map(fill),
        answerIndex: question.answer,
        explanation: fill(question.explanation),
      }));
      const introduction = fill(text.student.introduction);

      const student: StudentSubmodule = {
        key,
        level: item.level,
        introduction,
        blocks,
        scientificConcepts: text.student.concepts.map((concept, index) => ({
          id: `${prefix}-concepto-${index + 1}`,
          term: concept.term,
          definition: fill(concept.definition),
        })),
        earthInformation: { summary: fill(text.student.earth), measurements: null, sourceIds: null },
        moonInformation: { summary: fill(text.student.moon), measurements: null, sourceIds: null },
        comparison: { axisId: id, pairIds: [...pairIds], detail: DETAIL_BY_LEVEL[item.level], lead: fill(text.student.comparisonLead) },
        relatedLocations,
        additionalFacts: text.student.facts.map(fill),
        learningActivities: [...handsOn, playground],
        knowledgeCheck,
        conclusion: fill(text.student.conclusion),
        sourceIds: null,
      };

      // Docente
      const steps: ClassroomActivity[] = text.teacher.steps.map((step, index) => ({
        id: `${prefix}-paso-${index + 1}`,
        title: step.title,
        description: fill(step.description),
        durationMinutes: step.minutes,
        materials: null,
      }));
      // Las mismas actividades prácticas que ve el estudiante, para que las dos vistas coincidan.
      const demonstrations: Demonstration[] = handsOn.map((activity) => ({
        id: activity.id,
        title: activity.title,
        description: activity.description,
        materials: null,
        safetyNotes: null,
      }));
      const dataActivity: ClassroomActivity = {
        id: `${prefix}-datos`,
        title: text.teacher.dataActivity.title,
        description: fill(text.teacher.dataActivity.description),
        durationMinutes: text.teacher.dataActivity.minutes,
        materials: null,
      };
      // Tabla del eje para trabajar sin internet, armada con los valores del backend.
      const printableRows = pairs.map((pair) => {
        const axis = pairAxis(pair, id);
        const name = getPairLabels(pair, language).short;
        if (!isComparable(axis)) return shared.printable.rowMissing(name);
        const value = (side: { value: number }) => formatAxisValue(id, side.value, locale, science.table.value);
        return shared.printable.row(name, value(axis.earth), value(axis.moon), formatScore(axis.similarity, locale));
      });
      const alternatives: ClassroomAlternative[] = [
        {
          id: `${prefix}-alternativa`,
          type: text.teacher.alternative.type,
          title: text.teacher.alternative.title,
          description: fill(text.teacher.alternative.description),
          materials: text.teacher.alternative.materials,
          resourceUrl: null,
        },
        {
          id: `${prefix}-tabla`,
          type: 'printable',
          title: shared.printable.title,
          description: [shared.printable.description(axisText.name, axisText.units), ...printableRows].join(' '),
          materials: shared.printable.materials,
          resourceUrl: null,
        },
      ];
      const quizKey = knowledgeCheck.map((question, index) =>
        shared.quizKey(index + 1, question.question, question.options[question.answerIndex] ?? ''),
      );

      const teacher: TeacherSubmodule = {
        key,
        level: item.level,
        estimatedDuration: shared.sessionDuration(sessionMinutes(item)),
        learningObjectives: text.teacher.objectives.map(fill),
        priorKnowledge: text.teacher.priorKnowledge.map(fill),
        requiredMaterials: text.teacher.materials,
        lessonPlan: {
          // El plan abre con el mismo gancho que lee el estudiante.
          introduction,
          suggestedExplanation: fill(text.teacher.explanation),
          classroomActivities: steps,
          discussionQuestions: text.teacher.discussion.map(fill),
          experimentsOrDemonstrations: demonstrations,
          assessmentMethods: [...text.teacher.assessment.map(fill), ...quizKey],
          expectedOutcomes: text.teacher.outcomes.map(fill),
        },
        activities: [dataActivity],
        geographicalRecommendations,
        // Sin entradas a propósito: no hay datos verificados de acceso ni de seguridad de los sitios.
        fieldTrips: [],
        classroomAlternatives: alternatives,
        sourceIds: null,
      };

      return { student, teacher };
    }
  }

  return { studentModules, teacherModules, studentSubmodules, teacherSubmodules, summaries };
}

const cache = new Map<Language, CurriculumContent>();

/** Contenido de los dos modos en un idioma (se construye una vez y se reutiliza). */
export function getCurriculum(language: Language): CurriculumContent {
  let content = cache.get(language);
  if (!content) {
    content = buildCurriculum(language);
    cache.set(language, content);
  }
  return content;
}
