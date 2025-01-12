import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CheeseProductionMonitor from './CheeseProductionMonitor';
import QualityControlPanel from './QualityControlPanel';
import MaintenanceTracker from './MaintenanceTracker';
import RawMaterialsManagement from './RawMaterialsManagement';
import EquipmentManagement from './EquipmentManagement';

const CheeseFactoryDashboard = () => {
  console.log('Rendering CheeseFactoryDashboard');
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="production" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="production">Production Monitor</TabsTrigger>
          <TabsTrigger value="quality">Quality Control</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="materials">Raw Materials</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
        </TabsList>

        <TabsContent value="production">
          <CheeseProductionMonitor />
        </TabsContent>

        <TabsContent value="quality">
          <QualityControlPanel />
        </TabsContent>

        <TabsContent value="maintenance">
          <MaintenanceTracker />
        </TabsContent>

        <TabsContent value="materials">
          <RawMaterialsManagement />
        </TabsContent>

        <TabsContent value="equipment">
          <EquipmentManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CheeseFactoryDashboard;