
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { showErrorToast } from "@/components/ui/notifications";
import { ArrowLeft, Search, Calendar, DownloadCloud, RefreshCw, FileCsv, FileText, FileSpreadsheet } from "lucide-react";
import { format } from 'date-fns';
import { useCoffeeStockRecords } from '@/hooks/useCoffeeStockRecords';
import { exportToCSV, exportToExcel, exportToPDF } from '@/utils/coffee/coffeeExport';

const CoffeeRelocationRecords = ({ onBack, isKazo }) => {
  const {
    records,
    loading,
    error,
    statusFilter,
    timeRange,
    searchTerm,
    sortConfig,
    handleSort,
    handleStatusChange,
    handleTimeRangeChange,
    handleSearch,
    handleRefresh
  } = useCoffeeStockRecords();
  
  const { toast } = useToast();
  const [showExportActions, setShowExportActions] = useState(false);

  // Filter to only show relocation records
  const relocationRecords = records.filter(record => record.type === 'relocation');

  // Handle export actions
  const handleExport = (format) => {
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `coffee-relocations-${timestamp}`;
      const title = "Coffee Relocation Records";
      
      switch (format) {
        case 'csv':
          exportToCSV(relocationRecords, filename);
          break;
        case 'excel':
          exportToExcel(relocationRecords, filename);
          break;
        case 'pdf':
          exportToPDF(relocationRecords, filename, title);
          break;
        default:
          break;
      }
    } catch (err) {
      console.error("Export error:", err);
      showErrorToast(toast, `Failed to export as ${format.toUpperCase()}: ${err.message}`);
    }
  };

  // Generate status badge styles
  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return "bg-green-100 text-green-800";
      case 'pending':
        return "bg-yellow-100 text-yellow-800";
      case 'cancelled':
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch (e) {
      return dateString || 'N/A';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={onBack} 
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowExportActions(!showExportActions)}
              className="flex items-center gap-1"
            >
              <DownloadCloud className="h-4 w-4" /> Export
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" /> Refresh
            </Button>
          </div>
        </div>

        {showExportActions && (
          <div className="flex items-center justify-end space-x-2 animate-fade-in">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleExport('csv')}
              className="flex items-center gap-1"
            >
              <FileCsv className="h-4 w-4" /> CSV
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleExport('excel')}
              className="flex items-center gap-1"
            >
              <FileSpreadsheet className="h-4 w-4" /> Excel
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleExport('pdf')}
              className="flex items-center gap-1"
            >
              <FileText className="h-4 w-4" /> PDF
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coffee Relocation Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={statusFilter} onValueChange={handleStatusChange}>
            <div className="flex flex-col gap-4 mb-4">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>
              
              <div className="flex flex-wrap gap-4">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search relocations..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                
                <Select 
                  value={timeRange} 
                  onValueChange={handleTimeRangeChange}
                >
                  <SelectTrigger className="w-[160px]">
                    <Calendar className="h-4 w-4 mr-2" />
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
              </div>
            </div>

            <TabsContent value={statusFilter}>
              {loading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-muted-foreground">Loading relocation records...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center text-destructive space-y-2">
                    <p>Failed to load records</p>
                    <Button variant="outline" size="sm" onClick={handleRefresh}>
                      Try Again
                    </Button>
                  </div>
                </div>
              ) : relocationRecords.length === 0 ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center text-muted-foreground space-y-2">
                    <p>No relocation records found</p>
                    <p className="text-sm">Try adjusting your search or filter criteria</p>
                  </div>
                </div>
              ) : (
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead 
                          className="cursor-pointer"
                          onClick={() => handleSort('created_at')}
                        >
                          Date
                          {sortConfig.field === 'created_at' && (
                            <span className="ml-1">
                              {sortConfig.ascending ? '↑' : '↓'}
                            </span>
                          )}
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer"
                          onClick={() => handleSort('manager')}
                        >
                          Manager
                          {sortConfig.field === 'manager' && (
                            <span className="ml-1">
                              {sortConfig.ascending ? '↑' : '↓'}
                            </span>
                          )}
                        </TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Destination</TableHead>
                        <TableHead 
                          className="cursor-pointer"
                          onClick={() => handleSort('coffee_type')}
                        >
                          Coffee Type
                          {sortConfig.field === 'coffee_type' && (
                            <span className="ml-1">
                              {sortConfig.ascending ? '↑' : '↓'}
                            </span>
                          )}
                        </TableHead>
                        <TableHead>Quality Grade</TableHead>
                        <TableHead 
                          className="cursor-pointer"
                          onClick={() => handleSort('quantity')}
                        >
                          Quantity
                          {sortConfig.field === 'quantity' && (
                            <span className="ml-1">
                              {sortConfig.ascending ? '↑' : '↓'}
                            </span>
                          )}
                        </TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead 
                          className="cursor-pointer"
                          onClick={() => handleSort('status')}
                        >
                          Status
                          {sortConfig.field === 'status' && (
                            <span className="ml-1">
                              {sortConfig.ascending ? '↑' : '↓'}
                            </span>
                          )}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {relocationRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{formatDate(record.created_at)}</TableCell>
                          <TableCell>{record.manager}</TableCell>
                          <TableCell>{record.sourceLocation || record.location}</TableCell>
                          <TableCell>{record.destinationLocation}</TableCell>
                          <TableCell>{record.coffee_type}</TableCell>
                          <TableCell>{record.quality_grade}</TableCell>
                          <TableCell>{`${record.quantity} ${record.unit || 'kg'}`}</TableCell>
                          <TableCell>{record.reason || 'N/A'}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(record.status)}`}>
                              {record.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoffeeRelocationRecords;
