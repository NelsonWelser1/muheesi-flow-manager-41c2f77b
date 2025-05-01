
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MilkProductionForm from "@/components/inventory/kashari/modules/MilkProductionForm";
import MilkProductionRecords from "@/components/inventory/kashari/modules/MilkProductionRecords";
import { Droplet, BarChart3, Activity, Users } from "lucide-react";
import ProductionTrendsChart from '@/components/inventory/kashari/modules/analytics/ProductionTrendsChart';
import { useMilkProduction } from '@/hooks/useMilkProduction';

const MilkProductionView = () => {
  // Use more stable state management with localStorage to persist tab selection
  const [activeTab, setActiveTab] = useState(() => {
    // Try to get the saved tab from localStorage, default to 'daily'
    const savedTab = localStorage.getItem('milkProductionActiveTab');
    return savedTab || 'daily';
  });

  // Save the active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('milkProductionActiveTab', activeTab);
  }, [activeTab]);

  const { milkRecords, isLoading } = useMilkProduction();

  // Calculate summary metrics from actual data
  const todayStr = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format
  const todayRecords = milkRecords.filter(record => record.date === todayStr);
  
  const totalMilkToday = todayRecords.reduce((sum, record) => sum + Number(record.volume || 0), 0);
  
  // Get unique count of cows from today's records (if multiple sessions have same cows, count once)
  const milkingCowsSet = new Set();
  todayRecords.forEach(record => {
    if (record.milking_cows) {
      milkingCowsSet.add(record.milking_cows);
    }
  });
  const milkingCows = todayRecords.length > 0 ? 
    Math.max(...todayRecords.map(r => Number(r.milking_cows || 0))) : 0;
  
  const avgPerCow = milkingCows > 0 ? (totalMilkToday / milkingCows).toFixed(1) : "0.0";

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
              <div className="text-2xl font-bold">{totalMilkToday.toFixed(1)} L</div>
              <Droplet className="h-8 w-8 text-blue-500" />
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
              <Users className="h-8 w-8 text-green-500" />
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
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue={activeTab}>
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
          <ProductionTrendsChart 
            milkData={milkRecords} 
            isLoading={isLoading}
            dateRange="month"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MilkProductionView;
