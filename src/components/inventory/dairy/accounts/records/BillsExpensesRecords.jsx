
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useBillsExpenses } from "@/integrations/supabase/hooks/accounting/useBillsExpenses";

// Import our component modules
import ExportActions from './components/ExportActions';
import SearchFilters from './components/SearchFilters';
import StatusTabs from './components/StatusTabs';
import { useRecordsFilter } from './hooks/useRecordsFilter';

const BillsExpensesRecords = ({ onBack }) => {
  const { billsExpenses, loading, fetchBillsExpenses } = useBillsExpenses();
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
  } = useRecordsFilter(billsExpenses);

  useEffect(() => {
    fetchBillsExpenses();
  }, []);

  const handleRefresh = () => {
    fetchBillsExpenses();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Form
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <ExportActions filteredRecords={filteredRecords} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bills & Expenses Records</CardTitle>
          <SearchFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </CardHeader>
        <CardContent>
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

export default BillsExpensesRecords;
