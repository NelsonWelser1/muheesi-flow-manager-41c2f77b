
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEmployeeRecords } from '../hooks/useEmployeeRecords';
import EmployeeRecordsTable from './EmployeeRecordsTable';
import RecordsToolbar from './RecordsToolbar';
import EmployeeExportActions from './EmployeeExportActions';

const EmployeeRecordsDisplay = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('all');
  
  const { 
    records, 
    isLoading, 
    error, 
    refreshData 
  } = useEmployeeRecords({ timeRange, searchTerm, status });

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Employee Records</CardTitle>
        <EmployeeExportActions 
          records={records} 
          fileName="employee_records" 
        />
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full" onValueChange={handleStatusChange}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="Active">Active</TabsTrigger>
              <TabsTrigger value="On Leave">On Leave</TabsTrigger>
              <TabsTrigger value="Probation">Probation</TabsTrigger>
              <TabsTrigger value="Training">Training</TabsTrigger>
              <TabsTrigger value="Terminated">Terminated</TabsTrigger>
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
            <EmployeeRecordsTable records={records} isLoading={isLoading} error={error} />
          </TabsContent>
          <TabsContent value="Active" className="mt-0">
            <EmployeeRecordsTable records={records} isLoading={isLoading} error={error} />
          </TabsContent>
          <TabsContent value="On Leave" className="mt-0">
            <EmployeeRecordsTable records={records} isLoading={isLoading} error={error} />
          </TabsContent>
          <TabsContent value="Probation" className="mt-0">
            <EmployeeRecordsTable records={records} isLoading={isLoading} error={error} />
          </TabsContent>
          <TabsContent value="Training" className="mt-0">
            <EmployeeRecordsTable records={records} isLoading={isLoading} error={error} />
          </TabsContent>
          <TabsContent value="Terminated" className="mt-0">
            <EmployeeRecordsTable records={records} isLoading={isLoading} error={error} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EmployeeRecordsDisplay;
