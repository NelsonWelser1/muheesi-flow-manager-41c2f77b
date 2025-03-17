
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const StatusTabs = ({ statusFilter, setStatusFilter }) => {
  return (
    <Tabs value={statusFilter} onValueChange={setStatusFilter} className="mb-4">
      <TabsList className="w-full justify-start">
        <TabsTrigger value="all">
          All
        </TabsTrigger>
        <TabsTrigger value="completed">
          Completed
        </TabsTrigger>
        <TabsTrigger value="pending">
          Pending
        </TabsTrigger>
        <TabsTrigger value="cancelled">
          Cancelled
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default StatusTabs;
