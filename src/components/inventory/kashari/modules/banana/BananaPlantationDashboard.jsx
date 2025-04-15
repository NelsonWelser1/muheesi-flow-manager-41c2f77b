
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import PlantationSidebar from './BananaSidebar';
import CropPlanning from './sections/CropPlanning';
import PlantingRecords from './sections/PlantingRecords';
import HarvestRecords from './sections/HarvestRecords';
import ExpensesTracker from './sections/ExpensesTracker';

const PlantationDashboard = () => {
  const [activeComponent, setActiveComponent] = useState('planning');

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
      default:
        return <div className="p-6 text-center">Select a section from the sidebar</div>;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <PlantationSidebar
          activeComponent={activeComponent}
          onNavigate={setActiveComponent}
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
