
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SmartProductionMonitor from './SmartProductionMonitor';
import BatchScheduler from './BatchScheduler';
import ProductionAnalytics from './ProductionAnalytics';

const SmartProductionDashboard = () => {
  console.log('Rendering SmartProductionDashboard');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Smart Production Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="monitor" className="space-y-4">
            <TabsList>
              <TabsTrigger value="monitor">Production Monitor</TabsTrigger>
              <TabsTrigger value="schedule">Batch Scheduler</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="monitor">
              <SmartProductionMonitor />
            </TabsContent>

            <TabsContent value="schedule">
              <BatchScheduler />
            </TabsContent>

            <TabsContent value="analytics">
              <ProductionAnalytics />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartProductionDashboard;
