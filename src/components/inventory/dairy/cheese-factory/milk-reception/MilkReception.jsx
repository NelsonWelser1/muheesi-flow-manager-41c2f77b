
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MilkReceptionForm from './MilkReceptionForm';
import MilkReceptionTable from './MilkReceptionTable';
import MilkReceptionSettings from './MilkReceptionSettings';
import MilkOffloadForm from './MilkOffloadForm';

const MilkReception = () => {
  const [activeTab, setActiveTab] = useState('view');

  const handleSwitchToOffloadTab = () => {
    setActiveTab('offload');
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList>
        <TabsTrigger value="view">View Records</TabsTrigger>
        <TabsTrigger value="add">Add New Record</TabsTrigger>
        <TabsTrigger value="offload">Offload Milk Tanks</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="view" className="px-0 mx-0 my-[10px] py-[10px]">
        <MilkReceptionTable onSwitchToOffloadTab={handleSwitchToOffloadTab} />
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
