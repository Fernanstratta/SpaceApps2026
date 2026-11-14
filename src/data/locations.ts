import type {
  ByTopic,
  FieldTrip,
  GeoLocation,
  GeographicalRecommendation,
  ReferenceLocation,
  RelatedLocation,
} from '../types';

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

/** Student: Earth locations related to each topic. All `null` for now. */
export const relatedLocationsByTopic: ByTopic<RelatedLocation[] | null> = {
  'size-scale': null,
  gravity: null,
  'surface-terrain': null,
  'earth-moon-distance': null,
  temperature: null,
  'impact-craters': null,
  atmosphere: null,
  'water-ice': null,
};

/** Teacher: geographical recommendations per topic. All `null` for now. */
export const geographicalRecommendationsByTopic: ByTopic<GeographicalRecommendation[] | null> = {
  'size-scale': null,
  gravity: null,
  'surface-terrain': null,
  'earth-moon-distance': null,
  temperature: null,
  'impact-craters': null,
  atmosphere: null,
  'water-ice': null,
};

/** Teacher: potential field trips per topic. All `null` for now. */
export const fieldTripsByTopic: ByTopic<FieldTrip[] | null> = {
  'size-scale': null,
  gravity: null,
  'surface-terrain': null,
  'earth-moon-distance': null,
  temperature: null,
  'impact-craters': null,
  atmosphere: null,
  'water-ice': null,
};
