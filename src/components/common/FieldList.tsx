import type { ReactNode } from 'react';
import { UI } from '../../content/strings';
import { getDataState } from '../../utils/nullable';

export interface FieldItem {
  label: string;
  /** Rendered as-is when it is a node; `null`/empty shows "Pendiente". */
  value: ReactNode | string | null | undefined;
}

/** Label/value pairs as a description list. Missing values are marked as pending. */
export function FieldList({ fields }: { fields: FieldItem[] }) {
  return (
    <dl className="field-list">
      {fields.map(({ label, value }) => {
        const state = getDataState(value);
        return (
          <div className="field-list__row" key={label} data-state={state}>
            <dt>{label}</dt>
            <dd>
              {state === 'available' ? (
                value
              ) : (
                <span className="field-list__pending">{UI.fieldPending}</span>
              )}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
