import type { ReactNode } from 'react';
import type { StudentModule, TeacherModule } from '../../types';
import { getDataState } from '../../utils/nullable';
import { DataStateMessage } from '../common/DataStateMessage';
import { FieldList } from '../common/FieldList';
import { Paragraphs } from '../common/Paragraphs';
import { TextList } from '../common/TextList';
import { useMessages } from '../../i18n/I18nContext';
import { Link } from '../../router/Link';

interface ModuleIntroProps {
  tagline: string | null;
  overview: string | null;
  /** Heading used while `tagline` is pending. */
  fallbackTitle: string;
  aside?: ReactNode;
}

/** Tagline + explanatory paragraph of a topic, with an optional side panel. */
function ModuleIntro({ tagline, overview, fallbackTitle, aside }: ModuleIntroProps) {
  const overviewState = getDataState(overview);

  return (
    <section className={`module-intro${aside ? ' module-intro--with-aside' : ''}`} aria-labelledby="module-intro-title">
      <div className="module-intro__main">
        <h2 id="module-intro-title" className="module-intro__tagline">
          {tagline ?? fallbackTitle}
        </h2>
        {overview && overviewState === 'available' ? (
          <div className="module-intro__text">
            <Paragraphs text={overview} />
          </div>
        ) : (
          <DataStateMessage state={overviewState === 'available' ? 'empty' : overviewState} />
        )}
      </div>
      {aside}
    </section>
  );
}

/** "Aprender": tagline and paragraph for students. */
export function StudentModuleIntro({ module }: { module: StudentModule }) {
  const { MODULE_TEXT } = useMessages();
  return <ModuleIntro tagline={module.tagline} overview={module.overview} fallbackTitle={MODULE_TEXT.aboutTopic} />;
}

/** One session of the module's lesson sequence (one per submodule, in order). */
export interface LessonSession {
  id: string;
  title: string;
  to: string;
  duration: string | null;
}

/**
 * "Enseñar": the module plan — the teacher's own tagline and overview, the
 * teaching sheet (level, duration, objectives, materials) and the lesson
 * sequence that links to each submodule's lesson plan.
 */
export function TeacherModuleIntro({ module, sessions }: { module: TeacherModule; sessions: LessonSession[] }) {
  const { MODULE_TEXT, TEACHER_SECTIONS, UI } = useMessages();
  return (
    <ModuleIntro
      tagline={module.tagline}
      overview={module.overview}
      fallbackTitle={MODULE_TEXT.teacherPlanTitle}
      aside={
        <aside className="teacher-sheet" aria-labelledby="teacher-sheet-title">
          <h3 id="teacher-sheet-title" className="teacher-sheet__title">
            {MODULE_TEXT.teacherSheet}
          </h3>
          <FieldList
            fields={[
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
          {sessions.length > 0 ? (
            <div className="lesson-sequence">
              <h4 className="lesson-sequence__title">{MODULE_TEXT.lessonSequence}</h4>
              <p className="lesson-sequence__hint">{MODULE_TEXT.lessonSequenceHint}</p>
              <ol className="lesson-sequence__list">
                {sessions.map((session) => (
                  <li key={session.id} className="lesson-sequence__item">
                    <Link to={session.to} className="lesson-sequence__link">
                      {session.title}
                    </Link>
                    <span className={`lesson-sequence__duration${session.duration ? '' : ' is-pending'}`}>
                      {session.duration ?? UI.fieldPending}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
        </aside>
      }
    />
  );
}
