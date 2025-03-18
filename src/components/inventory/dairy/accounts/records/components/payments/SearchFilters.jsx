
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Calendar, ArrowDownAZ, ArrowUpAZ, ArrowDown10, ArrowUp10 } from "lucide-react";

const SearchFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  timeRange, 
  setTimeRange, 
  sortBy, 
  setSortBy,
  paymentTypeFilter,
  setPaymentTypeFilter
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search payment number, party name, reference..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Time range" />
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
          </div>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">
                <div className="flex items-center">
                  <ArrowDown10 className="mr-2 h-4 w-4" />
                  <span>Date (New-Old)</span>
                </div>
              </SelectItem>
              <SelectItem value="date-asc">
                <div className="flex items-center">
                  <ArrowUp10 className="mr-2 h-4 w-4" />
                  <span>Date (Old-New)</span>
                </div>
              </SelectItem>
              <SelectItem value="amount-desc">
                <div className="flex items-center">
                  <ArrowDown10 className="mr-2 h-4 w-4" />
                  <span>Amount (High-Low)</span>
                </div>
              </SelectItem>
              <SelectItem value="amount-asc">
                <div className="flex items-center">
                  <ArrowUp10 className="mr-2 h-4 w-4" />
                  <span>Amount (Low-High)</span>
                </div>
              </SelectItem>
              <SelectItem value="name-asc">
                <div className="flex items-center">
                  <ArrowUpAZ className="mr-2 h-4 w-4" />
                  <span>Name (A-Z)</span>
                </div>
              </SelectItem>
              <SelectItem value="name-desc">
                <div className="flex items-center">
                  <ArrowDownAZ className="mr-2 h-4 w-4" />
                  <span>Name (Z-A)</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={paymentTypeFilter} onValueChange={setPaymentTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Payment Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="received">Received</SelectItem>
              <SelectItem value="issued">Issued</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
