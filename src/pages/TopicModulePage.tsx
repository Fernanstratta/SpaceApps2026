import { PageHeader } from '../components/layout/PageHeader';
import { MissionCallout } from '../components/mission/MissionCallout';
import { StudentModuleIntro, TeacherModuleIntro } from '../components/modules/ModuleIntro';
import { TopicBanner } from '../components/modules/TopicBanner';
import { SubmoduleCarousel } from '../components/portal/SubmoduleCarousel';
import { TopicPager } from '../components/portal/TopicPager';
import { TOPIC_VISUALS, topicStyle } from '../content/topicVisuals';
import { submoduleKey } from '../data/submodules';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { usePortalView } from '../hooks/usePortalView';
import { useData, useMessages } from '../i18n/I18nContext';
import { Link } from '../router/Link';
import { ROUTES } from '../router/routes';

/**
 * A topic ("módulo"): banner with its photo, tagline and explanatory
 * paragraph, then its submodules. The active view (see `PortalViewContext`)
 * picks the content: "Enseñar" adds the topic's teaching sheet and opens each
 * submodule's teaching guide.
 */
export function TopicModulePage({ topicId }: { topicId: string }) {
  const { view } = usePortalView();
  const { PORTAL_TEXT, MODULE_TEXT, UI } = useMessages();
  const { getStudentModule, getSubmodulesByTopic, getTeacherModule, getTeacherSubmodule, getTopicById, isTopicId } =
    useData();
  const topic = isTopicId(topicId) ? getTopicById(topicId) : null;
  useDocumentTitle(topic ? topic.name : PORTAL_TEXT.topicNotFoundTitle);

  if (!topic) {
    return (
      <>
        <PageHeader title={PORTAL_TEXT.topicNotFoundTitle} lead={PORTAL_TEXT.topicNotFoundBody} />
        <div className="container page-body">
          <Link to={ROUTES.portal} className="button button--primary">
            {UI.backToTopics}
          </Link>
        </div>
      </>
    );
  }

  const submodules = getSubmodulesByTopic(topic.id);

  return (
    <>
      <TopicBanner
        topicId={topic.id}
        title={topic.name}
        lead={topic.description}
        imageId={TOPIC_VISUALS[topic.id].coverImageId}
        eyebrow={
          <>
            <Link to={ROUTES.portal} className="banner-back">
              ← {UI.backToTopics}
            </Link>
            <span className="banner-tag">
              {PORTAL_TEXT.topicNumber} {String(topic.order).padStart(2, '0')}
            </span>
            <span className="banner-tag">{MODULE_TEXT.submoduleCount(submodules.length)}</span>
          </>
        }
      />
      <div className="container page-body topic-page" style={topicStyle(topic.id)}>
        {view === 'learn' ? (
          <StudentModuleIntro module={getStudentModule(topic.id)} />
        ) : (
          <TeacherModuleIntro module={getTeacherModule(topic.id)} />
        )}

        <MissionCallout topicId={topic.id} view={view} />

        <section className="topic-submodules" aria-labelledby="submodulos-titulo">
          <div className="topic-submodules__header">
            <h2 id="submodulos-titulo" className="topic-submodules__title">
              {PORTAL_TEXT.submodulesTitle}
            </h2>
            <p className="topic-submodules__intro">
              {view === 'learn' ? MODULE_TEXT.submodulesLearnIntro : MODULE_TEXT.submodulesTeachIntro}
            </p>
          </div>
          {submodules.length > 0 ? (
            <SubmoduleCarousel
              submodules={submodules}
              label={`${PORTAL_TEXT.submodulesTitle}: ${topic.name}`}
              view={view}
              getMeta={
                view === 'teach' ? (item) => getTeacherSubmodule(submoduleKey(item))?.estimatedDuration ?? null : undefined
              }
            />
          ) : (
            <p className="data-state data-state--empty">{UI.empty}</p>
          )}
        </section>

        <TopicPager currentId={topic.id} />
      </div>
    </>
  );
}
