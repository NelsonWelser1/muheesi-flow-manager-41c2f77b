
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmployeeRecordsTable from '../EmployeeRecordsTable';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'Active', label: 'Active' },
  { value: 'On Leave', label: 'On Leave' },
  { value: 'Terminated', label: 'Terminated' },
  { value: 'Suspended', label: 'Suspended' },
  { value: 'Training', label: 'Training' },
  { value: 'Probation', label: 'Probation' },
];

const EmployeeRecordsStatusTabs = ({ activeStatus, onStatusChange, paginatedData, isLoading, error }) => {
  return (
    <div className="w-full">
      <Tabs value={activeStatus} onValueChange={onStatusChange} className="w-full">
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
  );
};

export default EmployeeRecordsStatusTabs;
