
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import PlantationSidebar from './PlantationSidebar';
import CropPlanning from './sections/CropPlanning';
import PlantingRecords from './sections/PlantingRecords';
import HarvestRecords from './sections/HarvestRecords';
import ExpensesTracker from './sections/ExpensesTracker';
import WorkerManagement from './sections/WorkerManagement';
import EquipmentTracker from './sections/EquipmentTracker';
import HarvestSchedule from './sections/HarvestSchedule';
import InventoryManagement from './sections/InventoryManagement';
import GrowthAnalytics from './sections/GrowthAnalytics';
import FarmMap from './sections/FarmMap';
import { useToast } from "@/components/ui/use-toast";

const PlantationDashboard = () => {
  const [activeComponent, setActiveComponent] = useState('planning');
  const { toast } = useToast();

  const handleNavigate = (component) => {
    setActiveComponent(component);
    
    // Check if component is implemented yet
    const implementedComponents = [
      'planning', 'planting-records', 'harvest-records', 'expenses',
      'workers', 'equipment', 'schedule', 'inventory', 'analytics'
    ];
    
    if (!implementedComponents.includes(component)) {
      toast({
        title: "Feature Coming Soon",
        description: "This feature is currently under development.",
        duration: 3000,
      });
    }
  };

  const renderContent = () => {
    switch (activeComponent) {
      case 'planning':
        return <CropPlanning />;
      case 'planting-records':
        return <PlantingRecords />;
      case 'harvest-records':
        return <HarvestRecords />;
      case 'expenses':
        return <ExpensesTracker />;
      case 'workers':
        return <WorkerManagement />;
      case 'equipment':
        return <EquipmentTracker />;
      case 'schedule':
        return <HarvestSchedule />;
      case 'inventory':
        return <InventoryManagement />;
      case 'analytics':
        return <GrowthAnalytics />;
      case 'farm-map':
        return <FarmMap />;
      default:
        return (
          <div className="p-6 text-center flex flex-col items-center justify-center min-h-[500px]">
            <div className="text-muted-foreground mb-2">Select a section from the sidebar</div>
            <p className="text-sm text-gray-500 max-w-md">
              The Plantation Management System helps you track all aspects of your farming operation, 
              from planning and planting to harvesting and selling your produce.
            </p>
          </div>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <PlantationSidebar
          activeComponent={activeComponent}
          onNavigate={handleNavigate}
        />
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="mb-4 flex items-center">
            <SidebarTrigger className="md:hidden mr-2" />
            <h1 className="text-xl md:text-2xl font-bold">Plantation Management</h1>
          </div>
          {renderContent()}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default PlantationDashboard;
