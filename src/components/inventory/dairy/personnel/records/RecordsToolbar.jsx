
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw, Search } from "lucide-react";

const RecordsToolbar = ({ 
  onTimeRangeChange, 
  onSearch, 
  onRefresh,
  timeRange,
  searchTerm 
}) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative w-64">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search records..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <Select value={timeRange} onValueChange={onTimeRangeChange}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Select Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="hour">Past Hour</SelectItem>
          <SelectItem value="day">Past Day</SelectItem>
          <SelectItem value="week">Past Week</SelectItem>
          <SelectItem value="month">Past Month</SelectItem>
          <SelectItem value="year">Past Year</SelectItem>
        </SelectContent>
      </Select>
      <Button size="icon" variant="outline" onClick={onRefresh}>
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default RecordsToolbar;
