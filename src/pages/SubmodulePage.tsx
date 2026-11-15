import { NullableSection } from '../components/common/NullableSection';
import { PageHeader } from '../components/layout/PageHeader';
import { TopicBanner } from '../components/modules/TopicBanner';
import { SubmoduleList } from '../components/portal/TopicRow';
import { topicStyle } from '../content/topicVisuals';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Link } from '../router/Link';
import { ROUTES } from '../router/routes';
import { useMessages, useData } from '../i18n/I18nContext';

/** A submodule: banner with its photo, its (pending) content and sibling modules. */
export function SubmodulePage({ topicId, submoduleId }: { topicId: string; submoduleId: string }) {
  const { PORTAL_TEXT, SUBMODULE_TEXT, UI } = useMessages();
  const { getSubmodule, getSubmodulesByTopic, getTopicById, isTopicId } = useData();
  const topic = isTopicId(topicId) ? getTopicById(topicId) : null;
  const submodule = topic ? getSubmodule(topic.id, submoduleId) : undefined;
  useDocumentTitle(submodule ? submodule.title : SUBMODULE_TEXT.notFoundTitle);

  if (!topic || !submodule) {
    return (
      <>
        <PageHeader title={SUBMODULE_TEXT.notFoundTitle} lead={SUBMODULE_TEXT.notFoundBody} />
        <div className="container page-body">
          <Link to={ROUTES.portal} className="button button--primary">
            {UI.backToTopics}
          </Link>
        </div>
      </>
    );
  }

  const siblings = getSubmodulesByTopic(topic.id).filter((item) => item.id !== submodule.id);

  return (
    <>
      <TopicBanner
        topicId={topic.id}
        title={submodule.title}
        imageId={submodule.imageId}
        eyebrow={
          <>
            <Link to={ROUTES.topic(topic.id)} className="banner-back">
              ← {topic.name}
            </Link>
            <span className="banner-tag">{submodule.tag}</span>
          </>
        }
      />
      <div className="container page-body submodule-page" style={topicStyle(topic.id)}>
        <NullableSection id="contenido-modulo" title={SUBMODULE_TEXT.contentTitle} data={submodule.summary}>
          {(text) => <p>{text}</p>}
        </NullableSection>

        <Link to={ROUTES.topic(topic.id)} className="button button--topic">
          {SUBMODULE_TEXT.backToTopic(topic.name)}
        </Link>

        {siblings.length > 0 ? (
          <section className="topic-submodules" aria-labelledby="otros-modulos">
            <h2 id="otros-modulos" className="section-title">
              {SUBMODULE_TEXT.otherInTopic}
            </h2>
            <SubmoduleList submodules={siblings} label={`${PORTAL_TEXT.submodulesTitle}: ${topic.name}`} />
          </section>
        ) : null}
      </div>
    </>
  );
}
