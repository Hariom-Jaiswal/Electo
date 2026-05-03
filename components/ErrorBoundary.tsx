'use client';

import { Component, type ReactNode, type ErrorInfo } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  /** Optional custom fallback UI. Defaults to a generic error card. */
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * React Error Boundary — catches rendering errors in child components and
 * displays a graceful fallback instead of crashing the entire page.
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Log to structured Cloud Logging format
    console.error(
      JSON.stringify({
        severity: 'ERROR',
        message: 'React ErrorBoundary caught an error',
        error: error.message,
        componentStack: info.componentStack,
        timestamp: new Date().toISOString(),
      })
    );
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          role="alert"
          className="flex flex-col items-center justify-center gap-4 p-12 text-center glass-card rounded-2xl"
        >
          <AlertTriangle className="h-10 w-10 text-orange-500" aria-hidden="true" />
          <h2 className="text-xl font-bold text-foreground">Something went wrong</h2>
          <p className="text-sm text-secondary max-w-sm">
            An unexpected error occurred. Please refresh the page or try again later.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="btn-primary text-sm"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
