
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import PaymentsTable from './PaymentsTable';

const StatusTabs = ({ statusFilter, setStatusFilter, filteredRecords, loading }) => {
  // Count records by status
  const getCounts = () => {
    const counts = {
      all: filteredRecords.length,
      completed: 0,
      pending: 0,
      failed: 0
    };

    filteredRecords.forEach(record => {
      if (record.status && counts[record.status] !== undefined) {
        counts[record.status]++;
      }
    });

    return counts;
  };

  const counts = getCounts();

  // Filter records based on status for each tab
  const getFilteredRecordsByStatus = (status) => {
    if (status === 'all') return filteredRecords;
    return filteredRecords.filter(record => record.status === status);
  };

  return (
    <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full">
      <TabsList className="w-full flex mb-4">
        <TabsTrigger value="all" className="flex-1">
          All <Badge variant="outline" className="ml-2">{counts.all}</Badge>
        </TabsTrigger>
        <TabsTrigger value="completed" className="flex-1">
          Completed <Badge variant="outline" className="ml-2">{counts.completed}</Badge>
        </TabsTrigger>
        <TabsTrigger value="pending" className="flex-1">
          Pending <Badge variant="outline" className="ml-2">{counts.pending}</Badge>
        </TabsTrigger>
        <TabsTrigger value="failed" className="flex-1">
          Failed <Badge variant="outline" className="ml-2">{counts.failed}</Badge>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="mt-0">
        <PaymentsTable records={getFilteredRecordsByStatus('all')} loading={loading} />
      </TabsContent>
      <TabsContent value="completed" className="mt-0">
        <PaymentsTable records={getFilteredRecordsByStatus('completed')} loading={loading} />
      </TabsContent>
      <TabsContent value="pending" className="mt-0">
        <PaymentsTable records={getFilteredRecordsByStatus('pending')} loading={loading} />
      </TabsContent>
      <TabsContent value="failed" className="mt-0">
        <PaymentsTable records={getFilteredRecordsByStatus('failed')} loading={loading} />
      </TabsContent>
    </Tabs>
  );
};

export default StatusTabs;
