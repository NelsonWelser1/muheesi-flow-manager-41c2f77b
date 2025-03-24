
import React from 'react';
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MemberListFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  memberStatus, 
  setMemberStatus,
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
          placeholder="Search by name or location..."
          className="pl-8"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="flex flex-wrap gap-2 w-full md:w-auto">
        <Select value={memberStatus} onValueChange={setMemberStatus}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        
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
            <SelectItem value="full_name-asc">Name (A-Z)</SelectItem>
            <SelectItem value="full_name-desc">Name (Z-A)</SelectItem>
            <SelectItem value="join_date-desc">Newest First</SelectItem>
            <SelectItem value="join_date-asc">Oldest First</SelectItem>
            <SelectItem value="farm_size-desc">Farm Size (High-Low)</SelectItem>
            <SelectItem value="farm_size-asc">Farm Size (Low-High)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default MemberListFilters;
