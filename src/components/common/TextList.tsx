import { getDataState } from '../../utils/nullable';
import { DataStateMessage } from './DataStateMessage';

interface TextListProps {
  items: string[] | null | undefined;
  ordered?: boolean;
  compact?: boolean;
}

/** Null-safe list of strings. */
export function TextList({ items, ordered = false, compact = true }: TextListProps) {
  const state = getDataState(items);
  if (state !== 'available' || !items) {
    return <DataStateMessage state={state === 'available' ? 'empty' : state} compact={compact} />;
  }
  const ListTag = ordered ? 'ol' : 'ul';
  return (
    <ListTag className="text-list">
      {items.map((item, index) => (
        <li key={`${index}-${item}`}>{item}</li>
      ))}
    </ListTag>
  );
}
