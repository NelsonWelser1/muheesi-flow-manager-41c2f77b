
import React, { useState, useEffect } from 'react';
import DairyDashboard from './dairy/DairyDashboard';
import { useToast } from "@/components/ui/use-toast";
import ComponentErrorBoundary from "@/components/ui/ComponentErrorBoundary";
import { CardErrorFallback } from "@/components/ui/FallbackUI";

const DairyManagement = () => {
  const { toast } = useToast();
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    // Clear any stale state when component mounts
    localStorage.removeItem('dairyActiveSection');
    localStorage.removeItem('dairySidebarCollapsed');
    
    // Mark component as initialized to prevent re-rendering issues
    if (!initialized) {
      setInitialized(true);
      
      // Set default values with current timestamp to force fresh state
      const timestamp = Date.now().toString();
      localStorage.setItem('dairyManagementInitialized', timestamp);
      
      // Set default active section rather than using potentially stale data
      localStorage.setItem('dairyActiveSection', 'milkProduction');
      localStorage.setItem('dairySidebarCollapsed', 'false');
      
      console.log('DairyManagement component initialized with fresh state', { 
        timestamp,
        activeSection: 'milkProduction', 
        sidebarCollapsed: 'false' 
      });
    }
    
    return () => {
      // Clean up function
      console.log("DairyManagement component unmounted");
    };
  }, [initialized]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Dairy Management</h2>
      <ComponentErrorBoundary 
        componentName="Dairy Dashboard"
        fallback={(error, reset) => (
          <CardErrorFallback 
            error={error}
            onReset={reset}
            componentName="Dairy Dashboard"
            description="The dairy management dashboard encountered an error"
          />
        )}
      >
        {/* Use the initialized state to ensure the dashboard always gets a fresh render */}
        <DairyDashboard key={`dairy-dashboard-${initialized ? Date.now() : 'loading'}`} />
      </ComponentErrorBoundary>
    </div>
  );
};

export default DairyManagement;
