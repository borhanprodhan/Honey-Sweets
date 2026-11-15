import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error?.message || 'Unexpected application error',
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('Application ErrorBoundary caught:', error, info);
  }

  handleReset = () => {
    try {
      Object.keys(window.localStorage).forEach((key) => {
        if (key.startsWith('honey_sweets_')) {
          window.localStorage.removeItem(key);
        }
      });
    } catch {
      // Ignore storage access errors
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FFFDF9] text-[#252525] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-2xl border border-stone-200 p-8 shadow-lg text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#4A2E16] text-[#E5A000] flex items-center justify-center mx-auto font-bold text-lg">
              HS
            </div>
            <h1 className="text-xl font-bold text-[#4A2E16]">
              Honey-Sweets
            </h1>
            <p className="text-sm text-stone-600">
              Something went wrong while loading the store. Click below to clear cached data and reload cleanly.
            </p>
            <button
              onClick={this.handleReset}
              className="px-5 py-2.5 bg-[#E5A000] hover:bg-[#D48F00] text-[#4A2E16] font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Reload Store
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
