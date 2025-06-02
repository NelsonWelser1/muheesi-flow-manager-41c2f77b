
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { useEmployeeRecords } from '../hooks/useEmployeeRecords';
import EmployeeRecordsTable from './EmployeeRecordsTable';
import EmployeeExportActions from './EmployeeExportActions';
import { RefreshCw, Printer } from 'lucide-react';
import { usePaymentsPagination } from '../../accounts/records/hooks/usePaymentsPagination';

const TIME_RANGES = [
  { value: 'all', label: 'All Time' },
  { value: 'hour', label: 'Last Hour' },
  { value: 'day', label: 'Last Day' },
  { value: 'week', label: 'Last Week' },
  { value: 'month', label: 'Last Month' },
  { value: 'year', label: 'Last Year' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'Active', label: 'Active' },
  { value: 'On Leave', label: 'On Leave' },
  { value: 'Terminated', label: 'Terminated' },
  { value: 'Suspended', label: 'Suspended' },
  { value: 'Training', label: 'Training' },
  { value: 'Probation', label: 'Probation' },
];

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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-lg font-bold">Employee Records</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
              <Button onClick={handlePrint} variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Print Records
              </Button>
              <EmployeeExportActions records={records} fileName="employee_records" />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name, ID, job title, or department..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full"
              />
            </div>
            <div className="w-full sm:w-[180px]">
              <Select value={timeRange} onValueChange={handleTimeRangeChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_RANGES.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="w-full">
            <Tabs value={activeStatus} onValueChange={setActiveStatus} className="w-full">
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 mb-6">
                <TabsTrigger value="all" className="text-xs sm:text-sm">All</TabsTrigger>
                <TabsTrigger value="Active" className="text-xs sm:text-sm">Active</TabsTrigger>
                <TabsTrigger value="On Leave" className="text-xs sm:text-sm">On Leave</TabsTrigger>
                <TabsTrigger value="Training" className="text-xs sm:text-sm">Training</TabsTrigger>
                <TabsTrigger value="Probation" className="text-xs sm:text-sm">Probation</TabsTrigger>
                <TabsTrigger value="Suspended" className="text-xs sm:text-sm">Suspended</TabsTrigger>
                <TabsTrigger value="Terminated" className="text-xs sm:text-sm">Terminated</TabsTrigger>
              </TabsList>

              {STATUS_OPTIONS.map((status) => (
                <TabsContent key={status.value} value={status.value} className="mt-0">
                  <div id="employee-records-table" className="w-full">
                    <EmployeeRecordsTable
                      records={paginatedData}
                      isLoading={isLoading}
                      error={error}
                    />
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
              <div className="text-sm text-muted-foreground order-2 sm:order-1">
                Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} items
              </div>
              
              <div className="order-1 sm:order-2">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <PaginationItem key={page}>
                        <PaginationLink 
                          onClick={() => handlePageChange(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeRecordsDisplay;
