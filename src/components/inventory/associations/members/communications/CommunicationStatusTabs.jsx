
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CommunicationStatusTabs = ({ status, setStatus }) => {
  return (
    <Tabs value={status} onValueChange={setStatus} className="w-full">
      <TabsList className="grid grid-cols-5">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="sent">Sent</TabsTrigger>
        <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
        <TabsTrigger value="draft">Draft</TabsTrigger>
        <TabsTrigger value="failed">Failed</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default CommunicationStatusTabs;
