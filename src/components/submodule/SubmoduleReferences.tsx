import { DataStateMessage } from '../common/DataStateMessage';
import { ExternalLink } from '../common/ExternalLink';
import { useData, useMessages } from '../../i18n/I18nContext';

interface SubmoduleReferencesProps {
  id: string;
  /** Resource ids cited by the submodule; duplicates are ignored. */
  sourceIds: string[];
}

/** "Referencias": the verified sources a submodule cites. */
export function SubmoduleReferences({ id, sourceIds }: SubmoduleReferencesProps) {
  const { RESOURCE_TEXT, SUBMODULE_TEXT } = useMessages();
  const { resources } = useData();
  const cited = [...new Set(sourceIds)]
    .map((sourceId) => resources.find((resource) => resource.id === sourceId))
    .filter((resource) => resource !== undefined);

  return (
    <section id={id} className="content-section submodule-section" aria-labelledby={`${id}-titulo`}>
      <h2 id={`${id}-titulo`} className="content-section__title" data-section-heading="">
        {SUBMODULE_TEXT.references}
      </h2>
      {cited.length > 0 ? (
        <ol className="reference-list">
          {cited.map((resource) => (
            <li key={resource.id} className="reference-list__item">
              <span className="reference-list__name">{resource.name}</span>
              <span className="reference-list__org">{resource.organization}</span>
              <ExternalLink href={resource.sourceUrl}>{RESOURCE_TEXT.visit}</ExternalLink>
            </li>
          ))}
        </ol>
      ) : (
        <DataStateMessage state="pending" pendingMessage={SUBMODULE_TEXT.referencesPending} />
      )}
    </section>
  );
}
