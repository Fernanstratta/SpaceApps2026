import { Component, type ContextType, type ErrorInfo, type ReactNode } from 'react';
import { I18nContext } from '../../i18n/I18nContext';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackMessage?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/** Keeps a failing section (e.g. the map) from breaking the whole page. */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static contextType = I18nContext;
  declare context: ContextType<typeof I18nContext>;

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
          {this.props.fallbackMessage ?? this.context?.messages.UI.genericError}
        </p>
      );
    }
    return this.props.children;
  }
}
