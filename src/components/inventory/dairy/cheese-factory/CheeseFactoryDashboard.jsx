import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RawMaterialsManagement from './RawMaterialsManagement';
import EquipmentManagement from './EquipmentManagement';

const CheeseFactoryDashboard = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="materials" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="materials">Raw Materials</TabsTrigger>
          <TabsTrigger value="equipment">Equipment & Machinery</TabsTrigger>
        </TabsList>

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