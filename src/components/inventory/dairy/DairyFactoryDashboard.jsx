import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProductionData, useRawMaterialsInventory } from '@/integrations/supabase/hooks/useGrandBernaDairies';
import ProductionSchedule from './factory/ProductionSchedule';
import InventoryStatus from './factory/InventoryStatus';
import QualityControl from './factory/QualityControl';
import ProductionForms from './factory/ProductionForms';

const DairyFactoryDashboard = () => {
  const { data: productionData, isLoading: isLoadingProduction } = useProductionData();
  const { data: inventory, isLoading: isLoadingInventory } = useRawMaterialsInventory();

  console.log('Rendering DairyFactoryDashboard', { productionData, inventory });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dairy Factory Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Production Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Total Batches: {productionData?.length || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Raw Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Stock Items: {inventory?.length || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quality Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Pending Checks: {productionData?.filter(p => p.quality_status === 'pending').length || 0}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="schedule" className="w-full">
        <TabsList>
          <TabsTrigger value="schedule">Production Schedule</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="quality">Quality Control</TabsTrigger>
          <TabsTrigger value="production">Production</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule">
          <ProductionSchedule data={productionData} isLoading={isLoadingProduction} />
        </TabsContent>

        <TabsContent value="inventory">
          <InventoryStatus data={inventory} isLoading={isLoadingInventory} />
        </TabsContent>

        <TabsContent value="quality">
          <QualityControl data={productionData} isLoading={isLoadingProduction} />
        </TabsContent>

        <TabsContent value="production">
          <ProductionForms />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DairyFactoryDashboard;