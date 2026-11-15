import type { Language } from '../i18n/config';
import { CURRICULUM_TEXT } from '../i18n/curriculum';
import type { ActivityText, ConceptText } from '../i18n/curriculum/types';
import { PLAYGROUND_TEXT } from '../i18n/playground';
import type {
  ByTopic,
  ClassroomActivity,
  LearningActivity,
  ScientificConcept,
  StudentModule,
  StudentSubmodule,
  Submodule,
  SubmoduleKey,
  SubmoduleTopicBlock,
  TeacherModule,
  TeacherSubmodule,
  TopicId,
} from '../types';
import { totalWeight } from '../utils/ils';
import { comparisonsBySubmodule } from './comparisons';
import { fieldTripsBySubmodule, geographicalRecommendationsBySubmodule, relatedLocationsBySubmodule } from './locations';
import { type AnalogPair, type CatalogValue, ILS_AXES, type IlsAxis, type PairId, pairsForAxis } from './lunarAnalogs';
import { submoduleKey, submodules } from './submodules';

/**
 * Contenido educativo de los nueve ejes, para las dos vistas del portal.
 *
 * UNA SOLA FUENTE, DOS ENFOQUES. Para cada eje y cada submódulo se arma a la
 * vez la versión «Aprender» (estudiante) y la «Enseñar» (plan de lección)
 * con los mismos datos, así que las dos vistas no pueden desincronizarse:
 *  - Ciencia: `i18n/playground.{es,en}.ts` (documento ILS del equipo) y el
 *    catálogo `data/lunarAnalogs.ts` (pesos, tolerancias, confianza, pares).
 *  - Pedagogía: `i18n/curriculum/{es,en}.ts`.
 *
 * El estudiante recibe explicaciones, conceptos clave, comparaciones
 * Tierra–Luna y actividades; el docente, objetivos, contenidos a impartir,
 * actividades sugeridas, preguntas, evaluación y resultados esperados.
 *
 * No se generan mediciones: los únicos números son los del catálogo, con su
 * estado (publicado o provisional). Lo que el equipo todavía no ha definido
 * (nivel educativo, duraciones, materiales, lugares, excursiones,
 * alternativas en el aula, referencias) se queda en `null` («pendiente»).
 */

export interface CurriculumContent {
  studentModules: ByTopic<StudentModule>;
  teacherModules: ByTopic<TeacherModule>;
  studentSubmodules: Record<SubmoduleKey, StudentSubmodule>;
  teacherSubmodules: Record<SubmoduleKey, TeacherSubmodule>;
}

/** Foto de cada par en los bloques del submódulo «Análogos» (imágenes de `images.ts`). */
const PAIR_IMAGES: Record<PairId, string> = {
  'elegante-linne': 'linne-lro',
  'pinacate-marius': 'marius-pit',
  'cerro-prieto-gruithuisen': 'gruithuisen-apollo15',
  'laguna-salada-tranquillitatis': 'apollo11-lro',
  'cucapa-shackleton': 'shackleton-lroc',
};

function concepts(prefix: string, items: ConceptText[]): ScientificConcept[] {
  return items.map((item, index) => ({ id: `${prefix}-${index + 1}`, term: item.term, definition: item.definition }));
}

function toClassroomActivity(activity: LearningActivity): ClassroomActivity {
  return { id: activity.id, title: activity.title, description: activity.description, durationMinutes: null, materials: null };
}

function teacherActivity(id: string, text: ActivityText): ClassroomActivity {
  return { id, title: text.title, description: text.description, durationMinutes: null, materials: null };
}

function formatValue(axis: IlsAxis, value: CatalogValue): string {
  // Redondeo «a la mitad hacia arriba» sin errores de coma flotante (244/1600 → 0.153, como en el documento).
  const factor = 10 ** axis.decimals;
  const number = (n: number) => (Math.round(Number((n * factor).toPrecision(12))) / factor).toFixed(axis.decimals);
  const shown = value.range ? `${number(value.range[0])}–${number(value.range[1])}` : number(value.value);
  return axis.unit ? `${shown} ${axis.unit}` : shown;
}

function buildCurriculum(language: Language): CurriculumContent {
  const science = PLAYGROUND_TEXT[language];
  const pedagogy = CURRICULUM_TEXT[language];
  const tpl = pedagogy.templates;
  const total = totalWeight(ILS_AXES).toString();

  const studentModules = {} as ByTopic<StudentModule>;
  const teacherModules = {} as ByTopic<TeacherModule>;
  const studentSubmodules = {} as Record<SubmoduleKey, StudentSubmodule>;
  const teacherSubmodules = {} as Record<SubmoduleKey, TeacherSubmodule>;

  for (const axis of ILS_AXES) {
    const id: TopicId = axis.id;
    const sci = science.axes[id];
    const ped = pedagogy.axes[id];
    const pairs = pairsForAxis(id);
    const pairText = (pair: AnalogPair) => science.pairs[pair.id];

    studentModules[id] = { topicId: id, tagline: ped.student.tagline, overview: ped.student.overview };
    teacherModules[id] = {
      topicId: id,
      tagline: ped.teacher.tagline,
      overview: ped.teacher.overview,
      gradeLevel: null,
      estimatedDuration: null,
      learningObjectives: ped.teacher.objectives,
      requiredMaterials: null,
    };

    for (const item of submodules.filter((s) => s.topicId === id)) {
      const key = submoduleKey(item);
      const { student, teacher } = buildSubmodule(item);
      studentSubmodules[key] = {
        ...student,
        key,
        earthInformation: null,
        moonInformation: null,
        comparisons: comparisonsBySubmodule[key] ?? null,
        relatedLocations: relatedLocationsBySubmodule[key] ?? null,
        sourceIds: null,
      };
      teacherSubmodules[key] = {
        ...teacher,
        key,
        estimatedDuration: null,
        requiredMaterials: null,
        geographicalRecommendations: geographicalRecommendationsBySubmodule[key] ?? null,
        fieldTrips: fieldTripsBySubmodule[key] ?? null,
        classroomAlternatives: null,
        sourceIds: null,
      };
    }

    type StudentPart = Pick<
      StudentSubmodule,
      'introduction' | 'blocks' | 'scientificConcepts' | 'additionalFacts' | 'learningActivities' | 'conclusion'
    >;
    type TeacherPart = Pick<TeacherSubmodule, 'learningObjectives' | 'lessonPlan' | 'activities'>;

    function buildSubmodule(item: Submodule): { student: StudentPart; teacher: TeacherPart } {
      const prefix = `${id}-${item.stage}`;
      const playground = [teacherActivity(`${prefix}-playground`, tpl.teacherPlayground(sci.name, item.stage))];

      if (item.stage === 'concept') {
        const activities: LearningActivity[] = [
          { id: `${prefix}-1`, ...ped.concept.activity, estimatedMinutes: null },
        ];
        const blocks: SubmoduleTopicBlock[] = [
          { id: `${id}-que-mide`, title: tpl.blocks.measures, body: sci.measures, imageId: null },
          { id: `${id}-por-que-importa`, title: tpl.blocks.why, body: sci.why, imageId: null },
        ];
        return {
          student: {
            introduction: ped.concept.introduction,
            blocks,
            scientificConcepts: concepts(prefix, ped.concept.concepts),
            additionalFacts: tpl.concept.facts(axis.number, ILS_AXES.length, pairs.length),
            learningActivities: activities,
            conclusion: tpl.concept.conclusion(sci.name),
          },
          teacher: {
            learningObjectives: tpl.concept.objectives(sci.name, ped.concept.concepts.map((c) => c.term).join(', ')),
            lessonPlan: {
              introduction: ped.concept.introduction,
              suggestedExplanation: `${sci.measures} ${sci.why}`,
              classroomActivities: activities.map(toClassroomActivity),
              discussionQuestions: ped.concept.discussion,
              experimentsOrDemonstrations: null,
              assessmentMethods: tpl.concept.assessment,
              expectedOutcomes: tpl.concept.outcomes(sci.name),
            },
            activities: playground,
          },
        };
      }

      if (item.stage === 'measurement') {
        const confidence = science.confidence[axis.confidence];
        const formula = tpl.measurement.formulas[axis.formula];
        const metric = `${sci.metric} (${axis.metric})`;
        const activities: LearningActivity[] = [
          { id: `${prefix}-1`, ...tpl.measurement.activity(sci.name), type: 'calculation', estimatedMinutes: null },
        ];
        const introduction = tpl.measurement.introduction(sci.name);
        return {
          student: {
            introduction,
            blocks: [
              { id: `${id}-en-la-tierra`, title: tpl.blocks.earth, body: sci.earthSource, imageId: null },
              { id: `${id}-en-la-luna`, title: tpl.blocks.moon, body: sci.moonSource, imageId: null },
              { id: `${id}-precauciones`, title: tpl.blocks.notes, body: sci.notes, imageId: null },
            ],
            scientificConcepts: concepts(prefix, [
              { term: tpl.measurement.metric, definition: metric.charAt(0).toLocaleUpperCase(language) + metric.slice(1) },
              formula,
              { term: tpl.measurement.tolerance.term, definition: tpl.measurement.tolerance.definition(axis.tolerance.toString()) },
              {
                term: tpl.measurement.confidence.term(axis.confidence),
                definition: tpl.measurement.confidence.definition(confidence),
              },
            ]),
            additionalFacts: [
              tpl.measurement.facts.weight(axis.weight.toString(), total),
              ...(axis.weightIfBothAbsent !== undefined
                ? [tpl.measurement.facts.absence(axis.weightIfBothAbsent.toString())]
                : []),
            ],
            learningActivities: activities,
            conclusion: tpl.measurement.conclusion,
          },
          teacher: {
            learningObjectives: tpl.measurement.objectives(sci.name, metric),
            lessonPlan: {
              introduction,
              suggestedExplanation: `${tpl.blocks.earth}: ${sci.earthSource} ${tpl.blocks.moon}: ${sci.moonSource} ${sci.notes}`,
              classroomActivities: activities.map(toClassroomActivity),
              discussionQuestions: tpl.measurement.discussion(axis.confidence),
              experimentsOrDemonstrations: null,
              assessmentMethods: tpl.measurement.assessment,
              expectedOutcomes: tpl.measurement.outcomes(axis.confidence),
            },
            activities: playground,
          },
        };
      }

      // Análogos: los pares de Baja California y Sonora asociados al eje.
      const introduction = pairs.length > 0 ? tpl.analogs.introduction(sci.name, pairs.length) : tpl.analogs.none(sci.name);
      const blocks: SubmoduleTopicBlock[] = pairs.map((pair) => {
        const text = pairText(pair);
        return {
          id: `${id}-${pair.id}`,
          title: text.short,
          body: [
            `${text.idea}. ${text.similar}`,
            tpl.blocks.breaks,
            ...text.breaks.map((item) => `${item.label} — ${item.text}`),
          ].join('\n\n'),
          imageId: PAIR_IMAGES[pair.id],
        };
      });
      const facts = pairs.flatMap((pair) => {
        const name = pairText(pair).short;
        const values = pair.axes[id];
        const out: string[] = [];
        if (pair.strongAxes.includes(id)) out.push(tpl.analogs.facts.strong(name, sci.name));
        if (values?.earth && values.moon) {
          const earth = formatValue(axis, values.earth);
          const moon = formatValue(axis, values.moon);
          const provisional = values.earth.status === 'provisional' || values.moon.status === 'provisional';
          out.push(provisional ? tpl.analogs.facts.provisional(name, earth, moon) : tpl.analogs.facts.published(name, earth, moon));
        }
        return out;
      });
      const activities: LearningActivity[] = [
        ...pairs.map((pair, index) => ({
          id: `${prefix}-${index + 1}`,
          title: tpl.analogs.questionTitle(pairText(pair).short),
          description: pairText(pair).question,
          type: 'reflection' as const,
          estimatedMinutes: null,
        })),
        { id: `${prefix}-playground`, ...tpl.analogs.playground(sci.name), type: 'exploration', estimatedMinutes: null },
      ];
      return {
        student: {
          introduction,
          blocks,
          scientificConcepts: concepts(prefix, tpl.analogs.concepts),
          additionalFacts: facts,
          learningActivities: activities,
          conclusion: tpl.analogs.conclusion(sci.name),
        },
        teacher: {
          learningObjectives: tpl.analogs.objectives,
          lessonPlan: {
            introduction,
            suggestedExplanation: [tpl.analogs.explanation(sci.name), ...pairs.map((p) => `${pairText(p).short}: ${pairText(p).similar}`)].join(
              ' ',
            ),
            classroomActivities: activities.filter((a) => a.type !== 'exploration').map(toClassroomActivity),
            discussionQuestions: tpl.analogs.discussion(sci.name),
            experimentsOrDemonstrations: null,
            assessmentMethods: tpl.analogs.assessment,
            expectedOutcomes: tpl.analogs.outcomes,
          },
          activities: playground,
        },
      };
    }
  }

  return { studentModules, teacherModules, studentSubmodules, teacherSubmodules };
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
