import { useData, useI18n } from '../../i18n/I18nContext';
import type { Comparison, Measurement, Resource } from '../../types';

function formatMeasurement({ value, unit }: Measurement, numberFormatter: Intl.NumberFormat): string {
  const formatted = typeof value === 'number' ? numberFormatter.format(value) : value;
  return unit ? `${formatted} ${unit}` : formatted;
}

function sourceNames(ids: string[], resources: Resource[]): string {
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
  const { locale, messages } = useI18n();
  const { COMPARISON_TEXT } = messages;
  const { resources } = useData();
  const numberFormatter = new Intl.NumberFormat(locale, { maximumFractionDigits: 6 });

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
              <td data-label={COMPARISON_TEXT.earth}>{formatMeasurement(comparison.earth, numberFormatter)}</td>
              <td data-label={COMPARISON_TEXT.moon}>{formatMeasurement(comparison.moon, numberFormatter)}</td>
              <td data-label={COMPARISON_TEXT.ratio}>
                {comparison.ratio !== null ? numberFormatter.format(comparison.ratio) : '—'}
              </td>
              <td data-label={COMPARISON_TEXT.source}>{sourceNames(comparison.sourceIds, resources)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
