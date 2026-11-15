import type { ClassroomAlternative, ClassroomAlternativeType } from '../../types';
import { ExternalLink } from '../common/ExternalLink';
import { TextList } from '../common/TextList';
import { useMessages } from '../../i18n/I18nContext';

const TYPE_ORDER: ClassroomAlternativeType[] = [
  'physical-model',
  'experiment',
  'demonstration',
  'printable',
  'exercise',
];

/** Classroom alternatives grouped by type. Only renders groups with entries. */
export function ClassroomAlternativesView({ alternatives }: { alternatives: ClassroomAlternative[] }) {
  const { CLASSROOM_ALTERNATIVE_LABELS } = useMessages();
  return (
    <div className="subsection-stack">
      {TYPE_ORDER.map((type) => {
        const items = alternatives.filter((alternative) => alternative.type === type);
        if (items.length === 0) return null;
        return (
          <section key={type} className="content-subsection">
            <h3>{CLASSROOM_ALTERNATIVE_LABELS[type]}</h3>
            <ul className="card-list">
              {items.map((item) => (
                <li key={item.id}>
                  <article className="activity-card">
                    <h4 className="activity-card__title">{item.title}</h4>
                    <p>{item.description}</p>
                    {item.materials && item.materials.length > 0 ? <TextList items={item.materials} /> : null}
                    {item.resourceUrl ? <ExternalLink href={item.resourceUrl}>{item.title}</ExternalLink> : null}
                  </article>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
