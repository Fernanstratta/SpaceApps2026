import type { LessonPlan } from '../../types';
import { NullableSection } from '../common/NullableSection';
import { TextList } from '../common/TextList';
import { ClassroomActivityList } from './ClassroomActivityList';
import { useMessages } from '../../i18n/I18nContext';

/** Renders a provided lesson plan. Never called with `null`. */
export function LessonPlanView({ plan }: { plan: LessonPlan }) {
  const { TEACHER_SECTIONS } = useMessages();
  return (
    <div className="subsection-stack">
      <NullableSection title={TEACHER_SECTIONS.lessonIntroduction} data={plan.introduction} headingLevel={3}>
        {(text) => <p>{text}</p>}
      </NullableSection>
      <NullableSection title={TEACHER_SECTIONS.suggestedExplanation} data={plan.suggestedExplanation} headingLevel={3}>
        {(text) => <p>{text}</p>}
      </NullableSection>
      <NullableSection title={TEACHER_SECTIONS.classroomActivities} data={plan.classroomActivities} headingLevel={3}>
        {(activities) => <ClassroomActivityList activities={activities} />}
      </NullableSection>
      <NullableSection title={TEACHER_SECTIONS.discussionQuestions} data={plan.discussionQuestions} headingLevel={3}>
        {(questions) => <TextList items={questions} ordered />}
      </NullableSection>
      <NullableSection title={TEACHER_SECTIONS.experiments} data={plan.experimentsOrDemonstrations} headingLevel={3}>
        {(demos) => (
          <ul className="card-list">
            {demos.map((demo) => (
              <li key={demo.id}>
                <article className="activity-card">
                  <h4 className="activity-card__title">{demo.title}</h4>
                  <p>{demo.description}</p>
                  {demo.materials && demo.materials.length > 0 ? <TextList items={demo.materials} /> : null}
                  {demo.safetyNotes ? <p className="activity-card__meta">{demo.safetyNotes}</p> : null}
                </article>
              </li>
            ))}
          </ul>
        )}
      </NullableSection>
      <NullableSection title={TEACHER_SECTIONS.assessment} data={plan.assessmentMethods} headingLevel={3}>
        {(methods) => <TextList items={methods} />}
      </NullableSection>
    </div>
  );
}
