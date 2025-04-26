
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import PlantationSidebar from './BananaSidebar';
import HarvestRecords from './sections/HarvestRecords';
import ExpensesTracker from './sections/ExpensesTracker';

const BananaPlantationDashboard = () => {
  const [activeComponent, setActiveComponent] = useState('bananas');

  const renderContent = () => {
    switch (activeComponent) {
      case 'harvest-records':
        return <HarvestRecords />;
      case 'expenses':
        return <ExpensesTracker />;
      case 'sales':
        return <div className="p-6">Sales tracking module</div>;
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
            <h1 className="text-xl md:text-2xl font-bold">Plantation Inventory Management</h1>
          </div>
          {renderContent()}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default BananaPlantationDashboard;
