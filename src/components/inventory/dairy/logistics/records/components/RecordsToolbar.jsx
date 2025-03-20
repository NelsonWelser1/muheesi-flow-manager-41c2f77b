
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import CSVExportButton from './export-buttons/CSVExportButton';
import ExcelExportButton from './export-buttons/ExcelExportButton';
import PDFExportButton from './export-buttons/PDFExportButton';

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
    <div className="mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${recordType}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="hour">Last Hour</SelectItem>
              <SelectItem value="day">Last Day</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Confirmed">Confirmed</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {recordsCount} {recordType} found
        </div>
        
        <div className="flex gap-2">
          <CSVExportButton onClick={onExportCSV} disabled={recordsCount === 0} />
          <ExcelExportButton onClick={onExportExcel} disabled={recordsCount === 0} />
          <PDFExportButton onClick={onExportPDF} disabled={recordsCount === 0} />
        </div>
      </div>
    </div>
  );
};

export default RecordsToolbar;
