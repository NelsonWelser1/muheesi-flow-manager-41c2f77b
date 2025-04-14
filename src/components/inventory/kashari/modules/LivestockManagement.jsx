
import React, { useState } from 'react';
import CattleRegistration from './CattleRegistration';
import CattleList from './CattleList';
import CattleHealth from './CattleHealth';
import CattleGrowth from './CattleGrowth';
import LivestockSidebar from './livestock/LivestockSidebar';

const LivestockManagement = () => {
  const [activeSection, setActiveSection] = useState('cattleList');
  const [activeSubSection, setActiveSubSection] = useState(null);
  
  const renderContent = () => {
    switch (activeSection) {
      case 'cattleManagement':
        switch (activeSubSection) {
          case 'registration':
            return <CattleRegistration />;
          case 'list':
          default:
            return <CattleList />;
        }
      case 'healthRecords':
        return <CattleHealth />;
      case 'growthMetrics':
        return <CattleGrowth />;
      default:
        return <CattleList />;
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)]">
      <div className="flex w-full h-full bg-white shadow rounded-lg overflow-hidden">
        <LivestockSidebar 
          activeSection={activeSection} 
          setActiveSection={setActiveSection}
          activeSubSection={activeSubSection}
          setActiveSubSection={setActiveSubSection}
        />
        <div className="flex-1 p-6 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default LivestockManagement;
