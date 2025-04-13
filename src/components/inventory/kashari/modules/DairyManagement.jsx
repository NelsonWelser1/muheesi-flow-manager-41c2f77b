
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MilkProductionForm from './MilkProductionForm';
import MilkProductionRecords from './MilkProductionRecords';
import HerdManagement from './herd/HerdManagement';
import DairyAnalytics from './analytics/DairyAnalytics';
import { Beef, Droplet, BarChart } from "lucide-react";

const DairyManagement = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Dairy Management</h2>
      
      <Tabs defaultValue="milk-production" className="w-full">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="milk-production" className="flex items-center gap-2">
            <Droplet className="h-4 w-4" />
            Milk Production
          </TabsTrigger>
          <TabsTrigger value="herd-management" className="flex items-center gap-2">
            <Beef className="h-4 w-4" />
            Herd Management
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="milk-production" className="space-y-4">
          <MilkProductionForm />
          <MilkProductionRecords />
        </TabsContent>
        
        <TabsContent value="herd-management">
          <HerdManagement />
        </TabsContent>
        
        <TabsContent value="analytics">
          <DairyAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DairyManagement;
