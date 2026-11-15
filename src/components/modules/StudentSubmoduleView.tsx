import type { StudentSubmodule, Submodule } from '../../types';
import { getDataState } from '../../utils/nullable';
import { DataStateMessage } from '../common/DataStateMessage';
import { NullableSection } from '../common/NullableSection';
import { Paragraphs } from '../common/Paragraphs';
import { LocationDetails } from '../maps/LocationDetails';
import { LocationMap } from '../maps/LocationMap';
import type { SubmoduleSectionLink } from '../submodule/SubmoduleLayout';
import { SubmoduleReferences } from '../submodule/SubmoduleReferences';
import { CelestialBodyPanel } from './CelestialBodyPanel';
import { ComparisonTable } from './ComparisonTable';
import { SubmodulePhoto } from './SubmodulePhoto';
import { useMessages } from '../../i18n/I18nContext';

type Messages = ReturnType<typeof useMessages>;

const ID = {
  introduction: 'introduccion',
  development: 'desarrollo',
  concepts: 'conceptos',
  bodies: 'tierra-luna',
  comparison: 'comparacion',
  locations: 'lugares',
  facts: 'datos',
  activities: 'actividades',
  conclusion: 'conclusion',
  references: 'referencias',
} as const;

const blockId = (id: string) => `tema-${id}`;

/** Sections of the "Aprender" view, in reading order (for "En esta página"). */
export function studentSubmoduleSections(
  content: StudentSubmodule,
  { STUDENT_SECTIONS, SUBMODULE_TEXT }: Messages,
): SubmoduleSectionLink[] {
  const blocks =
    content.blocks && content.blocks.length > 0
      ? content.blocks.map((block) => ({ id: blockId(block.id), label: block.title }))
      : [{ id: ID.development, label: STUDENT_SECTIONS.development }];

  return [
    { id: ID.introduction, label: STUDENT_SECTIONS.introduction },
    ...blocks,
    { id: ID.concepts, label: STUDENT_SECTIONS.scientificConcepts },
    { id: ID.bodies, label: STUDENT_SECTIONS.bodies },
    { id: ID.comparison, label: STUDENT_SECTIONS.comparisons },
    { id: ID.locations, label: STUDENT_SECTIONS.relatedLocations },
    { id: ID.facts, label: STUDENT_SECTIONS.additionalFacts },
    { id: ID.activities, label: STUDENT_SECTIONS.learningActivities },
    { id: ID.conclusion, label: STUDENT_SECTIONS.conclusion },
    { id: ID.references, label: SUBMODULE_TEXT.references },
  ];
}

/** Every resource cited anywhere in the submodule. */
function collectSources(content: StudentSubmodule): string[] {
  return [
    ...(content.sourceIds ?? []),
    ...(content.earthInformation?.sourceIds ?? []),
    ...(content.moonInformation?.sourceIds ?? []),
    ...(content.comparisons ?? []).flatMap((comparison) => comparison.sourceIds),
    ...(content.relatedLocations ?? []).flatMap((item) => item.location.sourceIds ?? []),
  ];
}

interface StudentSubmoduleViewProps {
  submodule: Submodule;
  content: StudentSubmodule;
}

/**
 * "Aprender" view of a submodule: introduction with its related photo, "Tema"
 * blocks, comparison, conclusion and references. Every section is null-safe.
 */
export function StudentSubmoduleView({ submodule, content }: StudentSubmoduleViewProps) {
  const { STUDENT_SECTIONS, LEARNING_ACTIVITY_TYPE_LABELS } = useMessages();
  const introductionState = getDataState(content.introduction);
  const bodiesState =
    getDataState(content.earthInformation) === 'pending' && getDataState(content.moonInformation) === 'pending'
      ? 'pending'
      : 'available';

  return (
    <>
      <section
        id={ID.introduction}
        className="content-section submodule-section"
        aria-labelledby={`${ID.introduction}-titulo`}
        data-state={introductionState}
      >
        <h2 id={`${ID.introduction}-titulo`} className="content-section__title" data-section-heading="">
          {STUDENT_SECTIONS.introduction}
        </h2>
        <SubmodulePhoto imageId={submodule.imageId} topicId={submodule.topicId} wide />
        {content.introduction && introductionState === 'available' ? (
          <div className="submodule-prose submodule-prose--lead">
            <Paragraphs text={content.introduction} />
          </div>
        ) : (
          <DataStateMessage state={introductionState === 'available' ? 'empty' : introductionState} />
        )}
      </section>

      {content.blocks && content.blocks.length > 0 ? (
        content.blocks.map((block, index) => (
          <section
            key={block.id}
            id={blockId(block.id)}
            className={`content-section submodule-section submodule-block${block.imageId ? ' submodule-block--media' : ''}${
              index % 2 === 1 ? ' submodule-block--reverse' : ''
            }`}
            aria-labelledby={`${blockId(block.id)}-titulo`}
          >
            <h2 id={`${blockId(block.id)}-titulo`} className="content-section__title" data-section-heading="">
              {block.title}
            </h2>
            <div className="submodule-block__content">
              <div className="submodule-prose">
                <Paragraphs text={block.body} />
              </div>
              {block.imageId ? <SubmodulePhoto imageId={block.imageId} topicId={submodule.topicId} /> : null}
            </div>
          </section>
        ))
      ) : (
        <NullableSection id={ID.development} title={STUDENT_SECTIONS.development} data={content.blocks} className="submodule-section">
          {() => null}
        </NullableSection>
      )}

      <NullableSection
        id={ID.concepts}
        title={STUDENT_SECTIONS.scientificConcepts}
        data={content.scientificConcepts}
        className="submodule-section"
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

      <section
        id={ID.bodies}
        className="content-section submodule-section"
        aria-labelledby={`${ID.bodies}-titulo`}
        data-state={bodiesState}
      >
        <h2 id={`${ID.bodies}-titulo`} className="content-section__title" data-section-heading="">
          {STUDENT_SECTIONS.bodies}
        </h2>
        <div className="body-grid">
          <CelestialBodyPanel body="earth" title={STUDENT_SECTIONS.earth} information={content.earthInformation} />
          <CelestialBodyPanel body="moon" title={STUDENT_SECTIONS.moon} information={content.moonInformation} />
        </div>
      </section>

      <NullableSection
        id={ID.comparison}
        title={STUDENT_SECTIONS.comparisons}
        description={STUDENT_SECTIONS.comparisonsDescription}
        data={content.comparisons}
        className="submodule-section"
      >
        {(comparisons) => (
          <>
            <ComparisonTable comparisons={comparisons} />
            {comparisons.some((comparison) => comparison.explanation) ? (
              <ul className="comparison-notes">
                {comparisons
                  .filter((comparison) => comparison.explanation)
                  .map((comparison) => (
                    <li key={comparison.id}>
                      <strong>{comparison.label}:</strong> {comparison.explanation}
                    </li>
                  ))}
              </ul>
            ) : null}
          </>
        )}
      </NullableSection>

      <NullableSection
        id={ID.locations}
        title={STUDENT_SECTIONS.relatedLocations}
        data={content.relatedLocations}
        className="submodule-section"
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

      <NullableSection id={ID.facts} title={STUDENT_SECTIONS.additionalFacts} data={content.additionalFacts} className="submodule-section">
        {(facts) => (
          <ul className="fact-list">
            {facts.map((fact, index) => (
              <li key={`${index}-${fact}`} className="fact-list__item">
                {fact}
              </li>
            ))}
          </ul>
        )}
      </NullableSection>

      <NullableSection
        id={ID.activities}
        title={STUDENT_SECTIONS.learningActivities}
        data={content.learningActivities}
        className="submodule-section"
      >
        {(activities) => (
          <ul className="card-list card-list--grid">
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

      <NullableSection id={ID.conclusion} title={STUDENT_SECTIONS.conclusion} data={content.conclusion} className="submodule-section">
        {(text) => (
          <div className="submodule-prose submodule-conclusion">
            <Paragraphs text={text} />
          </div>
        )}
      </NullableSection>

      <SubmoduleReferences id={ID.references} sourceIds={collectSources(content)} />
    </>
  );
}
