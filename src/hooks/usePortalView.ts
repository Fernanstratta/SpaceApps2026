import { useContext } from 'react';
import { PortalViewContext, type PortalViewContextValue } from '../context/PortalViewContext';

export function usePortalView(): PortalViewContextValue {
  const context = useContext(PortalViewContext);
  if (!context) throw new Error('usePortalView must be used inside <PortalViewProvider>');
  return context;
}
