import { useReferenceLocation } from '../../hooks/useReferenceLocation';
import type { LessonPlan, Submodule, TeacherModule, TeacherSubmodule, Topic } from '../../types';
import { getDataState } from '../../utils/nullable';
import { DataStateMessage } from '../common/DataStateMessage';
import { FieldList } from '../common/FieldList';
import { NullableSection } from '../common/NullableSection';
import { TextList } from '../common/TextList';
import { LocationDetails } from '../maps/LocationDetails';
import { LocationMap } from '../maps/LocationMap';
import { ReferenceLocationCard } from '../maps/ReferenceLocationCard';
import type { SubmoduleSectionLink } from '../submodule/SubmoduleLayout';
import { SubmoduleReferences } from '../submodule/SubmoduleReferences';
import { ClassroomActivityList } from './ClassroomActivityList';
import { ClassroomAlternativesView } from './ClassroomAlternativesView';
import { LessonPlanView } from './LessonPlanView';
import { useData, useMessages } from '../../i18n/I18nContext';
import { isPairId } from '../../data/lunarAnalogs';
import { playgroundLink } from '../../data/playground';
import { Link } from '../../router/Link';

type Messages = ReturnType<typeof useMessages>;

const ID = {
  general: 'informacion-general',
  lessonPlan: 'plan-de-clase',
  activities: 'actividades',
  recommendations: 'recomendaciones-geograficas',
  fieldTrips: 'excursiones',
  alternatives: 'alternativas',
  references: 'referencias',
} as const;

/** Sections of the "Enseñar" view, in reading order (for "En esta página"). */
export function teacherSubmoduleSections({ TEACHER_SECTIONS, SUBMODULE_TEXT }: Messages): SubmoduleSectionLink[] {
  return [
    { id: ID.general, label: TEACHER_SECTIONS.general },
    { id: ID.lessonPlan, label: TEACHER_SECTIONS.lessonPlan },
    { id: ID.activities, label: TEACHER_SECTIONS.activities },
    { id: ID.recommendations, label: TEACHER_SECTIONS.geographicalRecommendations },
    { id: ID.fieldTrips, label: TEACHER_SECTIONS.fieldTrips },
    { id: ID.alternatives, label: TEACHER_SECTIONS.classroomAlternatives },
    { id: ID.references, label: SUBMODULE_TEXT.references },
  ];
}

/**
 * Lesson plan whose parts are all pending: shows the structure of the session
 * (introduction → explanation → activities → discussion → demonstrations →
 * assessment) until the team adds the verified plan. Nothing is generated.
 */
const PENDING_LESSON_PLAN: LessonPlan = {
  introduction: null,
  suggestedExplanation: null,
  classroomActivities: null,
  discussionQuestions: null,
  experimentsOrDemonstrations: null,
  assessmentMethods: null,
  expectedOutcomes: null,
};

function collectSources(content: TeacherSubmodule): string[] {
  return [
    ...(content.sourceIds ?? []),
    ...(content.geographicalRecommendations ?? []).flatMap((item) => item.location.sourceIds ?? []),
    ...(content.fieldTrips ?? []).flatMap((trip) => trip.location.sourceIds ?? []),
  ];
}

interface TeacherSubmoduleViewProps {
  topic: Topic;
  submodule: Submodule;
  module: TeacherModule;
  content: TeacherSubmodule;
}

/** "Enseñar" view of a submodule (teaching guide). All teacher content is null-safe. */
export function TeacherSubmoduleView({ topic, submodule, content }: TeacherSubmoduleViewProps) {
  const { LOCATION_TEXT, TEACHER_SECTIONS, EDUCATION_LEVEL_LABELS, NAV_LABELS } = useMessages();
  const { getStudentSubmodule } = useData();
  const comparison = getStudentSubmodule(content.key)?.comparison ?? null;
  const firstPair = comparison?.pairIds.find(isPairId) ?? null;
  const { referenceLocation } = useReferenceLocation();
  const recommendations = content.geographicalRecommendations;
  const recommendationsState = getDataState(recommendations);

  return (
    <>
      <section id={ID.general} className="content-section submodule-section" aria-labelledby={`${ID.general}-titulo`}>
        <h2 id={`${ID.general}-titulo`} className="content-section__title" data-section-heading="">
          {TEACHER_SECTIONS.general}
        </h2>
        <FieldList
          fields={[
            { label: TEACHER_SECTIONS.topicName, value: topic.name },
            { label: TEACHER_SECTIONS.submoduleName, value: submodule.title },
            { label: TEACHER_SECTIONS.gradeLevel, value: EDUCATION_LEVEL_LABELS[content.level] },
            { label: TEACHER_SECTIONS.estimatedDuration, value: content.estimatedDuration },
            {
              label: TEACHER_SECTIONS.learningObjectives,
              value: content.learningObjectives ? <TextList items={content.learningObjectives} /> : null,
            },
            {
              label: TEACHER_SECTIONS.priorKnowledge,
              value: content.priorKnowledge ? <TextList items={content.priorKnowledge} /> : null,
            },
            {
              label: TEACHER_SECTIONS.requiredMaterials,
              value: content.requiredMaterials ? <TextList items={content.requiredMaterials} /> : null,
            },
          ]}
        />
      </section>

      <section id={ID.lessonPlan} className="content-section submodule-section" aria-labelledby={`${ID.lessonPlan}-titulo`}>
        <h2 id={`${ID.lessonPlan}-titulo`} className="content-section__title" data-section-heading="">
          {TEACHER_SECTIONS.lessonPlan}
        </h2>
        <LessonPlanView plan={content.lessonPlan ?? PENDING_LESSON_PLAN} />
      </section>

      <NullableSection id={ID.activities} title={TEACHER_SECTIONS.activities} data={content.activities} className="submodule-section">
        {(activities) => (
          <>
            <ClassroomActivityList activities={activities} />
            {comparison ? (
              <aside className="explore-callout explore-callout--teacher">
                <h3 className="explore-callout__title">{TEACHER_SECTIONS.playground}</h3>
                <p>{TEACHER_SECTIONS.playgroundText}</p>
                <Link className="button button--primary" to={playgroundLink({ pair: firstPair, axis: comparison.axisId })}>
                  {NAV_LABELS.playground} →
                </Link>
              </aside>
            ) : null}
          </>
        )}
      </NullableSection>

      <section
        id={ID.recommendations}
        className="content-section submodule-section"
        aria-labelledby={`${ID.recommendations}-titulo`}
        data-state={recommendationsState}
      >
        <h2 id={`${ID.recommendations}-titulo`} className="content-section__title" data-section-heading="">
          {TEACHER_SECTIONS.geographicalRecommendations}
        </h2>
        <ReferenceLocationCard />
        {recommendations && recommendationsState === 'available' ? (
          <>
            <LocationMap locations={recommendations.map((item) => item.location)} referenceLocation={referenceLocation} />
            <ul className="card-list">
              {recommendations.map((item) => (
                <li key={item.location.id}>
                  <LocationDetails
                    location={item.location}
                    relationToTopic={item.relationToTopic}
                    showDistance
                    extraFields={[
                      {
                        label: LOCATION_TEXT.suggestedActivities,
                        value: item.suggestedActivities ? <TextList items={item.suggestedActivities} /> : null,
                      },
                    ]}
                  />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <DataStateMessage state={recommendationsState === 'available' ? 'empty' : recommendationsState} />
        )}
      </section>

      <NullableSection id={ID.fieldTrips} title={TEACHER_SECTIONS.fieldTrips} data={content.fieldTrips} className="submodule-section">
        {(trips) => (
          <ul className="card-list">
            {trips.map((trip) => (
              <li key={trip.id}>
                <LocationDetails
                  location={trip.location}
                  showDistance
                  extraFields={[
                    {
                      label: LOCATION_TEXT.fieldTripActivities,
                      value: trip.activities ? <TextList items={trip.activities} /> : null,
                    },
                    { label: LOCATION_TEXT.accessibility, value: trip.accessibilityInfo },
                    { label: LOCATION_TEXT.safety, value: trip.safetyInfo },
                    {
                      label: LOCATION_TEXT.materials,
                      value: trip.requiredMaterials ? <TextList items={trip.requiredMaterials} /> : null,
                    },
                  ]}
                />
              </li>
            ))}
          </ul>
        )}
      </NullableSection>

      <NullableSection
        id={ID.alternatives}
        title={TEACHER_SECTIONS.classroomAlternatives}
        data={content.classroomAlternatives}
        className="submodule-section"
      >
        {(alternatives) => <ClassroomAlternativesView alternatives={alternatives} />}
      </NullableSection>

      <SubmoduleReferences id={ID.references} sourceIds={collectSources(content)} />
    </>
  );
}
