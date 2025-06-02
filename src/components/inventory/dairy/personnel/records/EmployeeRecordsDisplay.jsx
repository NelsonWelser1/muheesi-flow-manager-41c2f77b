
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useEmployeeRecords } from '../hooks/useEmployeeRecords';
import { usePaymentsPagination } from '../../accounts/records/hooks/usePaymentsPagination';
import EmployeeRecordsHeader from './components/EmployeeRecordsHeader';
import EmployeeRecordsFilters from './components/EmployeeRecordsFilters';
import EmployeeRecordsStatusTabs from './components/EmployeeRecordsStatusTabs';
import EmployeeRecordsPagination from './components/EmployeeRecordsPagination';

const EmployeeRecordsDisplay = () => {
  const [activeStatus, setActiveStatus] = useState('all');
  const [timeRange, setTimeRange] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { records, isLoading, error, refreshData } = useEmployeeRecords({
    timeRange,
    searchTerm,
    status: activeStatus
  });

  const {
    paginatedData,
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    totalItems,
    handlePageChange
  } = usePaymentsPagination(records, 10);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTimeRangeChange = (value) => {
    setTimeRange(value);
  };

  const handleRefresh = () => {
    refreshData();
  };

  const handlePrint = () => {
    const printContent = document.getElementById('employee-records-table');
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Employee Records</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; white-space: nowrap; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .header { text-align: center; margin-bottom: 20px; }
            .print-date { text-align: right; font-size: 12px; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <div class="print-date">Printed on: ${new Date().toLocaleString()}</div>
          <div class="header">
            <h2>Employee Records Report</h2>
            <p>Total Records: ${totalItems}</p>
          </div>
          ${printContent.outerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader className="pb-4">
          <EmployeeRecordsHeader 
            onRefresh={handleRefresh}
            onPrint={handlePrint}
            records={records}
          />
        </CardHeader>
        
        <CardContent className="space-y-6">
          <EmployeeRecordsFilters 
            searchTerm={searchTerm}
            onSearchChange={handleSearch}
            timeRange={timeRange}
            onTimeRangeChange={handleTimeRangeChange}
          />

          <EmployeeRecordsStatusTabs 
            activeStatus={activeStatus}
            onStatusChange={setActiveStatus}
            paginatedData={paginatedData}
            isLoading={isLoading}
            error={error}
          />

          <EmployeeRecordsPagination 
            totalPages={totalPages}
            currentPage={currentPage}
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={totalItems}
            onPageChange={handlePageChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeRecordsDisplay;
