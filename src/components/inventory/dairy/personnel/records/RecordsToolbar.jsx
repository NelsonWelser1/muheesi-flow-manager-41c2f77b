
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, Search } from "lucide-react";

const RecordsToolbar = ({
  onTimeRangeChange,
  onSearch,
  onRefresh,
  timeRange,
  searchTerm
}) => {
  return (
    <div className="flex items-center gap-1 px-0 py-0 mx-0">
      <div className="relative w-32">
        <Search className="absolute left-2 top-2 h-3 w-3 text-muted-foreground" />
        <Input 
          placeholder="Search..." 
          className="pl-7 h-7 text-xs" 
          value={searchTerm} 
          onChange={e => onSearch(e.target.value)} 
        />
      </div>
      <Select value={timeRange} onValueChange={onTimeRangeChange}>
        <SelectTrigger className="w-20 h-7 text-xs">
          <SelectValue placeholder="Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="hour">Hour</SelectItem>
          <SelectItem value="day">Day</SelectItem>
          <SelectItem value="week">Week</SelectItem>
          <SelectItem value="month">Month</SelectItem>
          <SelectItem value="year">Year</SelectItem>
        </SelectContent>
      </Select>
      <Button size="sm" variant="outline" onClick={onRefresh} className="h-7 w-7 p-0">
        <RefreshCw className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default RecordsToolbar;
