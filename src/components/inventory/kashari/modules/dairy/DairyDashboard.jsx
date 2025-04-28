
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import DairySidebar from './sidebar/DairySidebar';
import CattleInventoryView from './sections/CattleInventoryView';
import GrowthMetricsView from './sections/GrowthMetricsView';
import MilkProductionView from './sections/MilkProductionView';
import AnalyticsView from './sections/AnalyticsView';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DairyDashboard = () => {
  const [activeSection, setActiveSection] = useState('cattleInventory');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'cattleInventory':
        return <CattleInventoryView />;
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
    <div className="h-[calc(100vh-4rem)]">
      <div className="flex w-full h-full bg-white shadow rounded-lg overflow-hidden">
        <div className={`relative ${isSidebarCollapsed ? 'w-16' : 'w-64'} transition-width duration-300 ease-in-out`}>
          <DairySidebar 
            activeSection={activeSection} 
            setActiveSection={setActiveSection}
            isCollapsed={isSidebarCollapsed}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-3 top-1/2 transform -translate-y-1/2 z-10"
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
