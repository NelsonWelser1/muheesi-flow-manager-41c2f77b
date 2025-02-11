
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RealTimeMonitoring from './RealTimeMonitoring';
import InventorySummary from './InventorySummary';
import MovementTracking from './MovementTracking';
import DataEntryForm from './DataEntryForm';
import { useSupabaseAuth } from '@/integrations/supabase/auth';

const ColdRoomDashboard = () => {
  const { session } = useSupabaseAuth();
  const user = session?.user;

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Cold Room Management</h1>
      </div>

      <Tabs defaultValue="monitoring" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="monitoring">Real-Time Monitoring</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Summary</TabsTrigger>
          <TabsTrigger value="movement">Movement Tracking</TabsTrigger>
          <TabsTrigger value="data-entry">Data Entry</TabsTrigger>
        </TabsList>

        <TabsContent value="monitoring">
          <Card>
            <CardHeader>
              <CardTitle>Real-Time Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <RealTimeMonitoring />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <InventorySummary />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movement">
          <Card>
            <CardHeader>
              <CardTitle>Movement Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <MovementTracking />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data-entry">
          <Card>
            <CardHeader>
              <CardTitle>Data Entry Form</CardTitle>
            </CardHeader>
            <CardContent>
              <DataEntryForm userId={user?.id} username={user?.email} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ColdRoomDashboard;
