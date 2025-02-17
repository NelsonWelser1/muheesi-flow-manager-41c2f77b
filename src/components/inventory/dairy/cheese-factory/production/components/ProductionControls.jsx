
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, FileDown, Printer } from "lucide-react";

const ProductionControls = ({ 
  searchTerm, 
  setSearchTerm, 
  timeRange, 
  setTimeRange, 
  onExport, 
  onPrint 
}) => {
  return (
    <div className="flex justify-between items-center gap-4 mt-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by batch ID, fromager, or cheese type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Last 24 Hours</SelectItem>
            <SelectItem value="week">Last Week</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={() => onExport('csv')}>
          <FileDown className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
        <Button variant="outline" onClick={() => onExport('print')}>
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
      </div>
    </div>
  );
};

export default ProductionControls;
