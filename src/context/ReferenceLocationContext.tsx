import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react';
import { DEFAULT_REFERENCE_LOCATION } from '../data/locations';
import type { ReferenceLocation } from '../types';

/**
 * Holds the active reference location (default: Mexicali, Baja California).
 * `setReferenceLocation` is already available so a future teacher setting can
 * change it without touching the components that compute distances.
 */
export interface ReferenceLocationContextValue {
  referenceLocation: ReferenceLocation;
  setReferenceLocation: (location: ReferenceLocation) => void;
  resetReferenceLocation: () => void;
  isDefault: boolean;
}

export const ReferenceLocationContext = createContext<ReferenceLocationContextValue | null>(null);

export function ReferenceLocationProvider({ children }: { children: ReactNode }) {
  const [referenceLocation, setReferenceLocationState] = useState<ReferenceLocation>(
    DEFAULT_REFERENCE_LOCATION,
  );

  const setReferenceLocation = useCallback((location: ReferenceLocation) => {
    setReferenceLocationState(location);
  }, []);

  const resetReferenceLocation = useCallback(() => {
    setReferenceLocationState(DEFAULT_REFERENCE_LOCATION);
  }, []);

  const value = useMemo(
    () => ({
      referenceLocation,
      setReferenceLocation,
      resetReferenceLocation,
      isDefault: referenceLocation.id === DEFAULT_REFERENCE_LOCATION.id,
    }),
    [referenceLocation, setReferenceLocation, resetReferenceLocation],
  );

  return (
    <ReferenceLocationContext.Provider value={value}>{children}</ReferenceLocationContext.Provider>
  );
}
