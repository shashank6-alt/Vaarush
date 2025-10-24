import React from 'react';
import { ErrorBoundaryPropsWithFallback } from 'react-error-boundary';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  resetErrorBoundary 
}) => {
  return (
    <div className="error-fallback">
      <div className="error-content">
        <h1 className="error-title">⚠️ Something went wrong</h1>
        <p className="error-message">
          {error.message || 'An unexpected error occurred'}
        </p>
        <div className="error-actions">
          <button 
            className="btn btn-primary"
            onClick={resetErrorBoundary}
          >
            Try Again
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => window.location.href = '/'}
          >
            Go Home
          </button>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className="error-details">
            <summary>Error Details (Dev Mode)</summary>
            <pre>{error.stack}</pre>
          </details>
        )}
      </div>
    </div>
  );
};

export default ErrorFallback;
