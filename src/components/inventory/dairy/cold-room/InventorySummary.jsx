
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import SearchToolbar from './components/SearchToolbar';
import InventoryTable from './components/InventoryTable';
import InventorySummaryHeader from './components/InventorySummaryHeader';
import PrintStyles from './components/PrintStyles';
import { useInventorySummary } from './hooks/useInventorySummary';

const InventorySummary = () => {
  const {
    isLoading,
    error,
    filteredAndSortedData,
    columns,
    sortConfig,
    handleSearch,
    handleSort,
    handleDateRangeChange,
    refreshData
  } = useInventorySummary();

  return (
    <div className="space-y-4">
      <Card>
        <InventorySummaryHeader />
        <CardContent>
          <SearchToolbar
            onSearch={handleSearch}
            onRefresh={refreshData}
            onDateRangeChange={handleDateRangeChange}
            data={filteredAndSortedData}
            columns={columns}
            tableTitle="Cold Room Inventory"
            loading={isLoading}
          />

          <InventoryTable
            isLoading={isLoading}
            error={error}
            filteredAndSortedData={filteredAndSortedData}
            columns={columns}
            sortConfig={sortConfig}
            handleSort={handleSort}
          />
        </CardContent>
      </Card>

      <PrintStyles />
    </div>
  );
};

export default InventorySummary;
