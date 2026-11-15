import { Component } from "react";

// Catches unexpected rendering errors so users see a message instead of a blank page.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" data-testid="error-boundary-fallback" className="p-8 text-center">
          <h2 className="text-lg font-semibold text-slate-800">Something went wrong</h2>
          <p className="mt-2 text-sm text-slate-500">
            Please reload the page. Your data was not sent anywhere.
          </p>
          <button
            type="button"
            className="mt-4 rounded-md bg-sky-600 px-4 py-2 text-sm text-white"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
