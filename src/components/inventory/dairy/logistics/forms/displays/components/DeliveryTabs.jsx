
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const DeliveryTabs = ({ activeTab, setActiveTab, deliveries }) => {
  // Count deliveries by status
  const counts = {
    all: deliveries.length,
    pending: deliveries.filter(d => d.status === "Pending").length,
    in_transit: deliveries.filter(d => d.status === "In Transit").length,
    delivered: deliveries.filter(d => d.status === "Delivered").length,
    delayed: deliveries.filter(d => d.status === "Delayed").length,
    cancelled: deliveries.filter(d => d.status === "Cancelled").length,
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-6 mb-4">
        <TabsTrigger value="all" className="relative">
          All
          <Badge variant="secondary" className="ml-1">{counts.all}</Badge>
        </TabsTrigger>
        <TabsTrigger value="pending" className="relative">
          Pending
          <Badge variant="secondary" className="ml-1">{counts.pending}</Badge>
        </TabsTrigger>
        <TabsTrigger value="in_transit" className="relative">
          In Transit
          <Badge variant="secondary" className="ml-1">{counts.in_transit}</Badge>
        </TabsTrigger>
        <TabsTrigger value="delivered" className="relative">
          Delivered
          <Badge variant="secondary" className="ml-1">{counts.delivered}</Badge>
        </TabsTrigger>
        <TabsTrigger value="delayed" className="relative">
          Delayed
          <Badge variant="secondary" className="ml-1">{counts.delayed}</Badge>
        </TabsTrigger>
        <TabsTrigger value="cancelled" className="relative">
          Cancelled
          <Badge variant="secondary" className="ml-1">{counts.cancelled}</Badge>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default DeliveryTabs;
