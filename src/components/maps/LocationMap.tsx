import { lazy, Suspense } from 'react';
import { LOCATION_TEXT } from '../../content/strings';
import type { GeoLocation, ReferenceLocation } from '../../types';
import { getDataState } from '../../utils/nullable';
import { DataStateMessage } from '../common/DataStateMessage';
import { ErrorBoundary } from '../common/ErrorBoundary';

const LeafletMap = lazy(() => import('./LeafletMap'));

interface LocationMapProps {
  locations: GeoLocation[] | null | undefined;
  referenceLocation?: ReferenceLocation | null;
}

/**
 * Reusable, null-safe map wrapper.
 *  - `null`  → pending message, no map, no markers.
 *  - `[]`    → empty message, no map.
 *  - data    → lazily loads Leaflet and draws one marker per real location.
 * Leaflet and the OSM tiles are only downloaded when there is data to show.
 */
export function LocationMap({ locations, referenceLocation }: LocationMapProps) {
  const state = getDataState(locations);

  if (state !== 'available' || !locations) {
    return (
      <DataStateMessage
        state={state === 'available' ? 'empty' : state}
        pendingMessage={LOCATION_TEXT.mapPending}
        emptyMessage={LOCATION_TEXT.mapEmpty}
      />
    );
  }

  return (
    <ErrorBoundary fallbackMessage={LOCATION_TEXT.mapError}>
      <Suspense
        fallback={
          <p className="map-loading" role="status">
            {LOCATION_TEXT.mapLoading}
          </p>
        }
      >
        <LeafletMap locations={locations} referenceLocation={referenceLocation} />
      </Suspense>
    </ErrorBoundary>
  );
}
