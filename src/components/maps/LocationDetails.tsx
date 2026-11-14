import type { ReactNode } from 'react';
import { LOCATION_TEXT } from '../../content/strings';
import { useReferenceLocation } from '../../hooks/useReferenceLocation';
import type { GeoLocation } from '../../types';
import { distanceInKm, formatCoordinates, formatDistanceKm, isValidCoordinates } from '../../utils/geo';
import { FieldList, type FieldItem } from '../common/FieldList';
import { TextList } from '../common/TextList';

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
    { label: LOCATION_TEXT.coordinates, value: hasCoords ? formatCoordinates(location.coordinates) : null },
  ];

  if (showDistance) {
    fields.push({
      label: `${LOCATION_TEXT.distance} (${referenceLocation.name})`,
      value: hasCoords
        ? formatDistanceKm(distanceInKm(referenceLocation.coordinates, location.coordinates))
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
