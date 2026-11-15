import { useId, useState } from 'react';
import { useMessages } from '../../i18n/I18nContext';
import type { QuizQuestion } from '../../types';

function Question({ question, index, total }: { question: QuizQuestion; index: number; total: number }) {
  const { STUDENT_SECTIONS } = useMessages();
  const [chosen, setChosen] = useState<number | null>(null);
  const name = useId();
  const answered = chosen !== null;
  const correct = chosen === question.answerIndex;
  return (
    <fieldset className={`quiz-question${answered ? (correct ? ' is-correct' : ' is-wrong') : ''}`}>
      <legend className="quiz-question__legend">
        <span className="quiz-question__number">{STUDENT_SECTIONS.quizQuestion(index + 1, total)}</span>
        {question.question}
      </legend>
      <ul className="quiz-question__options">
        {question.options.map((option, optionIndex) => {
          const state = !answered ? '' : optionIndex === question.answerIndex ? ' is-answer' : optionIndex === chosen ? ' is-chosen' : '';
          return (
            <li key={option}>
              <label className={`quiz-option${state}`}>
                <input
                  type="radio"
                  name={name}
                  value={optionIndex}
                  checked={chosen === optionIndex}
                  onChange={() => setChosen(optionIndex)}
                />
                <span>{option}</span>
                {state === ' is-answer' ? <span className="quiz-option__mark" aria-hidden="true">✓</span> : null}
              </label>
            </li>
          );
        })}
      </ul>
      <div className="quiz-question__feedback" aria-live="polite">
        {answered ? (
          <p>
            <strong>{correct ? STUDENT_SECTIONS.quizCorrect : STUDENT_SECTIONS.quizWrong}</strong>{' '}
            {correct ? '' : `${STUDENT_SECTIONS.quizAnswer(question.options[question.answerIndex] ?? '')}. `}
            {question.explanation}
          </p>
        ) : null}
      </div>
    </fieldset>
  );
}

/** «Comprueba lo que aprendiste»: opción múltiple con retroalimentación inmediata. */
export function KnowledgeCheck({ questions }: { questions: QuizQuestion[] }) {
  return (
    <div className="quiz">
      {questions.map((question, index) => (
        <Question key={question.id} question={question} index={index} total={questions.length} />
      ))}
    </div>
  );
}
