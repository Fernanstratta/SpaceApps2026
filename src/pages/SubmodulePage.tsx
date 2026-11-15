import { PageHeader } from '../components/layout/PageHeader';
import { StudentSubmoduleView, studentSubmoduleSections } from '../components/modules/StudentSubmoduleView';
import { TeacherSubmoduleView, teacherSubmoduleSections } from '../components/modules/TeacherSubmoduleView';
import { SubmoduleCarousel } from '../components/portal/SubmoduleCarousel';
import { SubmoduleHeader } from '../components/submodule/SubmoduleHeader';
import { SubmoduleLayout } from '../components/submodule/SubmoduleLayout';
import { SubmodulePager } from '../components/submodule/SubmodulePager';
import { topicStyle } from '../content/topicVisuals';
import { submoduleKey } from '../data/submodules';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { usePortalView } from '../hooks/usePortalView';
import { useData, useMessages } from '../i18n/I18nContext';
import { Link } from '../router/Link';
import { ROUTES } from '../router/routes';

const SUBMODULES_ID = 'submodulos';

/**
 * A submodule. Same shell in both views — header, collapsible sidebar and
 * reading column — while the content follows the active view (see
 * `PortalViewContext`): the student lesson or the teacher's teaching guide.
 */
export function SubmodulePage({ topicId, submoduleId }: { topicId: string; submoduleId: string }) {
  const { view } = usePortalView();
  const messages = useMessages();
  const { PORTAL_TEXT, SUBMODULE_TEXT, UI } = messages;
  const {
    getStudentSubmodule,
    getSubmodule,
    getSubmodulesByTopic,
    getTeacherModule,
    getTeacherSubmodule,
    getTopicById,
    isTopicId,
  } = useData();
  const topic = isTopicId(topicId) ? getTopicById(topicId) : null;
  const submodule = topic ? getSubmodule(topic.id, submoduleId) : undefined;
  useDocumentTitle(topic && submodule ? `${submodule.title} · ${topic.name}` : SUBMODULE_TEXT.notFoundTitle);

  const key = submodule ? submoduleKey(submodule) : null;
  const studentContent = key && view === 'learn' ? getStudentSubmodule(key) : undefined;
  const teacherContent = key && view === 'teach' ? getTeacherSubmodule(key) : undefined;

  if (!topic || !submodule || (!studentContent && !teacherContent)) {
    return (
      <>
        <PageHeader title={SUBMODULE_TEXT.notFoundTitle} lead={SUBMODULE_TEXT.notFoundBody} />
        <div className="container page-body button-row">
          {topic ? (
            <Link to={ROUTES.topic(topic.id)} className="button button--primary">
              {SUBMODULE_TEXT.backToTopic(topic.name)}
            </Link>
          ) : null}
          <Link to={ROUTES.portal} className={`button ${topic ? 'button--secondary' : 'button--primary'}`}>
            {UI.backToTopics}
          </Link>
        </div>
      </>
    );
  }

  const siblings = getSubmodulesByTopic(topic.id);
  const sections = [
    ...(studentContent ? studentSubmoduleSections(studentContent, messages) : teacherSubmoduleSections(messages)),
    { id: SUBMODULES_ID, label: SUBMODULE_TEXT.submodules },
  ];

  return (
    <>
      <SubmoduleHeader topic={topic} submodule={submodule} total={siblings.length} />
      <div className="container page-body submodule-page" style={topicStyle(topic.id)}>
        <SubmoduleLayout sections={sections} topicId={topic.id} submoduleId={submodule.id}>
          {studentContent ? <StudentSubmoduleView submodule={submodule} content={studentContent} /> : null}
          {teacherContent ? (
            <TeacherSubmoduleView
              topic={topic}
              submodule={submodule}
              module={getTeacherModule(topic.id)}
              content={teacherContent}
            />
          ) : null}

          <section
            id={SUBMODULES_ID}
            className="content-section submodule-section"
            aria-labelledby={`${SUBMODULES_ID}-titulo`}
          >
            <h2 id={`${SUBMODULES_ID}-titulo`} className="content-section__title" data-section-heading="">
              {SUBMODULE_TEXT.submodules}
            </h2>
            <SubmoduleCarousel
              submodules={siblings}
              label={`${PORTAL_TEXT.submodulesTitle}: ${topic.name}`}
              view={view}
              currentId={submodule.id}
              getMeta={
                view === 'teach' ? (item) => getTeacherSubmodule(submoduleKey(item))?.estimatedDuration ?? null : undefined
              }
            />
          </section>

          <SubmodulePager topic={topic} submodules={siblings} current={submodule} />
        </SubmoduleLayout>
      </div>
    </>
  );
}
