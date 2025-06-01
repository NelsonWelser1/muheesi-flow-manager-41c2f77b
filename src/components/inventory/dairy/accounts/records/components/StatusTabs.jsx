
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const StatusTabs = ({ statusFilter, setStatusFilter, filteredRecords, loading, recordsTable }) => {
  // Count records by status
  const getCounts = () => {
    const counts = {
      all: filteredRecords.length,
      paid: 0,
      pending: 0,
      overdue: 0,
      cancelled: 0
    };

    filteredRecords.forEach(record => {
      if (record.status && counts[record.status] !== undefined) {
        counts[record.status]++;
      }
    });

    return counts;
  };

  const counts = getCounts();

  return (
    <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full">
      <TabsList className="w-full flex mb-4">
        <TabsTrigger value="all" className="flex-1">
          All <Badge variant="outline" className="ml-2">{counts.all}</Badge>
        </TabsTrigger>
        <TabsTrigger value="paid" className="flex-1">
          Paid <Badge variant="outline" className="ml-2">{counts.paid}</Badge>
        </TabsTrigger>
        <TabsTrigger value="pending" className="flex-1">
          Pending <Badge variant="outline" className="ml-2">{counts.pending}</Badge>
        </TabsTrigger>
        <TabsTrigger value="overdue" className="flex-1">
          Overdue <Badge variant="outline" className="ml-2">{counts.overdue}</Badge>
        </TabsTrigger>
        <TabsTrigger value="cancelled" className="flex-1">
          Cancelled <Badge variant="outline" className="ml-2">{counts.cancelled}</Badge>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="mt-0">
        {recordsTable}
      </TabsContent>
      <TabsContent value="paid" className="mt-0">
        {recordsTable}
      </TabsContent>
      <TabsContent value="pending" className="mt-0">
        {recordsTable}
      </TabsContent>
      <TabsContent value="overdue" className="mt-0">
        {recordsTable}
      </TabsContent>
      <TabsContent value="cancelled" className="mt-0">
        {recordsTable}
      </TabsContent>
    </Tabs>
  );
};

export default StatusTabs;
