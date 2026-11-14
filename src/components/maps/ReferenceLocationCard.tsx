import { LOCATION_TEXT } from '../../content/strings';
import { useReferenceLocation } from '../../hooks/useReferenceLocation';
import { formatCoordinates } from '../../utils/geo';

/** Shows the active reference location used for distance calculations. */
export function ReferenceLocationCard() {
  const { referenceLocation } = useReferenceLocation();

  return (
    <aside className="reference-card" aria-labelledby="reference-card-title">
      <p id="reference-card-title" className="reference-card__label">
        {LOCATION_TEXT.referenceTitle}
      </p>
      <p className="reference-card__name">
        {referenceLocation.name}, {referenceLocation.region}, {referenceLocation.country}
      </p>
      <p className="reference-card__coords">{formatCoordinates(referenceLocation.coordinates)}</p>
      <p className="reference-card__note">{LOCATION_TEXT.referenceDescription}</p>
      <p className="reference-card__note">{LOCATION_TEXT.referenceFuture}</p>
    </aside>
  );
}
