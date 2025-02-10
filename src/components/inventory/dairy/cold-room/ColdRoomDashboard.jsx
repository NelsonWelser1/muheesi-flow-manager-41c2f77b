
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InventorySummary from './components/InventorySummary';
import MovementTracker from './components/MovementTracker';
import InventoryForm from './components/InventoryForm';
import MetricsCards from './components/MetricsCards';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const ColdRoomDashboard = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-bold mb-6">Cold Room Dashboard</h1>
        
        <MetricsCards />

        <Tabs defaultValue="summary" className="space-y-4">
          <TabsList className="w-full justify-start">
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
    </QueryClientProvider>
  );
};

export default ColdRoomDashboard;
