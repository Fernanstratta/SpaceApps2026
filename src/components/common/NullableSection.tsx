import type { ReactNode } from 'react';
import { getDataState } from '../../utils/nullable';
import { DataStateMessage } from './DataStateMessage';

interface NullableSectionProps<T> {
  id?: string;
  title: string;
  /** `null`/`undefined` → pending; `[]` or `''` → empty; anything else → rendered. */
  data: T | null | undefined;
  children: (data: T) => ReactNode;
  headingLevel?: 2 | 3 | 4;
  pendingMessage?: string;
  emptyMessage?: string;
  description?: string;
  className?: string;
}

/**
 * Reusable section that never renders content for missing data.
 * The `children` render function is only called when data is available,
 * so components inside can assume non-null values.
 */
export function NullableSection<T>({
  id,
  title,
  data,
  children,
  headingLevel = 2,
  pendingMessage,
  emptyMessage,
  description,
  className,
}: NullableSectionProps<T>) {
  const state = getDataState(data);
  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4';
  const headingId = id ? `${id}-titulo` : undefined;

  return (
    <section
      id={id}
      className={['content-section', className].filter(Boolean).join(' ')}
      aria-labelledby={headingId}
      data-state={state}
    >
      <Heading id={headingId} className="content-section__title" data-section-heading={id ? '' : undefined}>
        {title}
      </Heading>
      {description ? <p className="content-section__description">{description}</p> : null}
      {state === 'available' ? (
        children(data as T)
      ) : (
        <DataStateMessage state={state} pendingMessage={pendingMessage} emptyMessage={emptyMessage} />
      )}
    </section>
  );
}
