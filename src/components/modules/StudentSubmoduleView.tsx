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
import { SubmodulePhoto } from './SubmodulePhoto';
import { getPair, isPairId } from '../../data/lunarAnalogs';
import { playgroundLink } from '../../data/playground';
import { Link } from '../../router/Link';
import { KnowledgeCheck } from '../lesson/KnowledgeCheck';
import { LessonComparison } from '../lesson/LessonComparison';
import { LessonVisual } from '../lesson/LessonVisual';
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
  quiz: 'comprueba',
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
    ...(content.knowledgeCheck && content.knowledgeCheck.length > 0 ? [{ id: ID.quiz, label: STUDENT_SECTIONS.knowledgeCheck }] : []),
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
  const lessonPairs = (content.comparison?.pairIds ?? []).filter(isPairId).map(getPair);
  const firstPair = lessonPairs[0];
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
            className={`content-section submodule-section submodule-block${block.imageId && !block.visual ? ' submodule-block--media' : ''}${
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
              {block.imageId && !block.visual ? <SubmodulePhoto imageId={block.imageId} topicId={submodule.topicId} /> : null}
            </div>
            {block.visual ? (
              <LessonVisual
                kind={block.visual}
                pairs={block.visualPairId && isPairId(block.visualPairId) ? [getPair(block.visualPairId)] : lessonPairs}
              />
            ) : null}
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
        data={content.comparison}
        className="submodule-section"
      >
        {(comparison) => <LessonComparison comparison={comparison} />}
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

      {content.knowledgeCheck && content.knowledgeCheck.length > 0 ? (
        <section id={ID.quiz} className="content-section submodule-section" aria-labelledby={`${ID.quiz}-titulo`}>
          <h2 id={`${ID.quiz}-titulo`} className="content-section__title" data-section-heading="">
            {STUDENT_SECTIONS.knowledgeCheck}
          </h2>
          <KnowledgeCheck questions={content.knowledgeCheck} />
        </section>
      ) : null}

      <NullableSection id={ID.conclusion} title={STUDENT_SECTIONS.conclusion} data={content.conclusion} className="submodule-section">
        {(text) => (
          <>
            <div className="submodule-prose submodule-conclusion">
              <Paragraphs text={text} />
            </div>
            {content.comparison ? (
              <aside className="explore-callout">
                <h3 className="explore-callout__title">{STUDENT_SECTIONS.exploreTitle}</h3>
                <p>{STUDENT_SECTIONS.exploreText}</p>
                <Link className="button button--primary" to={playgroundLink({ pair: firstPair?.id ?? null, axis: content.comparison.axisId })}>
                  Starman Playground →
                </Link>
              </aside>
            ) : null}
          </>
        )}
      </NullableSection>

      <SubmoduleReferences id={ID.references} sourceIds={collectSources(content)} />
    </>
  );
}
