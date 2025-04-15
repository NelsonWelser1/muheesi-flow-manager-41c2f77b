
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import BananaSidebar from './BananaSidebar';
import CropPlanning from './sections/CropPlanning';

const BananaPlantationDashboard = () => {
  const [activeComponent, setActiveComponent] = useState('planning');

  const renderContent = () => {
    switch (activeComponent) {
      case 'planning':
        return <CropPlanning />;
      default:
        return <div>Select a section from the sidebar</div>;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <BananaSidebar
          activeComponent={activeComponent}
          onNavigate={setActiveComponent}
        />
        <main className="flex-1 p-6">
          <SidebarTrigger className="mb-4" />
          {renderContent()}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default BananaPlantationDashboard;
