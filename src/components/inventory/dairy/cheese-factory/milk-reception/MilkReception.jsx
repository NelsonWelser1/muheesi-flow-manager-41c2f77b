import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MilkReceptionForm from './MilkReceptionForm';
import MilkReceptionTable from './MilkReceptionTable';
import MilkReceptionSettings from './MilkReceptionSettings';
import MilkOffloadForm from './MilkOffloadForm';

const MilkReception = () => {
  return (
    <Tabs defaultValue="view" className="w-full">
      <TabsList>
        <TabsTrigger value="view">View Records</TabsTrigger>
        <TabsTrigger value="add">Add New Record</TabsTrigger>
        <TabsTrigger value="offload">Offload Milk Tanks</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="view">
        <MilkReceptionTable />
      </TabsContent>

      <TabsContent value="add">
        <MilkReceptionForm />
      </TabsContent>

      <TabsContent value="offload">
        <MilkOffloadForm />
      </TabsContent>

      <TabsContent value="settings">
        <MilkReceptionSettings />
      </TabsContent>
    </Tabs>
  );
};

export default MilkReception;