
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MilkProductionForm from './MilkProductionForm';
import MilkProductionRecords from './MilkProductionRecords';
import { Cow, Droplet, BarChart } from "lucide-react";

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
            <Cow className="h-4 w-4" />
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cow className="h-5 w-5 text-orange-500" />
                Herd Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Herd management features coming soon. This section will include cattle tracking, 
                health records, breeding information, and feeding schedules.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-green-500" />
                Dairy Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Dairy analytics features coming soon. This section will include production trends, 
                quality metrics, and financial performance indicators.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DairyManagement;
