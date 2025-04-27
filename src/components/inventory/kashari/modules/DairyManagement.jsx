
import React, { useState } from 'react';
import MilkProductionForm from './MilkProductionForm';
import MilkProductionRecords from './MilkProductionRecords';
import HerdManagement from './herd/HerdManagement';
import DairyAnalytics from './analytics/DairyAnalytics';
import DairySidebar from './dairy/DairySidebar';

const DairyManagement = () => {
  const [activeSection, setActiveSection] = useState('herdManagement');
  const [activeTab, setActiveTab] = useState('inventory');

  const renderContent = () => {
    switch (activeSection) {
      case 'herdManagement':
        return <HerdManagement initialTab={activeTab} />;
      case 'milkProduction':
        return (
          <div className="space-y-4">
            <MilkProductionForm />
            <MilkProductionRecords />
          </div>
        );
      case 'analytics':
        return <DairyAnalytics initialTab={activeTab} />;
      default:
        return <HerdManagement initialTab={activeTab} />;
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Dairy Management</h2>
      
      <div className="flex w-full h-[calc(100vh-12rem)] overflow-hidden rounded-lg border bg-white shadow">
        <DairySidebar 
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

export default DairyManagement;
