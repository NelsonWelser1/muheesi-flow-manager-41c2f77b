
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import EquipmentList from './equipment/list/EquipmentList';
import MaintenanceHub from './equipment/maintenance/MaintenanceHub';

const EquipmentManagement = () => {
  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-3xl font-bold">Equipment Management</h1>
      
      <Tabs defaultValue="equipment" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="equipment">Equipment List</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance Hub</TabsTrigger>
        </TabsList>
        
        <TabsContent value="equipment">
          <Card className="p-4">
            <EquipmentList />
          </Card>
        </TabsContent>
        
        <TabsContent value="maintenance">
          <Card className="p-4">
            <MaintenanceHub />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EquipmentManagement;
