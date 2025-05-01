
import React, { useState, useEffect } from 'react';
import DairyDashboard from './dairy/DairyDashboard';
import { useToast } from "@/components/ui/use-toast";

const DairyManagement = () => {
  const { toast } = useToast();
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    // Mark component as initialized to prevent re-rendering issues
    if (!initialized) {
      setInitialized(true);
      
      // Make sure the latest state is persisted in localStorage
      const timestamp = Date.now().toString();
      localStorage.setItem('dairyManagementInitialized', timestamp);
      
      // Ensure we're using the latest state of the component
      const activeSection = localStorage.getItem('dairyActiveSection') || 'milkProduction';
      const sidebarState = localStorage.getItem('dairySidebarCollapsed') || 'false';
      
      console.log('DairyManagement component initialized', { 
        timestamp,
        activeSection, 
        sidebarCollapsed: sidebarState 
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
      {/* Set the correct default active section and always include the key to avoid stale renders */}
      <DairyDashboard key={`dairy-dashboard-${initialized ? 'initialized' : 'loading'}`} />
    </div>
  );
};

export default DairyManagement;
