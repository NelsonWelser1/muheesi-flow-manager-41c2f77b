
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTrainingRecords } from '../hooks/useTrainingRecords';
import { usePaymentsPagination } from '../../accounts/records/hooks/usePaymentsPagination';
import TrainingRecordsTable from './TrainingRecordsTable';
import RecordsToolbar from './RecordsToolbar';
import TrainingRecordsHeader from './components/TrainingRecordsHeader';
import TrainingRecordsPagination from './components/TrainingRecordsPagination';

const TrainingRecordsDisplay = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('all');
  
  const { 
    records, 
    isLoading, 
    error, 
    refreshData 
  } = useTrainingRecords({ timeRange, searchTerm, status });

  // Sort records by most recent first (created_at or training_date)
  const sortedRecords = React.useMemo(() => {
    if (!records) return [];
    return [...records].sort((a, b) => {
      const dateA = new Date(a.training_date || a.created_at || 0);
      const dateB = new Date(b.training_date || b.created_at || 0);
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
  } = usePaymentsPagination(sortedRecords, 10);

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
  };

  const handlePrint = () => {
    const printContent = document.getElementById('training-records-table');
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Training & Performance Records</title>
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
            <h2>Training & Performance Records Report</h2>
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
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <TrainingRecordsHeader 
          onRefresh={refreshData}
          onPrint={handlePrint}
          records={sortedRecords}
        />
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full" onValueChange={handleStatusChange}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="low">Low Rating</TabsTrigger>
              <TabsTrigger value="high">High Rating</TabsTrigger>
            </TabsList>
            <RecordsToolbar 
              onTimeRangeChange={handleTimeRangeChange} 
              onSearch={handleSearch}
              onRefresh={refreshData}
              timeRange={timeRange}
              searchTerm={searchTerm}
            />
          </div>

          <TabsContent value="all" className="mt-0">
            <TrainingRecordsTable records={paginatedData} isLoading={isLoading} error={error} />
          </TabsContent>
          <TabsContent value="completed" className="mt-0">
            <TrainingRecordsTable records={paginatedData} isLoading={isLoading} error={error} />
          </TabsContent>
          <TabsContent value="pending" className="mt-0">
            <TrainingRecordsTable records={paginatedData} isLoading={isLoading} error={error} />
          </TabsContent>
          <TabsContent value="low" className="mt-0">
            <TrainingRecordsTable records={paginatedData} isLoading={isLoading} error={error} />
          </TabsContent>
          <TabsContent value="high" className="mt-0">
            <TrainingRecordsTable records={paginatedData} isLoading={isLoading} error={error} />
          </TabsContent>

          <TrainingRecordsPagination 
            totalPages={totalPages}
            currentPage={currentPage}
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={totalItems}
            onPageChange={handlePageChange}
          />
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TrainingRecordsDisplay;
