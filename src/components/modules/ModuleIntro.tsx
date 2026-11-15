import type { ReactNode } from 'react';
import type { StudentModule, TeacherModule } from '../../types';
import { getDataState } from '../../utils/nullable';
import { DataStateMessage } from '../common/DataStateMessage';
import { FieldList } from '../common/FieldList';
import { Paragraphs } from '../common/Paragraphs';
import { TextList } from '../common/TextList';
import { useMessages } from '../../i18n/I18nContext';

interface ModuleIntroProps {
  tagline: string | null;
  overview: string | null;
  aside?: ReactNode;
}

/** Tagline + explanatory paragraph of a topic, with an optional side panel. */
function ModuleIntro({ tagline, overview, aside }: ModuleIntroProps) {
  const { MODULE_TEXT } = useMessages();
  const overviewState = getDataState(overview);

  return (
    <section className={`module-intro${aside ? ' module-intro--with-aside' : ''}`} aria-labelledby="module-intro-title">
      <div className="module-intro__main">
        <h2 id="module-intro-title" className="module-intro__tagline">
          {tagline ?? MODULE_TEXT.aboutTopic}
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
  return <ModuleIntro tagline={module.tagline} overview={module.overview} />;
}

/** "Enseñar": same intro plus the topic's teaching sheet. */
export function TeacherModuleIntro({ module }: { module: TeacherModule }) {
  const { MODULE_TEXT, TEACHER_SECTIONS } = useMessages();
  return (
    <ModuleIntro
      tagline={module.tagline}
      overview={module.overview}
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
        </aside>
      }
    />
  );
}
