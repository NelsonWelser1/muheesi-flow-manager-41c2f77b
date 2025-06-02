
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TIME_RANGES = [
  { value: 'all', label: 'All Time' },
  { value: 'hour', label: 'Last Hour' },
  { value: 'day', label: 'Last Day' },
  { value: 'week', label: 'Last Week' },
  { value: 'month', label: 'Last Month' },
  { value: 'year', label: 'Last Year' },
];

const EmployeeRecordsFilters = ({ searchTerm, onSearchChange, timeRange, onTimeRangeChange }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <Input
          placeholder="Search by name, ID, job title, or department..."
          value={searchTerm}
          onChange={onSearchChange}
          className="w-full"
        />
      </div>
      <div className="w-full sm:w-[180px]">
        <Select value={timeRange} onValueChange={onTimeRangeChange}>
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
  );
};

export default EmployeeRecordsFilters;
