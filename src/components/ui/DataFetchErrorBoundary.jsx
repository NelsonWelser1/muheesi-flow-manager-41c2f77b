import React from 'react';
import ComponentErrorBoundary from './ComponentErrorBoundary';
import { WarningFallback, InlineErrorFallback } from './FallbackUI';

/**
 * Specialized error boundary for data fetching components
 * Shows non-intrusive warnings for data loading failures
 */
export const DataFetchErrorBoundary = ({ 
  children, 
  componentName, 
  inline = false 
}) => {
  return (
    <ComponentErrorBoundary
      componentName={componentName}
      fallback={(error, reset) => 
        inline ? (
          <InlineErrorFallback 
            error={error}
            onReset={reset}
            componentName={componentName}
          />
        ) : (
          <WarningFallback 
            error={error}
            onReset={reset}
            componentName={componentName}
          />
        )
      }
    >
      {children}
    </ComponentErrorBoundary>
  );
};

export default DataFetchErrorBoundary;
