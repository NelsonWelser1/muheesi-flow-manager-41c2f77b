
import React, { useState, useEffect } from 'react';
import DairySidebar from './DairySidebar';
import CattleInventoryView from './sections/CattleInventoryView';
import MilkProductionView from './sections/MilkProductionView';
import HealthRecordsView from './sections/HealthRecordsView';
import GrowthMetricsView from './sections/GrowthMetricsView';
import AnalyticsView from './sections/AnalyticsView';

const DairyDashboard = () => {
  // Use localStorage to persist the active section and sidebar state
  const [activeSection, setActiveSection] = useState(() => {
    const savedSection = localStorage.getItem('dairyActiveSection');
    return savedSection || 'cattleInventory';
  });
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const savedState = localStorage.getItem('dairySidebarCollapsed');
    return savedState === 'true';
  });

  // Persist state changes to localStorage
  useEffect(() => {
    localStorage.setItem('dairyActiveSection', activeSection);
  }, [activeSection]);

  useEffect(() => {
    localStorage.setItem('dairySidebarCollapsed', isSidebarCollapsed.toString());
  }, [isSidebarCollapsed]);

  const renderSection = () => {
    switch (activeSection) {
      case 'cattleInventory':
        return <CattleInventoryView key="cattle-inventory-view" />;
      case 'healthRecords':
        return <HealthRecordsView key="health-records-view" />;
      case 'growthMetrics':
        return <GrowthMetricsView key="growth-metrics-view" />;
      case 'milkProduction':
        return <MilkProductionView key="milk-production-view" />;
      case 'analytics':
        return <AnalyticsView key="analytics-view" />;
      default:
        return <CattleInventoryView key="cattle-inventory-default" />;
    }
  };

  return (
    <div className="h-full flex">
      <div className={`${isSidebarCollapsed ? 'w-16' : 'w-64'} transition-all duration-300`}>
        <DairySidebar 
          activeSection={activeSection} 
          setActiveSection={setActiveSection}
          isCollapsed={isSidebarCollapsed}
        />
      </div>
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-4 flex items-center">
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="mr-4 p-2 hover:bg-gray-100 rounded"
          >
            {isSidebarCollapsed ? '→' : '←'}
          </button>
          <h1 className="text-3xl font-bold">Dairy Management</h1>
        </div>
        {renderSection()}
      </div>
    </div>
  );
};

export default DairyDashboard;
