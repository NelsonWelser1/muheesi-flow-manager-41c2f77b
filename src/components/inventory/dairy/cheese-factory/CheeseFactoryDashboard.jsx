
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EquipmentManagement from './EquipmentManagement';

const CheeseFactoryDashboard = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Cheese Factory Management</h1>
      
      <Tabs defaultValue="equipment" className="w-full">
        <TabsList>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="production">Production</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="quality">Quality Control</TabsTrigger>
        </TabsList>
        
        <TabsContent value="equipment">
          <EquipmentManagement />
        </TabsContent>
        
        <TabsContent value="production">
          {/* Production content */}
        </TabsContent>
        
        <TabsContent value="inventory">
          {/* Inventory content */}
        </TabsContent>
        
        <TabsContent value="quality">
          {/* Quality Control content */}
        </TabsContent>
      </Tabs>
      
      <Outlet />
    </div>
  );
};

export default CheeseFactoryDashboard;
