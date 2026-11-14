import { LOCATION_TEXT, TEACHER_SECTIONS } from '../../content/strings';
import { useReferenceLocation } from '../../hooks/useReferenceLocation';
import type { TeacherModule, Topic } from '../../types';
import { getDataState } from '../../utils/nullable';
import { DataStateMessage } from '../common/DataStateMessage';
import { FieldList } from '../common/FieldList';
import { NullableSection } from '../common/NullableSection';
import { TextList } from '../common/TextList';
import { LocationDetails } from '../maps/LocationDetails';
import { LocationMap } from '../maps/LocationMap';
import { ReferenceLocationCard } from '../maps/ReferenceLocationCard';
import { ClassroomActivityList } from './ClassroomActivityList';
import { ClassroomAlternativesView } from './ClassroomAlternativesView';
import { LessonPlanView } from './LessonPlanView';
import { SectionNav } from './SectionNav';

const SECTIONS = [
  { id: 'informacion-general', label: TEACHER_SECTIONS.general },
  { id: 'plan-de-clase', label: TEACHER_SECTIONS.lessonPlan },
  { id: 'actividades', label: TEACHER_SECTIONS.activities },
  { id: 'recomendaciones-geograficas', label: TEACHER_SECTIONS.geographicalRecommendations },
  { id: 'excursiones', label: TEACHER_SECTIONS.fieldTrips },
  { id: 'alternativas', label: TEACHER_SECTIONS.classroomAlternatives },
];

interface TeacherModuleViewProps {
  topic: Topic;
  module: TeacherModule;
}

/** Teacher view of a topic. All teacher content is null-safe. */
export function TeacherModuleView({ topic, module }: TeacherModuleViewProps) {
  const { referenceLocation } = useReferenceLocation();
  const recommendations = module.geographicalRecommendations;
  const recommendationsState = getDataState(recommendations);

  return (
    <div className="module-view module-view--teacher">
      <SectionNav sections={SECTIONS} />

      <div className="module-view__sections">
        <section id="informacion-general" className="content-section" aria-labelledby="informacion-general-titulo">
          <h2 id="informacion-general-titulo" className="content-section__title">
            {TEACHER_SECTIONS.general}
          </h2>
          <FieldList
            fields={[
              { label: TEACHER_SECTIONS.topicName, value: topic.name },
              { label: TEACHER_SECTIONS.description, value: topic.description },
              { label: TEACHER_SECTIONS.gradeLevel, value: module.gradeLevel },
              { label: TEACHER_SECTIONS.estimatedDuration, value: module.estimatedDuration },
              {
                label: TEACHER_SECTIONS.learningObjectives,
                value: module.learningObjectives ? <TextList items={module.learningObjectives} /> : null,
              },
              {
                label: TEACHER_SECTIONS.requiredMaterials,
                value: module.requiredMaterials ? <TextList items={module.requiredMaterials} /> : null,
              },
            ]}
          />
        </section>

        <NullableSection id="plan-de-clase" title={TEACHER_SECTIONS.lessonPlan} data={module.lessonPlan}>
          {(plan) => <LessonPlanView plan={plan} />}
        </NullableSection>

        <NullableSection id="actividades" title={TEACHER_SECTIONS.activities} data={module.activities}>
          {(activities) => <ClassroomActivityList activities={activities} />}
        </NullableSection>

        <section
          id="recomendaciones-geograficas"
          className="content-section"
          aria-labelledby="recomendaciones-geograficas-titulo"
          data-state={recommendationsState}
        >
          <h2 id="recomendaciones-geograficas-titulo" className="content-section__title">
            {TEACHER_SECTIONS.geographicalRecommendations}
          </h2>
          <ReferenceLocationCard />
          {recommendations && recommendationsState === 'available' ? (
            <>
              <LocationMap
                locations={recommendations.map((item) => item.location)}
                referenceLocation={referenceLocation}
              />
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

        <NullableSection id="excursiones" title={TEACHER_SECTIONS.fieldTrips} data={module.fieldTrips}>
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
          id="alternativas"
          title={TEACHER_SECTIONS.classroomAlternatives}
          data={module.classroomAlternatives}
        >
          {(alternatives) => <ClassroomAlternativesView alternatives={alternatives} />}
        </NullableSection>
      </div>
    </div>
  );
}
