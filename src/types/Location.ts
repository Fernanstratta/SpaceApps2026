/** WGS84 decimal-degree coordinates. */
export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * A real place on Earth. Locations must come from a verifiable source
 * (see `sourceIds`, which reference entries in `src/data/resources.ts`).
 */
export interface GeoLocation {
  id: string;
  name: string;
  description: string | null;
  /** e.g. "Volcán", "Desierto", "Cráter de impacto". */
  geographicFeatures: string[] | null;
  coordinates: Coordinates;
  /** State / region / country label shown to the user. */
  region: string | null;
  sourceIds: string[] | null;
}

/**
 * Point used to compute "distance from the reference location".
 * Teachers will be able to change it in a future implementation.
 */
export interface ReferenceLocation {
  id: string;
  name: string;
  region: string;
  country: string;
  coordinates: Coordinates;
}

/** A location linked to a student topic. */
export interface RelatedLocation {
  location: GeoLocation;
  relationToTopic: string | null;
}

/**
 * A teacher-facing geographical recommendation.
 * The distance to the reference location is NOT stored: it is computed at
 * render time from the active reference location.
 */
export interface GeographicalRecommendation {
  location: GeoLocation;
  relationToTopic: string | null;
  suggestedActivities: string[] | null;
}

/** A potential school field trip. */
export interface FieldTrip {
  id: string;
  location: GeoLocation;
  activities: string[] | null;
  accessibilityInfo: string | null;
  safetyInfo: string | null;
  requiredMaterials: string[] | null;
}
