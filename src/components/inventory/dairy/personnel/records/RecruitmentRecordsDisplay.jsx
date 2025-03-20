
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useRecruitmentFilters } from './hooks/useRecruitmentFilters';
import RecordsHeader from './components/RecordsHeader';
import TabsContainer from './components/TabsContainer';

const RecruitmentRecordsDisplay = () => {
  const {
    timeRange,
    searchTerm,
    records,
    isLoading,
    error,
    refreshData,
    handleTimeRangeChange,
    handleSearch,
    handleStatusChange
  } = useRecruitmentFilters();

  return (
    <Card className="w-full">
      <RecordsHeader records={records} />
      <CardContent>
        <TabsContainer 
          onStatusChange={handleStatusChange}
          onTimeRangeChange={handleTimeRangeChange}
          onSearch={handleSearch}
          onRefresh={refreshData}
          timeRange={timeRange}
          searchTerm={searchTerm}
          records={records}
          isLoading={isLoading}
          error={error}
        />
      </CardContent>
    </Card>
  );
};

export default RecruitmentRecordsDisplay;
