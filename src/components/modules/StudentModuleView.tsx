import type { StudentModule } from '../../types';
import { getDataState } from '../../utils/nullable';
import { NullableSection } from '../common/NullableSection';
import { TextList } from '../common/TextList';
import { LocationDetails } from '../maps/LocationDetails';
import { LocationMap } from '../maps/LocationMap';
import { useMessages } from '../../i18n/I18nContext';
import { CelestialBodyPanel } from './CelestialBodyPanel';
import { ComparisonTable } from './ComparisonTable';
import { SectionNav } from './SectionNav';

/** Ids de las secciones (anclas) del lado del estudiante. */
const sectionsFor = (STUDENT_SECTIONS: ReturnType<typeof useMessages>['STUDENT_SECTIONS']) => [
  { id: 'introduccion', label: STUDENT_SECTIONS.introduction },
  { id: 'conceptos', label: STUDENT_SECTIONS.scientificConcepts },
  { id: 'tierra-luna', label: STUDENT_SECTIONS.bodies },
  { id: 'comparaciones', label: STUDENT_SECTIONS.comparisons },
  { id: 'ubicaciones', label: STUDENT_SECTIONS.relatedLocations },
  { id: 'datos', label: STUDENT_SECTIONS.additionalFacts },
  { id: 'actividades', label: STUDENT_SECTIONS.learningActivities },
];

/** Student view of a topic. Every section is null-safe. */
export function StudentModuleView({ module }: { module: StudentModule }) {
  const { STUDENT_SECTIONS, LEARNING_ACTIVITY_TYPE_LABELS } = useMessages();
  const bodiesState =
    getDataState(module.earthInformation) === 'pending' &&
    getDataState(module.moonInformation) === 'pending'
      ? 'pending'
      : 'available';

  return (
    <div className="module-view module-view--student">
      <SectionNav sections={sectionsFor(STUDENT_SECTIONS)} />

      <div className="module-view__sections">
        <NullableSection id="introduccion" title={STUDENT_SECTIONS.introduction} data={module.introduction}>
          {(text) => <p>{text}</p>}
        </NullableSection>

        <NullableSection
          id="conceptos"
          title={STUDENT_SECTIONS.scientificConcepts}
          data={module.scientificConcepts}
        >
          {(concepts) => (
            <dl className="concept-list">
              {concepts.map((concept) => (
                <div key={concept.id} className="concept-list__item">
                  <dt>{concept.term}</dt>
                  <dd>{concept.definition}</dd>
                </div>
              ))}
            </dl>
          )}
        </NullableSection>

        <section id="tierra-luna" className="content-section" aria-labelledby="tierra-luna-titulo" data-state={bodiesState}>
          <h2 id="tierra-luna-titulo" className="content-section__title">
            {STUDENT_SECTIONS.bodies}
          </h2>
          <div className="body-grid">
            <CelestialBodyPanel body="earth" title={STUDENT_SECTIONS.earth} information={module.earthInformation} />
            <CelestialBodyPanel body="moon" title={STUDENT_SECTIONS.moon} information={module.moonInformation} />
          </div>
        </section>

        <NullableSection id="comparaciones" title={STUDENT_SECTIONS.comparisons} data={module.comparisons}>
          {(comparisons) => <ComparisonTable comparisons={comparisons} />}
        </NullableSection>

        <NullableSection
          id="ubicaciones"
          title={STUDENT_SECTIONS.relatedLocations}
          data={module.relatedLocations}
        >
          {(related) => (
            <>
              <LocationMap locations={related.map((item) => item.location)} />
              <ul className="card-list">
                {related.map((item) => (
                  <li key={item.location.id}>
                    <LocationDetails location={item.location} relationToTopic={item.relationToTopic} />
                  </li>
                ))}
              </ul>
            </>
          )}
        </NullableSection>

        <NullableSection id="datos" title={STUDENT_SECTIONS.additionalFacts} data={module.additionalFacts}>
          {(facts) => <TextList items={facts} />}
        </NullableSection>

        <NullableSection
          id="actividades"
          title={STUDENT_SECTIONS.learningActivities}
          data={module.learningActivities}
        >
          {(activities) => (
            <ul className="card-list">
              {activities.map((activity) => (
                <li key={activity.id}>
                  <article className="activity-card">
                    <p className="activity-card__type">{LEARNING_ACTIVITY_TYPE_LABELS[activity.type]}</p>
                    <h3 className="activity-card__title">{activity.title}</h3>
                    <p>{activity.description}</p>
                    {activity.estimatedMinutes !== null ? (
                      <p className="activity-card__meta">{activity.estimatedMinutes} min</p>
                    ) : null}
                  </article>
                </li>
              ))}
            </ul>
          )}
        </NullableSection>
      </div>
    </div>
  );
}

