import { UI } from '../../content/strings';
import type { DataState } from '../../utils/nullable';

interface DataStateMessageProps {
  state: Exclude<DataState, 'available'>;
  pendingMessage?: string;
  emptyMessage?: string;
  compact?: boolean;
}

/**
 * Visible message for unavailable data.
 * 'pending' = data not provided yet (`null`); 'empty' = provided but no entries.
 */
export function DataStateMessage({
  state,
  pendingMessage = UI.pending,
  emptyMessage = UI.empty,
  compact = false,
}: DataStateMessageProps) {
  const message = state === 'pending' ? pendingMessage : emptyMessage;
  return (
    <p
      className={`data-state data-state--${state}${compact ? ' data-state--compact' : ''}`}
      data-state={state}
    >
      <svg className="data-state__icon" viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" focusable="false">
        <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="1.8" />
        {state === 'pending' ? (
          <path d="M10 5.5V10l3 2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        ) : (
          <path d="M6.5 10h7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        )}
      </svg>
      <span>{message}</span>
    </p>
  );
}
