
import React, { useState, useEffect } from 'react';
import DairyDashboard from './dairy/DairyDashboard';

const DairyManagement = () => {
  // Use localStorage to maintain state persistence across page reloads/navigation
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    // Mark component as initialized to prevent re-rendering issues
    if (!initialized) {
      setInitialized(true);
      // Store initialization timestamp to help with state persistence
      localStorage.setItem('dairyManagementInitialized', Date.now().toString());
    }
    
    return () => {
      // Clean up function
      console.log("DairyManagement component unmounted");
    };
  }, [initialized]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Dairy Management</h2>
      <DairyDashboard key="dairy-dashboard-stable" />
    </div>
  );
};

export default DairyManagement;
