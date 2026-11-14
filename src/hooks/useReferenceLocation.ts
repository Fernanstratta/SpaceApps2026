import { useContext } from 'react';
import {
  ReferenceLocationContext,
  type ReferenceLocationContextValue,
} from '../context/ReferenceLocationContext';

export function useReferenceLocation(): ReferenceLocationContextValue {
  const context = useContext(ReferenceLocationContext);
  if (!context) {
    throw new Error('useReferenceLocation must be used inside <ReferenceLocationProvider>');
  }
  return context;
}
