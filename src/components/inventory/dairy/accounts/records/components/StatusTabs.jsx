
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecordsTable from './RecordsTable';

const StatusTabs = ({ 
  statusFilter, 
  setStatusFilter, 
  filteredRecords, 
  loading 
}) => {
  return (
    <Tabs defaultValue="all" value={statusFilter} onValueChange={setStatusFilter}>
      <TabsList className="mb-4">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="paid">Paid</TabsTrigger>
        <TabsTrigger value="overdue">Overdue</TabsTrigger>
        <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
      </TabsList>

      <TabsContent value={statusFilter}>
        {loading ? (
          <div className="text-center py-8">Loading records...</div>
        ) : filteredRecords.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No records found. Try adjusting your filters.
          </div>
        ) : (
          <RecordsTable filteredRecords={filteredRecords} />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default StatusTabs;
