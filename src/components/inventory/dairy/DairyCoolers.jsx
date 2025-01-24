import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MilkReception from './milk-reception/MilkReception';
import DairyCoolerDashboard from './storage/DairyCoolerDashboard';

const DairyCoolers = () => {
  console.log('Rendering DairyCoolers component');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reception & Milk Coolers Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="milk-reception">Milk Reception</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DairyCoolerDashboard />
          </TabsContent>

          <TabsContent value="milk-reception">
            <MilkReception />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DairyCoolers;