
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MilkProductionForm from "@/components/inventory/kashari/modules/MilkProductionForm";
import MilkProductionRecords from "@/components/inventory/kashari/modules/MilkProductionRecords";
import { Cow, Milk, BarChart3, Droplet } from "lucide-react";

const MilkProductionView = () => {
  const [activeTab, setActiveTab] = useState('daily');

  // Calculate summary metrics (these would come from actual data in a real implementation)
  const totalMilkToday = 758; // liters
  const milkingCows = 43;
  const avgPerCow = (totalMilkToday / milkingCows).toFixed(1);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Milk Production</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Today's Production</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{totalMilkToday} L</div>
              <Milk className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Milking Cows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{milkingCows}</div>
              <Cow className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Avg. per Cow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{avgPerCow} L</div>
              <Droplet className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="daily">Record Production</TabsTrigger>
          <TabsTrigger value="history">Production History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4 pt-4">
          <MilkProductionForm />
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4 pt-4">
          <MilkProductionRecords />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Production Analytics</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Production trend analytics will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MilkProductionView;
