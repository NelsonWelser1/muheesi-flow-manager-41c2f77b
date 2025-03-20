
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Clock, Search, Filter } from "lucide-react";
import CSVExportButton from "./export-buttons/CSVExportButton";
import ExcelExportButton from "./export-buttons/ExcelExportButton";
import PDFExportButton from "./export-buttons/PDFExportButton";

const RecordsToolbar = ({
  searchTerm,
  setSearchTerm,
  timeRange,
  setTimeRange,
  statusFilter,
  setStatusFilter,
  recordsCount,
  recordType,
  onExportCSV,
  onExportExcel,
  onExportPDF
}) => {
  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${recordType}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <CSVExportButton onClick={onExportCSV} disabled={recordsCount === 0} />
          <ExcelExportButton onClick={onExportExcel} disabled={recordsCount === 0} />
          <PDFExportButton onClick={onExportPDF} disabled={recordsCount === 0} />
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <Clock className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="hour">Last Hour</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Badge variant="outline" className="text-xs">
          {recordsCount} {recordType} found
        </Badge>
      </div>
    </div>
  );
};

export default RecordsToolbar;
