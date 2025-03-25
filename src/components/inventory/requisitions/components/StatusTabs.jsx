
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const StatusTabs = ({ status, onStatusChange }) => {
  return (
    <Tabs value={status} onValueChange={onStatusChange} className="w-full">
      <TabsList className="w-full grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="approved">Approved</TabsTrigger>
        <TabsTrigger value="rejected">Rejected</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default StatusTabs;
