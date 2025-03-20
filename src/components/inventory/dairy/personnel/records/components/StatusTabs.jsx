
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

const StatusTabs = ({ onStatusChange }) => {
  return (
    <TabsList>
      <TabsTrigger value="all">All</TabsTrigger>
      <TabsTrigger value="Pending">Pending</TabsTrigger>
      <TabsTrigger value="In Progress">In Progress</TabsTrigger>
      <TabsTrigger value="Scheduled">Scheduled</TabsTrigger>
      <TabsTrigger value="Completed">Completed</TabsTrigger>
      <TabsTrigger value="Rejected">Rejected</TabsTrigger>
    </TabsList>
  );
};

export default StatusTabs;
