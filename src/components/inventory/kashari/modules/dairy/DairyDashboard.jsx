
import React, { useState, useEffect } from 'react';
import DairySidebar from './DairySidebar';
import CattleInventoryView from './sections/CattleInventoryView';
import MilkProductionView from './sections/MilkProductionView';
import HealthRecordsView from './sections/HealthRecordsView';
import GrowthMetricsView from './sections/GrowthMetricsView';
import AnalyticsView from './sections/AnalyticsView';

const DairyDashboard = () => {
  // Always start with a consistent default state
  const [activeSection, setActiveSection] = useState('milkProduction');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Load saved preferences after initial render
  useEffect(() => {
    const savedSection = localStorage.getItem('dairyActiveSection');
    if (savedSection) {
      setActiveSection(savedSection);
    }
    
    const savedState = localStorage.getItem('dairySidebarCollapsed');
    if (savedState === 'true') {
      setIsSidebarCollapsed(true);
    }
  }, []);

  // Persist state changes to localStorage
  useEffect(() => {
    localStorage.setItem('dairyActiveSection', activeSection);
  }, [activeSection]);

  useEffect(() => {
    localStorage.setItem('dairySidebarCollapsed', isSidebarCollapsed.toString());
  }, [isSidebarCollapsed]);

  // Function to determine which section component to render based on activeSection
  const renderSection = () => {
    // Add a unique key to each component to force re-render when switching
    const renderKey = Date.now().toString();
    
    switch (activeSection) {
      case 'cattleInventory':
        return <CattleInventoryView key={`cattle-inventory-${renderKey}`} />;
      case 'healthRecords':
        return <HealthRecordsView key={`health-records-${renderKey}`} />;
      case 'growthMetrics':
        return <GrowthMetricsView key={`growth-metrics-${renderKey}`} />;
      case 'milkProduction':
        return <MilkProductionView key={`milk-production-${renderKey}`} />;
      case 'analytics':
        return <AnalyticsView key={`analytics-${renderKey}`} />;
      default:
        return <MilkProductionView key={`milk-production-default-${renderKey}`} />;
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
