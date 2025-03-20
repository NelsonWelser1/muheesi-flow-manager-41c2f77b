
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Clock } from "lucide-react";
import ExportActions from "./ExportActions";

const DeliveriesToolbar = ({
  searchTerm,
  setSearchTerm,
  timeRange,
  setTimeRange,
  statusFilter,
  setStatusFilter,
  deliveriesCount,
  onExportCSV,
  onExportExcel,
  onExportPDF,
  isLoading
}) => {
  return (
    <div className="space-y-4 mb-6">
      {/* Status tabs */}
      <Tabs defaultValue="all" value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in transit">In Transit</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="delayed">Delayed</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search deliveries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <div className="flex gap-2 items-center">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <Clock className="h-4 w-4 mr-2" />
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
      
      <div className="flex justify-between items-center">
        <Badge variant="outline" className="text-xs">
          {deliveriesCount} deliveries found
        </Badge>
        
        <ExportActions
          onExportCSV={onExportCSV}
          onExportExcel={onExportExcel}
          onExportPDF={onExportPDF}
          isDisabled={isLoading || deliveriesCount === 0}
        />
      </div>
    </div>
  );
};

export default DeliveriesToolbar;
