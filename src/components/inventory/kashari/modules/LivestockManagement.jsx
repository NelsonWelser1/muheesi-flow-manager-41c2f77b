
import React, { useState } from 'react';
import CattleRegistration from './CattleRegistration';
import CattleList from './CattleList';
import CattleHealth from './CattleHealth';
import CattleGrowth from './CattleGrowth';
import LivestockSidebar from './livestock/LivestockSidebar';

const LivestockManagement = () => {
  const [activeSection, setActiveSection] = useState('cattleList');
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeSection) {
      case 'cattleList':
        return <CattleList />;
      case 'registration':
        return <CattleRegistration />;
      case 'health':
        return <CattleHealth />;
      case 'growth':
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
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <div className="flex-1 p-6 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default LivestockManagement;
