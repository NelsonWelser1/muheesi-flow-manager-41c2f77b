
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEmployeeRecords } from '../hooks/useEmployeeRecords';
import EmployeeRecordsTable from './EmployeeRecordsTable';
import EmployeeExportActions from './EmployeeExportActions';
import { RefreshCw } from 'lucide-react';

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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTimeRangeChange = (value) => {
    setTimeRange(value);
  };

  const handleRefresh = () => {
    refreshData();
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-bold">Employee Records</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            <EmployeeExportActions records={records} fileName="employee_records" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by name, ID, job title, or department..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full"
                />
              </div>
              <Select value={timeRange} onValueChange={handleTimeRangeChange}>
                <SelectTrigger className="w-full sm:w-[180px]">
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

            <Tabs value={activeStatus} onValueChange={setActiveStatus}>
              <TabsList className="w-full grid grid-cols-3 lg:grid-cols-7">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="Active">Active</TabsTrigger>
                <TabsTrigger value="On Leave">On Leave</TabsTrigger>
                <TabsTrigger value="Training">Training</TabsTrigger>
                <TabsTrigger value="Probation">Probation</TabsTrigger>
                <TabsTrigger value="Suspended">Suspended</TabsTrigger>
                <TabsTrigger value="Terminated">Terminated</TabsTrigger>
              </TabsList>

              {STATUS_OPTIONS.map((status) => (
                <TabsContent key={status.value} value={status.value}>
                  <EmployeeRecordsTable
                    records={records}
                    isLoading={isLoading}
                    error={error}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeRecordsDisplay;
