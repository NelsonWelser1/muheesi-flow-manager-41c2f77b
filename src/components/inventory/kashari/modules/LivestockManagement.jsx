
import React, { useState } from 'react';
import CattleInventoryView from './cattle/CattleInventoryView';
import HealthRecordsView from './health/HealthRecordsView';
import GrowthMetricsView from './growth/GrowthMetricsView';
import LivestockSidebar from './livestock/LivestockSidebar';

const LivestockManagement = () => {
  const [activeSection, setActiveSection] = useState('cattleInventory');
  
  const renderContent = () => {
    switch (activeSection) {
      case 'cattleInventory':
        return <CattleInventoryView />;
      case 'healthRecords':
        return <HealthRecordsView />;
      case 'growthMetrics':
        return <GrowthMetricsView />;
      default:
        return <CattleInventoryView />;
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)]">
      <div className="flex w-full h-full bg-white shadow rounded-lg overflow-hidden">
        <LivestockSidebar 
          activeSection={activeSection} 
          setActiveSection={setActiveSection}
        />
        <div className="flex-1 p-6 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default LivestockManagement;
