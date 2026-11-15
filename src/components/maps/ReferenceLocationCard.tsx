import { useReferenceLocation } from '../../hooks/useReferenceLocation';
import { formatCoordinates } from '../../utils/geo';
import { useData, useI18n } from '../../i18n/I18nContext';

/** Shows the active reference location used for distance calculations. */
export function ReferenceLocationCard() {
  const { locale, messages } = useI18n();
  const { LOCATION_TEXT } = messages;
  const { localizeReferenceLocation } = useData();
  const referenceLocation = localizeReferenceLocation(useReferenceLocation().referenceLocation);

  return (
    <aside className="reference-card" aria-labelledby="reference-card-title">
      <p id="reference-card-title" className="reference-card__label">
        {LOCATION_TEXT.referenceTitle}
      </p>
      <p className="reference-card__name">
        {referenceLocation.name}, {referenceLocation.region}, {referenceLocation.country}
      </p>
      <p className="reference-card__coords">{formatCoordinates(referenceLocation.coordinates, locale, LOCATION_TEXT.cardinal)}</p>
      <p className="reference-card__note">{LOCATION_TEXT.referenceDescription}</p>
      <p className="reference-card__note">{LOCATION_TEXT.referenceFuture}</p>
    </aside>
  );
}
