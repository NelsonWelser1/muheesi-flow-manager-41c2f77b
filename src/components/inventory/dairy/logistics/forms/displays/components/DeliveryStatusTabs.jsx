
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DeliveryStatusTabs = ({ activeTab, setActiveTab }) => {
  return (
    <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-5 mb-4">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="in_transit">In Transit</TabsTrigger>
        <TabsTrigger value="delivered">Delivered</TabsTrigger>
        <TabsTrigger value="delayed">Delayed</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default DeliveryStatusTabs;
