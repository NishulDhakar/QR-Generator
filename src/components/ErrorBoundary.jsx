import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    const { darkMode } = this.props;
    
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
          <h2 className="text-xl font-bold mb-4">Something went wrong</h2>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reload page
          </button>
          <details className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <summary className="cursor-pointer font-medium">Error details (for developers)</summary>
            <p className="mt-2 text-red-500">{this.state.error && this.state.error.toString()}</p>
            <pre className={`mt-2 overflow-auto p-2 rounded ${darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-200 text-gray-800'}`} style={{ maxHeight: '200px' }}>
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 