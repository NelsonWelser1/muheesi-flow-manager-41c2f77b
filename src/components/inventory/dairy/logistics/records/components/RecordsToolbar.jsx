
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, Clock, Download } from "lucide-react";
import { useExportUtils } from '../hooks/useExportUtils';

const RecordsToolbar = ({ 
  searchTerm, 
  setSearchTerm, 
  timeRange, 
  setTimeRange, 
  statusFilter, 
  setStatusFilter, 
  activeTab,
  recordsCount
}) => {
  const { exportToCSV, exportToExcel, exportToPDF } = useExportUtils(activeTab);

  // Status filter options based on active tab
  const getStatusOptions = () => {
    switch(activeTab) {
      case 'deliveries':
        return [
          { value: 'all', label: 'All Statuses' },
          { value: 'Pending', label: 'Pending' },
          { value: 'In Transit', label: 'In Transit' },
          { value: 'Delivered', label: 'Delivered' },
          { value: 'Delayed', label: 'Delayed' }
        ];
      case 'orders':
        return [
          { value: 'all', label: 'All Statuses' },
          { value: 'Pending', label: 'Pending' },
          { value: 'Confirmed', label: 'Confirmed' },
          { value: 'Cancelled', label: 'Cancelled' },
          { value: 'In Progress', label: 'In Progress' }
        ];
      case 'performance':
        return [
          { value: 'all', label: 'All Records' },
          { value: 'true', label: 'Action Required' },
          { value: 'false', label: 'No Action Required' }
        ];
      default:
        return [{ value: 'all', label: 'All' }];
    }
  };

  return (
    <div className="space-y-4 mb-4">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-between items-start sm:items-center">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-8 w-full"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Clock className="h-4 w-4 mr-2" />
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
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {getStatusOptions().map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {recordsCount} {activeTab} found
        </p>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={exportToCSV}
            disabled={recordsCount === 0}
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            CSV
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={exportToExcel}
            disabled={recordsCount === 0}
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            Excel
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={exportToPDF}
            disabled={recordsCount === 0}
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecordsToolbar;
