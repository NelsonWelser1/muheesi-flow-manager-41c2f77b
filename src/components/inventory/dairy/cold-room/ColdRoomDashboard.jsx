
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InventorySummary from './components/InventorySummary';
import MovementTracker from './components/MovementTracker';
import InventoryForm from './components/InventoryForm';
import MetricsCards from './components/MetricsCards';

const ColdRoomDashboard = () => {
  return (
    <div className="space-y-6">
      <MetricsCards />

      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList>
          <TabsTrigger value="summary">Inventory Summary</TabsTrigger>
          <TabsTrigger value="movements">Movement Tracker</TabsTrigger>
          <TabsTrigger value="entry">New Entry</TabsTrigger>
        </TabsList>
        <TabsContent value="summary">
          <InventorySummary />
        </TabsContent>
        <TabsContent value="movements">
          <MovementTracker />
        </TabsContent>
        <TabsContent value="entry">
          <InventoryForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ColdRoomDashboard;
