import 'leaflet/dist/leaflet.css';
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet';
import { LOCATION_TEXT } from '../../content/strings';
import type { GeoLocation, ReferenceLocation } from '../../types';
import { isValidCoordinates } from '../../utils/geo';

export interface LeafletMapProps {
  locations: GeoLocation[];
  referenceLocation?: ReferenceLocation | null;
}

type LatLngTuple = [number, number];

/**
 * Leaflet + OpenStreetMap map. Loaded lazily by `LocationMap` and only when
 * there is at least one real location to show. Markers are drawn only from
 * the data passed in — nothing is generated here.
 * CircleMarkers are used to avoid bundler issues with Leaflet's default icons.
 */
export default function LeafletMap({ locations, referenceLocation }: LeafletMapProps) {
  const validLocations = locations.filter((location) => isValidCoordinates(location.coordinates));
  const points: LatLngTuple[] = validLocations.map(({ coordinates }) => [
    coordinates.latitude,
    coordinates.longitude,
  ]);
  if (referenceLocation && isValidCoordinates(referenceLocation.coordinates)) {
    points.push([referenceLocation.coordinates.latitude, referenceLocation.coordinates.longitude]);
  }
  if (points.length === 0) return null;

  return (
    <div className="map-frame" role="region" aria-label={LOCATION_TEXT.mapLabel}>
      <MapContainer
        className="map-canvas"
        bounds={points}
        boundsOptions={{ padding: [32, 32], maxZoom: 11 }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution={LOCATION_TEXT.osmAttribution}
          maxZoom={19}
        />
        {referenceLocation && isValidCoordinates(referenceLocation.coordinates) ? (
          <CircleMarker
            center={[referenceLocation.coordinates.latitude, referenceLocation.coordinates.longitude]}
            radius={7}
            pathOptions={{ className: 'map-marker map-marker--reference' }}
          >
            <Popup>
              <strong>{LOCATION_TEXT.referenceTitle}</strong>
              <br />
              {referenceLocation.name}, {referenceLocation.region}
            </Popup>
          </CircleMarker>
        ) : null}
        {validLocations.map((location) => (
          <CircleMarker
            key={location.id}
            center={[location.coordinates.latitude, location.coordinates.longitude]}
            radius={9}
            pathOptions={{ className: 'map-marker' }}
          >
            <Popup>
              <strong>{location.name}</strong>
              {location.region ? (
                <>
                  <br />
                  {location.region}
                </>
              ) : null}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
