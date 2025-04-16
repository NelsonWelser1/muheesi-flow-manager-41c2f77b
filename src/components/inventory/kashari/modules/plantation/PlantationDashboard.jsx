
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import PlantationSidebar from "./PlantationSidebar";
import { useToast } from "@/components/ui/use-toast";
import InventoryManagement from './sections/InventoryManagement';
import StockLevels from './sections/StockLevels';
import QualityControl from './sections/QualityControl';

const PlantationDashboard = () => {
  const [activeComponent, setActiveComponent] = useState("inventory");
  const { toast } = useToast();

  const handleNavigate = (component) => {
    setActiveComponent(component);
    const implementedComponents = ["inventory", "stock", "quality"];
    
    if (!implementedComponents.includes(component)) {
      toast({
        title: "Feature Coming Soon",
        description: "This feature is currently under development.",
        duration: 3000
      });
    }
  };

  const renderContent = () => {
    switch (activeComponent) {
      case "inventory":
        return <InventoryManagement />;
      case "stock":
        return <StockLevels />;
      case "quality":
        return <QualityControl />;
      default:
        return (
          <div className="p-6 text-center flex flex-col items-center justify-center min-h-[500px]">
            <div className="text-muted-foreground mb-2">Select a section from the sidebar</div>
            <p className="text-sm text-gray-500 max-w-md">
              Track and manage plantation inventory, stock levels, and quality control for banana products.
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
            <h1 className="text-xl md:text-2xl font-bold">Plantation Inventory Management</h1>
          </div>
          {renderContent()}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default PlantationDashboard;
