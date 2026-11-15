import type {
  FieldTrip,
  GeoLocation,
  GeographicalRecommendation,
  ReferenceLocation,
  RelatedLocation,
  SubmoduleKey,
} from '../types';
import { mapSubmodules } from './submodules';

/**
 * Default reference location used to compute distances to recommended places.
 * Approximate coordinates of the city center of Mexicali, Baja California.
 * Teachers will be able to change it in a future implementation
 * (see `ReferenceLocationContext`).
 */
export const DEFAULT_REFERENCE_LOCATION: ReferenceLocation = {
  id: 'mexicali-bc',
  name: 'Mexicali',
  region: 'Baja California',
  country: 'México',
  coordinates: { latitude: 32.6245, longitude: -115.4523 },
};

/**
 * Catalog of real-world locations.
 * INITIAL DATA STATE: `null` — no locations have been provided yet.
 * Do NOT add fictional places or markers.
 */
export const locationCatalog: GeoLocation[] | null = null;

/** "Aprender": Earth locations related to each submodule. All `null` for now. */
export const relatedLocationsBySubmodule: Record<SubmoduleKey, RelatedLocation[] | null> = {
  ...mapSubmodules(() => null),
};

/** "Enseñar": geographical recommendations per submodule. All `null` for now. */
export const geographicalRecommendationsBySubmodule: Record<SubmoduleKey, GeographicalRecommendation[] | null> = {
  ...mapSubmodules(() => null),
};

/** "Enseñar": potential field trips per submodule. All `null` for now. */
export const fieldTripsBySubmodule: Record<SubmoduleKey, FieldTrip[] | null> = {
  ...mapSubmodules(() => null),
};
