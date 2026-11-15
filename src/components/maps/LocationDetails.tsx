import type { ReactNode } from 'react';
import { useReferenceLocation } from '../../hooks/useReferenceLocation';
import type { GeoLocation } from '../../types';
import { distanceInKm, formatCoordinates, formatDistanceKm, isValidCoordinates } from '../../utils/geo';
import { FieldList, type FieldItem } from '../common/FieldList';
import { TextList } from '../common/TextList';
import { useI18n } from '../../i18n/I18nContext';

interface LocationDetailsProps {
  location: GeoLocation;
  relationToTopic?: string | null;
  /** Show the distance from the active reference location (teacher view). */
  showDistance?: boolean;
  extraFields?: FieldItem[];
  children?: ReactNode;
}

/** Card describing one real location. Distance is computed, never stored. */
export function LocationDetails({
  location,
  relationToTopic,
  showDistance = false,
  extraFields = [],
  children,
}: LocationDetailsProps) {
  const { locale, messages } = useI18n();
  const { LOCATION_TEXT } = messages;
  const { referenceLocation } = useReferenceLocation();
  const hasCoords = isValidCoordinates(location.coordinates);

  const fields: FieldItem[] = [
    { label: LOCATION_TEXT.description, value: location.description },
    {
      label: LOCATION_TEXT.features,
      value:
        location.geographicFeatures && location.geographicFeatures.length > 0 ? (
          <TextList items={location.geographicFeatures} />
        ) : null,
    },
    { label: LOCATION_TEXT.coordinates, value: hasCoords ? formatCoordinates(location.coordinates, locale, LOCATION_TEXT.cardinal) : null },
  ];

  if (showDistance) {
    fields.push({
      label: `${LOCATION_TEXT.distance} (${referenceLocation.name})`,
      value: hasCoords
        ? formatDistanceKm(distanceInKm(referenceLocation.coordinates, location.coordinates), locale)
        : null,
    });
  }
  if (relationToTopic !== undefined) {
    fields.push({ label: LOCATION_TEXT.relation, value: relationToTopic });
  }

  return (
    <article className="location-card">
      <h4 className="location-card__title">{location.name}</h4>
      {location.region ? <p className="location-card__region">{location.region}</p> : null}
      <FieldList fields={[...fields, ...extraFields]} />
      {children}
    </article>
  );
}
