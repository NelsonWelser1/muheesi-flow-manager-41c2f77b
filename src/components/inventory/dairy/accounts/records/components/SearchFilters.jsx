
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

const SearchFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  timeRange, 
  setTimeRange, 
  sortBy, 
  setSortBy 
}) => {
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search records..."
          value={searchTerm}
          onChange={handleSearch}
          className="pl-8"
        />
      </div>
      <Select value={timeRange} onValueChange={setTimeRange}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by time" />
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
      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger>
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="date-desc">Date (Newest)</SelectItem>
          <SelectItem value="date-asc">Date (Oldest)</SelectItem>
          <SelectItem value="amount-desc">Amount (Highest)</SelectItem>
          <SelectItem value="amount-asc">Amount (Lowest)</SelectItem>
          <SelectItem value="name-asc">Supplier (A-Z)</SelectItem>
          <SelectItem value="name-desc">Supplier (Z-A)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SearchFilters;
