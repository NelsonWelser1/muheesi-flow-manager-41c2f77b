
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

const CommunicationSearchFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  timeRange, 
  setTimeRange, 
  sortConfig, 
  setSortConfig 
}) => {
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTimeRangeChange = (value) => {
    setTimeRange(value);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-4">
      <Input
        placeholder="Search by subject, message or recipients..."
        value={searchTerm}
        onChange={handleSearch}
        className="flex-1"
      />
      <Select value={timeRange} onValueChange={handleTimeRangeChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Time range" />
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
  );
};

export default CommunicationSearchFilters;
