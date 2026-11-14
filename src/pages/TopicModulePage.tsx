import { PageHeader } from '../components/layout/PageHeader';
import { StudentModuleView } from '../components/modules/StudentModuleView';
import { TeacherModuleView } from '../components/modules/TeacherModuleView';
import { TopicBanner } from '../components/modules/TopicBanner';
import { TopicTabs } from '../components/modules/TopicTabs';
import { SubmoduleList } from '../components/portal/TopicRow';
import { TopicPager } from '../components/portal/TopicPager';
import { PORTAL_TEXT, UI } from '../content/strings';
import { TOPIC_VISUALS, topicStyle } from '../content/topicVisuals';
import { getStudentModule, getSubmodulesByTopic, getTeacherModule, getTopicById, isTopicId } from '../data';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Link } from '../router/Link';
import { ROUTES } from '../router/routes';

/** A topic: banner, its submodules, then the "Aprender" / "Enseñar" tabs. */
export function TopicModulePage({ topicId }: { topicId: string }) {
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
          </>
        }
      />
      <div className="container page-body" style={topicStyle(topic.id)}>
        {submodules.length > 0 ? (
          <section className="topic-submodules" aria-labelledby="submodulos-titulo">
            <h2 id="submodulos-titulo" className="section-title">
              {PORTAL_TEXT.submodulesTitle}
            </h2>
            <SubmoduleList submodules={submodules} label={`${PORTAL_TEXT.submodulesTitle}: ${topic.name}`} />
          </section>
        ) : null}

        <TopicTabs
          idPrefix={`tema-${topic.id}`}
          renderPanel={(tab) =>
            tab === 'learn' ? (
              <StudentModuleView module={getStudentModule(topic.id)} />
            ) : (
              <TeacherModuleView topic={topic} module={getTeacherModule(topic.id)} />
            )
          }
        />
        <TopicPager currentId={topic.id} />
      </div>
    </>
  );
}
