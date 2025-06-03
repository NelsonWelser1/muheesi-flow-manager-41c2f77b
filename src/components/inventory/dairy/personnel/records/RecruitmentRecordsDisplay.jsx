
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useRecruitmentFilters } from './hooks/useRecruitmentFilters';
import { usePaymentsPagination } from '../../accounts/records/hooks/usePaymentsPagination';
import RecordsHeader from './components/RecordsHeader';
import TabsContainer from './components/TabsContainer';
import RecruitmentRecordsPagination from './components/RecruitmentRecordsPagination';

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

  // Sort records by most recent first (created_at or interview_date_time)
  const sortedRecords = React.useMemo(() => {
    if (!records) return [];
    return [...records].sort((a, b) => {
      const dateA = new Date(a.interview_date_time || a.created_at || 0);
      const dateB = new Date(b.interview_date_time || b.created_at || 0);
      return dateB - dateA; // Descending order (most recent first)
    });
  }, [records]);

  const {
    paginatedData,
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    totalItems,
    handlePageChange
  } = usePaymentsPagination(sortedRecords, 10); // Set to exactly 10 records per page

  return (
    <Card className="w-full">
      <RecordsHeader records={sortedRecords} />
      <CardContent>
        <TabsContainer 
          onStatusChange={handleStatusChange}
          onTimeRangeChange={handleTimeRangeChange}
          onSearch={handleSearch}
          onRefresh={refreshData}
          timeRange={timeRange}
          searchTerm={searchTerm}
          records={paginatedData}
          isLoading={isLoading}
          error={error}
        />
        
        <RecruitmentRecordsPagination 
          totalPages={totalPages}
          currentPage={currentPage}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={totalItems}
          onPageChange={handlePageChange}
        />
      </CardContent>
    </Card>
  );
};

export default RecruitmentRecordsDisplay;
