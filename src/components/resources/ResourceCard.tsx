import { RESOURCE_TEXT } from '../../content/strings';
import type { Resource } from '../../types';
import { ExternalLink } from '../common/ExternalLink';

export function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <article className="resource-card">
      <h4 className="resource-card__title">{resource.name}</h4>
      <p className="resource-card__org">
        <span className="visually-hidden">{RESOURCE_TEXT.organization}: </span>
        {resource.organization}
      </p>
      <p className="resource-card__description">{resource.description}</p>
      <dl className="resource-card__meta">
        <div>
          <dt>{RESOURCE_TEXT.informationType}</dt>
          <dd>{resource.informationType}</dd>
        </div>
        <div>
          <dt>{RESOURCE_TEXT.license}</dt>
          <dd>
            {resource.license ?? RESOURCE_TEXT.licenseUnknown}
            {resource.licenseUrl ? (
              <>
                {' '}
                <ExternalLink href={resource.licenseUrl}>{RESOURCE_TEXT.licenseLink}</ExternalLink>
              </>
            ) : null}
          </dd>
        </div>
      </dl>
      <ExternalLink href={resource.sourceUrl} className="button button--secondary resource-card__link">
        {RESOURCE_TEXT.visit}
        <span className="visually-hidden">: {resource.name}</span>
      </ExternalLink>
    </article>
  );
}
