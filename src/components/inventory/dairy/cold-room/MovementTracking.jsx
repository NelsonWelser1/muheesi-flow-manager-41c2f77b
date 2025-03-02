
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import SearchToolbar from './components/SearchToolbar';
import MovementFilter from './components/MovementFilter';
import MovementHeader from './components/MovementHeader';
import MovementTable from './components/MovementTable';
import MovementPrintStyles from './components/MovementPrintStyles';
import { useMovementTracking } from './hooks/useMovementTracking';

const MovementTracking = () => {
  const {
    loading,
    error,
    filter,
    setFilter,
    filteredAndSortedData,
    columns,
    sortConfig,
    handleSearch,
    handleSort,
    handleDateRangeChange,
    fetchInventory
  } = useMovementTracking();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <MovementHeader />
        <MovementFilter filter={filter} setFilter={setFilter} />
      </div>

      <Card>
        <CardContent className="p-4">
          <SearchToolbar
            onSearch={handleSearch}
            onRefresh={fetchInventory}
            onDateRangeChange={handleDateRangeChange}
            data={filteredAndSortedData}
            columns={columns}
            tableTitle="Movement History"
            loading={loading}
          />

          <MovementTable
            loading={loading}
            error={error}
            filteredAndSortedData={filteredAndSortedData}
            columns={columns}
            sortConfig={sortConfig}
            handleSort={handleSort}
          />
        </CardContent>
      </Card>

      <MovementPrintStyles />
    </div>
  );
};

export default MovementTracking;
