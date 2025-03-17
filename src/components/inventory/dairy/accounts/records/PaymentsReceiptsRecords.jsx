
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { usePaymentsReceipts } from "@/integrations/supabase/hooks/accounting/payments/usePaymentsReceipts";
import SearchFilters from './components/SearchFilters';
import StatusTabs from './components/StatusTabs';
import PaymentsReceiptsTable from './components/PaymentsReceiptsTable';
import ExportActions from './components/ExportActions';
import { useRecordsFilter } from './hooks/useRecordsFilter';

const PaymentsReceiptsRecords = () => {
  const { payments, loading, fetchPayments } = usePaymentsReceipts();
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    timeRange,
    setTimeRange,
    sortBy,
    setSortBy,
    filteredRecords
  } = useRecordsFilter(payments);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Payments & Receipts Records</h2>
        <div className="flex gap-2">
          <ExportActions filteredRecords={filteredRecords} />
          <Button 
            variant="outline" 
            size="icon"
            onClick={fetchPayments}
            title="Refresh Records"
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <CardTitle>Payment Records</CardTitle>
        </CardHeader>
        <CardContent>
          <SearchFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />

          <StatusTabs
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            filteredRecords={filteredRecords}
            loading={loading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsReceiptsRecords;
