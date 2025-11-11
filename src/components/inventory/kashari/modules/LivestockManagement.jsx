import React from 'react';
import DairyDashboard from './dairy/DairyDashboard';
import ComponentErrorBoundary from "@/components/ui/ComponentErrorBoundary";
import { CardErrorFallback } from "@/components/ui/FallbackUI";

const LivestockManagement = () => {
  return (
    <ComponentErrorBoundary 
      componentName="Livestock Management"
      fallback={(error, reset) => (
        <CardErrorFallback 
          error={error}
          onReset={reset}
          componentName="Livestock Management"
          description="The livestock management section encountered an error"
        />
      )}
    >
      <DairyDashboard />
    </ComponentErrorBoundary>
  );
};

export default LivestockManagement;
