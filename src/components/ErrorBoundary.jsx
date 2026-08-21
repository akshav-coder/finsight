import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // If crash monitoring (e.g. Sentry) is ever added, this is the hook point.
    console.error('Uncaught render error:', error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
          <div className="w-16 h-16 bg-danger-100 dark:bg-danger-900/40 rounded-full flex items-center justify-center mb-6 text-danger-500 dark:text-danger-400">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">
            FinSight hit an unexpected error. Your data wasn't lost — it's still in your
            browser's local storage. Try reloading.
          </p>
          <button
            onClick={this.handleReload}
            className="px-6 py-3 bg-primary-600 text-white rounded-xl font-bold shadow-lg shadow-primary-500/30 hover:bg-primary-700 transition hover:-translate-y-0.5"
          >
            Back to Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
