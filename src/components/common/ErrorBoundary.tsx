import { Component, type ErrorInfo, type ReactNode } from 'react';
import { UI } from '../../content/strings';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackMessage?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/** Keeps a failing section (e.g. the map) from breaking the whole page. */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[Starman] Error en una sección:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <p className="data-state data-state--error" role="alert">
          {this.props.fallbackMessage ?? UI.genericError}
        </p>
      );
    }
    return this.props.children;
  }
}
