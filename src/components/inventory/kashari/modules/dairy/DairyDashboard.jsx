
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import DairySidebar from './DairySidebar';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import content views
import CattleInventoryView from './sections/CattleInventoryView';
import HealthRecordsView from './sections/HealthRecordsView';
import GrowthMetricsView from './sections/GrowthMetricsView';
import MilkProductionView from './sections/MilkProductionView';
import AnalyticsView from './sections/AnalyticsView';

const DairyDashboard = () => {
  const [activeSection, setActiveSection] = useState('herdManagement');
  const [activeTab, setActiveTab] = useState('inventory');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const renderContent = () => {
    if (activeSection === 'herdManagement') {
      switch(activeTab) {
        case 'inventory':
          return <CattleInventoryView />;
        case 'health':
          return <HealthRecordsView />;
        case 'growth':
          return <GrowthMetricsView />;
        default:
          return <CattleInventoryView />;
      }
    }
    else if (activeSection === 'milkProduction') {
      return <MilkProductionView />;
    }
    else if (activeSection === 'analytics') {
      return <AnalyticsView activeTab={activeTab} />;
    }
    
    return <CattleInventoryView />;
  };

  return (
    <div className="h-[calc(100vh-4rem)]">
      <div className="flex w-full h-full bg-white shadow rounded-lg overflow-hidden">
        <div className={`relative transition-all duration-300 ease-in-out`}>
          <DairySidebar 
            activeSection={activeSection} 
            setActiveSection={setActiveSection}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isCollapsed={isSidebarCollapsed}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-3 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow rounded-full h-6 w-6"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        <div className="flex-1 p-6 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default DairyDashboard;
