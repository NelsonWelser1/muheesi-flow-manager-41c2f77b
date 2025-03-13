
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Search, Calendar } from 'lucide-react';

const SearchToolbar = ({ searchTerm, setSearchTerm, timeRange, setTimeRange }) => {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="relative flex-1 min-w-[240px]">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search delivery notes..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="w-auto min-w-[160px]">
        <Select 
          value={timeRange} 
          onValueChange={setTimeRange}
        >
          <SelectTrigger className="w-[160px]">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="hour">Last Hour</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SearchToolbar;
