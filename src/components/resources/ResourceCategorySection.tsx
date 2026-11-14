import { RESOURCE_TEXT } from '../../content/strings';
import type { Resource, ResourceCategory } from '../../types';
import { DataStateMessage } from '../common/DataStateMessage';
import { ResourceCard } from './ResourceCard';

interface ResourceCategorySectionProps {
  category: ResourceCategory;
  resources: Resource[];
}

export function ResourceCategorySection({ category, resources }: ResourceCategorySectionProps) {
  const headingId = `${category.id}-titulo`;
  return (
    <section id={category.id} className="resource-category" aria-labelledby={headingId}>
      <div className="resource-category__header">
        <h3 id={headingId}>{category.name}</h3>
        <p className="resource-category__count">{RESOURCE_TEXT.count(resources.length)}</p>
      </div>
      <p className="resource-category__description">{category.description}</p>
      {resources.length === 0 ? (
        <DataStateMessage state="empty" emptyMessage={RESOURCE_TEXT.emptyCategory} />
      ) : (
        <ul className="resource-list">
          {resources.map((resource) => (
            <li key={resource.id}>
              <ResourceCard resource={resource} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
