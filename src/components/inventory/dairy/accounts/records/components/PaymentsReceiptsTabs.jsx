
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PaymentsReceiptsTable from './PaymentsReceiptsTable';

const PaymentsReceiptsTabs = ({ filteredRecords, isLoading }) => {
  // Filter records by type for different tabs
  const receivedRecords = filteredRecords.filter(r => r.payment_type === 'received');
  const issuedRecords = filteredRecords.filter(r => r.payment_type === 'issued');

  return (
    <Tabs defaultValue="all">
      <TabsList className="w-full md:w-auto">
        <TabsTrigger value="all">All Records</TabsTrigger>
        <TabsTrigger value="received">Received</TabsTrigger>
        <TabsTrigger value="issued">Issued</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="pt-4">
        <PaymentsReceiptsTable 
          records={filteredRecords} 
          isLoading={isLoading} 
          tableType="all"
        />
      </TabsContent>
      
      <TabsContent value="received" className="pt-4">
        <PaymentsReceiptsTable 
          records={receivedRecords} 
          isLoading={isLoading} 
          tableType="received"
        />
      </TabsContent>
      
      <TabsContent value="issued" className="pt-4">
        <PaymentsReceiptsTable 
          records={issuedRecords} 
          isLoading={isLoading} 
          tableType="issued"
        />
      </TabsContent>
    </Tabs>
  );
};

export default PaymentsReceiptsTabs;
