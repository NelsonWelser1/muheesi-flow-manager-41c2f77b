
import React, { useState } from 'react';
import DairySidebar from './DairySidebar';
import CattleInventoryView from './sections/CattleInventoryView';
import MilkProductionView from './sections/MilkProductionView';
import HealthRecordsView from './sections/HealthRecordsView';
import GrowthMetricsView from './sections/GrowthMetricsView';
import AnalyticsView from './sections/AnalyticsView';

const DairyDashboard = () => {
  const [activeSection, setActiveSection] = useState('cattleInventory');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case 'cattleInventory':
        return <CattleInventoryView />;
      case 'healthRecords':
        return <HealthRecordsView />;
      case 'growthMetrics':
        return <GrowthMetricsView />;
      case 'milkProduction':
        return <MilkProductionView />;
      case 'analytics':
        return <AnalyticsView />;
      default:
        return <CattleInventoryView />;
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
