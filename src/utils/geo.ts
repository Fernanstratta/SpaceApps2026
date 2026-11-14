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

const kmFormatter = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 0 });
const coordFormatter = new Intl.NumberFormat('es-MX', {
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
});

export function formatDistanceKm(km: number): string {
  return `${kmFormatter.format(km)} km`;
}

export function formatCoordinates({ latitude, longitude }: Coordinates): string {
  const lat = `${coordFormatter.format(Math.abs(latitude))}° ${latitude >= 0 ? 'N' : 'S'}`;
  const lon = `${coordFormatter.format(Math.abs(longitude))}° ${longitude >= 0 ? 'E' : 'O'}`;
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
