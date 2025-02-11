
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InventorySummary from './components/InventorySummary';
import RealTimeMonitoring from './components/RealTimeMonitoring';
import MovementTracking from './components/MovementTracking';
import DataEntryForm from './components/DataEntryForm';
import { useSupabaseAuth } from '@/integrations/supabase/auth';

const ColdRoomDashboard = () => {
  const { user } = useSupabaseAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Cold Room Inventory Dashboard</h1>
      
      <Tabs defaultValue="summary" className="w-full">
        <TabsList>
          <TabsTrigger value="summary">Inventory Summary</TabsTrigger>
          <TabsTrigger value="monitoring">Real-Time Monitoring</TabsTrigger>
          <TabsTrigger value="movement">Movement Tracking</TabsTrigger>
          <TabsTrigger value="entry">Data Entry</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <InventorySummary />
        </TabsContent>

        <TabsContent value="monitoring">
          <RealTimeMonitoring />
        </TabsContent>

        <TabsContent value="movement">
          <MovementTracking />
        </TabsContent>

        <TabsContent value="entry">
          <DataEntryForm user={user} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ColdRoomDashboard;
