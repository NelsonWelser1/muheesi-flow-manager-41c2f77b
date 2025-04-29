
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
      // Store initialization timestamp to help with state persistence
      localStorage.setItem('dairyManagementInitialized', Date.now().toString());
      
      // Ensure we're using the latest state of the component
      const activeSection = localStorage.getItem('dairyActiveSection') || 'cattleInventory';
      const sidebarState = localStorage.getItem('dairySidebarCollapsed') || 'false';
      
      console.log('DairyManagement component initialized', { 
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
      {/* Use key to force stability and prevent component resurrection */}
      <DairyDashboard key="dairy-dashboard-stable" />
    </div>
  );
};

export default DairyManagement;
