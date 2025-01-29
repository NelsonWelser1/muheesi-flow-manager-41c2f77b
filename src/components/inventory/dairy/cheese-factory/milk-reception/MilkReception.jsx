import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MilkReceptionForm from './MilkReceptionForm';
import MilkReceptionTable from './MilkReceptionTable';
import MilkReceptionSettings from './MilkReceptionSettings';

const MilkReception = () => {
  return (
    <Tabs defaultValue="view" className="w-full">
      <TabsList>
        <TabsTrigger value="view">View Records</TabsTrigger>
        <TabsTrigger value="add">Add New Record</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="view">
        <MilkReceptionTable />
      </TabsContent>

      <TabsContent value="add">
        <MilkReceptionForm />
      </TabsContent>

      <TabsContent value="settings">
        <MilkReceptionSettings />
      </TabsContent>
    </Tabs>
  );
};

export default MilkReception;