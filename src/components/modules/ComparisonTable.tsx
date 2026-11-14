import { COMPARISON_TEXT } from '../../content/strings';
import type { Comparison, Measurement } from '../../types';
import { resources } from '../../data/resources';

const numberFormatter = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 6 });

function formatMeasurement({ value, unit }: Measurement): string {
  const formatted = typeof value === 'number' ? numberFormatter.format(value) : value;
  return unit ? `${formatted} ${unit}` : formatted;
}

function sourceNames(ids: string[]): string {
  return ids
    .map((id) => resources.find((resource) => resource.id === id)?.name ?? id)
    .join(', ');
}

/**
 * Earth–Moon comparison table. Only receives real, sourced comparisons;
 * callers must handle `null` (see `NullableSection`). On narrow screens each
 * row becomes a stacked card (CSS uses the `data-label` attributes).
 */
export function ComparisonTable({ comparisons }: { comparisons: Comparison[] }) {
  return (
    <div className="responsive-table">
      <table>
        <thead>
          <tr>
            <th scope="col">{COMPARISON_TEXT.property}</th>
            <th scope="col">{COMPARISON_TEXT.earth}</th>
            <th scope="col">{COMPARISON_TEXT.moon}</th>
            <th scope="col">{COMPARISON_TEXT.ratio}</th>
            <th scope="col">{COMPARISON_TEXT.source}</th>
          </tr>
        </thead>
        <tbody>
          {comparisons.map((comparison) => (
            <tr key={comparison.id}>
              <th scope="row" data-label={COMPARISON_TEXT.property}>
                {comparison.label}
              </th>
              <td data-label={COMPARISON_TEXT.earth}>{formatMeasurement(comparison.earth)}</td>
              <td data-label={COMPARISON_TEXT.moon}>{formatMeasurement(comparison.moon)}</td>
              <td data-label={COMPARISON_TEXT.ratio}>
                {comparison.ratio !== null ? numberFormatter.format(comparison.ratio) : '—'}
              </td>
              <td data-label={COMPARISON_TEXT.source}>{sourceNames(comparison.sourceIds)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
