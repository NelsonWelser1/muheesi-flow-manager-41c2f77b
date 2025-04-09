
import React, { useState } from 'react';
import { Tabs } from "@/components/ui/tabs";
import Header from './components/Header';
import ExportMetrics from './components/ExportMetrics';
import AlertNotification from './components/AlertNotification';
import NavigationTabs from './components/NavigationTabs';
import ContentTabs from './components/ContentTabs';

const EquatorExportManagement = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const exportMetrics = {
    pendingShipments: 5,
    activeContracts: 12,
    revenue: '$1.2M',
    newBuyers: 3
  };
  
  return (
    <div className="space-y-6">
      {/* Header with compliance button */}
      <Header />
      
      {/* Export Quick Metrics */}
      <ExportMetrics metrics={exportMetrics} />
      
      {/* Alert Notifications */}
      <AlertNotification />
      
      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <ContentTabs activeTab={activeTab} />
      </Tabs>
    </div>
  );
};

export default EquatorExportManagement;
