
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import CattleRegistration from './CattleRegistration';
import CattleList from './CattleList';
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
      case 'vaccinations':
        return (
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Vaccination Records</h3>
            <p className="text-muted-foreground">Vaccination records form and history will appear here</p>
          </Card>
        );
      case 'treatments':
        return (
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Treatment Records</h3>
            <p className="text-muted-foreground">Treatment records form and history will appear here</p>
          </Card>
        );
      case 'weightTracking':
        return (
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Weight Tracking</h3>
            <p className="text-muted-foreground">Weight tracking form and history will appear here</p>
          </Card>
        );
      case 'performance':
        return (
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Performance Metrics</h3>
            <p className="text-muted-foreground">Performance metrics and analytics will appear here</p>
          </Card>
        );
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
