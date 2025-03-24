
import React from 'react';
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CommunicationSearchFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  timeRange,
  setTimeRange,
  sortConfig,
  setSortConfig
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-center mb-4">
      <div className="relative w-full md:w-64">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search messages..."
          className="pl-8"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="flex flex-wrap gap-2 w-full md:w-auto">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="hour">Last Hour</SelectItem>
            <SelectItem value="day">Last 24 Hours</SelectItem>
            <SelectItem value="week">Last Week</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
        
        <Select 
          value={`${sortConfig.key}-${sortConfig.direction}`} 
          onValueChange={(value) => {
            const [key, direction] = value.split('-');
            setSortConfig({ key, direction });
          }}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sentDate-desc">Date (Newest First)</SelectItem>
            <SelectItem value="sentDate-asc">Date (Oldest First)</SelectItem>
            <SelectItem value="subject-asc">Subject (A-Z)</SelectItem>
            <SelectItem value="subject-desc">Subject (Z-A)</SelectItem>
            <SelectItem value="type-asc">Type (A-Z)</SelectItem>
            <SelectItem value="recipients-asc">Recipients (A-Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CommunicationSearchFilters;
