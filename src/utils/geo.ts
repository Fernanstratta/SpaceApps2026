import type { Coordinates } from '../types';

const EARTH_MEAN_RADIUS_KM = 6371.0088;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Great-circle distance between two coordinates (haversine formula), in km.
 * Used to compute "distance from the reference location" at render time.
 */
export function distanceInKm(from: Coordinates, to: Coordinates): number {
  const dLat = toRadians(to.latitude - from.latitude);
  const dLon = toRadians(to.longitude - from.longitude);
  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(to.latitude);

  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_MEAN_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(a)));
}

/** Abreviaturas de los puntos cardinales en el idioma activo (vienen de los mensajes). */
export interface CardinalLabels {
  north: string;
  south: string;
  east: string;
  west: string;
}

export function formatDistanceKm(km: number, locale: string): string {
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(km)} km`;
}

export function formatCoordinates(
  { latitude, longitude }: Coordinates,
  locale: string,
  cardinal: CardinalLabels,
): string {
  const format = new Intl.NumberFormat(locale, { minimumFractionDigits: 4, maximumFractionDigits: 4 }).format;
  const lat = `${format(Math.abs(latitude))}° ${latitude >= 0 ? cardinal.north : cardinal.south}`;
  const lon = `${format(Math.abs(longitude))}° ${longitude >= 0 ? cardinal.east : cardinal.west}`;
  return `${lat}, ${lon}`;
}

export function isValidCoordinates(value: Coordinates | null | undefined): value is Coordinates {
  return (
    !!value &&
    Number.isFinite(value.latitude) &&
    Number.isFinite(value.longitude) &&
    Math.abs(value.latitude) <= 90 &&
    Math.abs(value.longitude) <= 180
  );
}
