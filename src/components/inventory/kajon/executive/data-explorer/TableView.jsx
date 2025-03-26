
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, CheckCircle, Clock, AlertTriangle, PackageCheck } from 'lucide-react';
import CSVExportButton from "@/components/inventory/dairy/logistics/records/components/export-buttons/CSVExportButton";
import ExcelExportButton from "@/components/inventory/dairy/logistics/records/components/export-buttons/ExcelExportButton";
import PDFExportButton from "@/components/inventory/dairy/logistics/records/components/export-buttons/PDFExportButton";
import { useCoffeeStockTransfers } from '@/hooks/useCoffeeStockTransfers';
import { useToast } from '@/components/ui/use-toast';
import { exportToCSV, exportToExcel, exportToPDF } from '@/utils/coffee/coffeeExport';

const TableView = ({ isLoading, timeRange, statusFilter, searchTerm, categoryFilter }) => {
  const { toast } = useToast();
  const {
    transfers,
    loading: transfersLoading,
    error,
    handleTimeRangeChange,
    handleStatusChange,
    handleSearch,
    handleRefresh
  } = useCoffeeStockTransfers();

  const [sortedTransfers, setSortedTransfers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ field: 'created_at', ascending: false });

  useEffect(() => {
    // Apply filters based on props
    if (timeRange && timeRange !== 'all') {
      handleTimeRangeChange(timeRange);
    }
    
    if (statusFilter && statusFilter !== 'all') {
      handleStatusChange(statusFilter);
    }
    
    if (searchTerm) {
      handleSearch(searchTerm);
    }
    
    // This would be implemented in a real app to filter by category
    // For now we'll just use the existing transfers
    
    // Sort the data
    const sorted = [...transfers].sort((a, b) => {
      if (a[sortConfig.field] < b[sortConfig.field]) {
        return sortConfig.ascending ? -1 : 1;
      }
      if (a[sortConfig.field] > b[sortConfig.field]) {
        return sortConfig.ascending ? 1 : -1;
      }
      return 0;
    });
    
    setSortedTransfers(sorted);
  }, [transfers, timeRange, statusFilter, searchTerm, categoryFilter, sortConfig]);

  const handleSort = (field) => {
    setSortConfig(prevConfig => ({
      field,
      ascending: prevConfig.field === field ? !prevConfig.ascending : true
    }));
  };

  const handleExportCSV = () => {
    exportToCSV(sortedTransfers, 'coffee-stock-transfers');
    toast({
      title: "Export Successful",
      description: "Data exported to CSV format",
    });
  };

  const handleExportExcel = () => {
    exportToExcel(sortedTransfers, 'coffee-stock-transfers');
    toast({
      title: "Export Successful",
      description: "Data exported to Excel format",
    });
  };

  const handleExportPDF = () => {
    exportToPDF(sortedTransfers, 'coffee-stock-transfers', 'Coffee Stock Transfers Report');
    toast({
      title: "Export Successful",
      description: "Data exported to PDF format",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'received':
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Received
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-amber-100 text-amber-800 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case 'declined':
        return (
          <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Declined
          </Badge>
        );
      case 'processing':
        return (
          <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
            <PackageCheck className="h-3 w-3" />
            Processing
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">{status}</Badge>
        );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (transfersLoading || isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-amber-500 rounded-full border-t-transparent"></div>
        <p className="ml-2 text-amber-800">Loading coffee stock data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md border border-red-200">
        <h3 className="text-red-800 font-medium">Error loading data</h3>
        <p className="text-red-600">{error}</p>
        <Button 
          onClick={handleRefresh} 
          className="mt-2 bg-red-100 text-red-800 hover:bg-red-200"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h3 className="text-lg font-medium text-gray-700">
          Coffee Stock Transfer Records
        </h3>
        <div className="flex space-x-2">
          <CSVExportButton onClick={handleExportCSV} />
          <ExcelExportButton onClick={handleExportExcel} />
          <PDFExportButton onClick={handleExportPDF} />
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('created_at')}
                  className="flex items-center text-xs font-medium"
                >
                  Date
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('coffee_type')}
                  className="flex items-center text-xs font-medium"
                >
                  Coffee Type
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('quality_grade')}
                  className="flex items-center text-xs font-medium"
                >
                  Grade
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('quantity')}
                  className="flex items-center text-xs font-medium"
                >
                  Volume
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('source_location')}
                  className="flex items-center text-xs font-medium"
                >
                  Source
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('destination_location')}
                  className="flex items-center text-xs font-medium"
                >
                  Destination
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('manager')}
                  className="flex items-center text-xs font-medium"
                >
                  Manager
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('status')}
                  className="flex items-center text-xs font-medium"
                >
                  Status
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTransfers.length > 0 ? (
              sortedTransfers.map((transfer) => (
                <TableRow key={transfer.id}>
                  <TableCell className="font-medium">{formatDate(transfer.created_at)}</TableCell>
                  <TableCell>
                    {transfer.coffee_type === 'arabica' 
                      ? <span className="text-green-700">Arabica</span> 
                      : <span className="text-amber-700">Robusta</span>}
                  </TableCell>
                  <TableCell>{transfer.quality_grade}</TableCell>
                  <TableCell>{transfer.quantity} {transfer.unit}</TableCell>
                  <TableCell>{transfer.source_location}</TableCell>
                  <TableCell>{transfer.destination_location}</TableCell>
                  <TableCell>{transfer.manager}</TableCell>
                  <TableCell>{getStatusBadge(transfer.status)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TableView;
