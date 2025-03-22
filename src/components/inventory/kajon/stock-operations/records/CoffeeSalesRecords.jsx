
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Search, FileText, FileSpreadsheet, FileDown, RefreshCw } from 'lucide-react';
import { useCoffeeSales } from '@/hooks/useCoffeeSales';
import { useToast } from '@/components/ui/use-toast';
import { showErrorToast } from '@/components/ui/notifications';

// Import utility for exports
import { exportToCSV, exportToExcel, exportToPDF } from '@/utils/coffee/coffeeExport';

const TIME_RANGES = [
  { value: 'all', label: 'All Time' },
  { value: 'hour', label: 'Last Hour' },
  { value: 'day', label: 'Last Day' },
  { value: 'week', label: 'Last Week' },
  { value: 'month', label: 'Last Month' },
  { value: 'year', label: 'Last Year' }
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
];

const CoffeeSalesRecords = ({ onBack }) => {
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();
  
  const { 
    salesRecords, 
    isLoading, 
    fetchSalesByTimeRange, 
    searchSalesRecords,
    refetchSales
  } = useCoffeeSales();

  // Load initial records
  useEffect(() => {
    setRecords(salesRecords);
  }, [salesRecords]);

  // Handle time range filter change
  const handleTimeRangeChange = async (value) => {
    setTimeRange(value);
    if (value === 'all') {
      await refetchSales();
      return;
    }
    
    try {
      const filteredRecords = await fetchSalesByTimeRange(value);
      setRecords(filteredRecords);
    } catch (err) {
      console.error('Error filtering by time range:', err);
    }
  };

  // Handle status filter change 
  const handleStatusChange = (value) => {
    setStatusFilter(value);
    
    if (value === 'all') {
      setRecords(salesRecords);
      return;
    }
    
    const filteredRecords = salesRecords.filter(record => record.status === value);
    setRecords(filteredRecords);
  };

  // Handle search
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setRecords(salesRecords);
      return;
    }
    
    try {
      const searchResults = await searchSalesRecords(searchTerm);
      setRecords(searchResults);
    } catch (err) {
      console.error('Error searching records:', err);
    }
  };

  // Handle search input keypress (search on Enter)
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    await refetchSales();
  };

  // Handle exports
  const handleExport = async (format) => {
    try {
      setIsExporting(true);
      
      // Make sure we have records to export
      if (!records || records.length === 0) {
        showErrorToast(toast, 'No records available to export');
        return;
      }
      
      const filename = `coffee-sales-${new Date().toISOString().slice(0, 10)}`;
      
      switch (format) {
        case 'csv':
          await exportToCSV(records, filename);
          break;
        case 'excel':
          await exportToExcel(records, filename);
          break;
        case 'pdf':
          await exportToPDF(records, filename, 'Coffee Sales Records');
          break;
        default:
          showErrorToast(toast, 'Unsupported export format');
      }
    } catch (err) {
      console.error(`Error exporting as ${format}:`, err);
      showErrorToast(toast, `Failed to export as ${format}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h2 className="text-xl font-semibold">Coffee Sales Records</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex flex-1 gap-2">
          <Input
            placeholder="Search by name, contact, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleSearchKeyPress}
            className="flex-1"
          />
          <Button variant="outline" onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              {TIME_RANGES.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Export buttons */}
      <div className="flex justify-end gap-2 mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleExport('pdf')}
          disabled={isExporting || isLoading || records.length === 0}
        >
          <FileText className="h-4 w-4 mr-1" />
          PDF
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleExport('excel')}
          disabled={isExporting || isLoading || records.length === 0}
        >
          <FileSpreadsheet className="h-4 w-4 mr-1" />
          Excel
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleExport('csv')}
          disabled={isExporting || isLoading || records.length === 0}
        >
          <FileDown className="h-4 w-4 mr-1" />
          CSV
        </Button>
      </div>
      
      {/* Records table */}
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Date</th>
                <th className="px-4 py-3 text-left font-medium">Buyer</th>
                <th className="px-4 py-3 text-left font-medium">Contact</th>
                <th className="px-4 py-3 text-left font-medium">Coffee Type</th>
                <th className="px-4 py-3 text-left font-medium">Quality Grade</th>
                <th className="px-4 py-3 text-left font-medium">Location</th>
                <th className="px-4 py-3 text-left font-medium">Quantity</th>
                <th className="px-4 py-3 text-left font-medium">Price</th>
                <th className="px-4 py-3 text-left font-medium">Total</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan="10" className="px-4 py-10 text-center">Loading records...</td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-4 py-10 text-center">No records found</td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr key={record.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">
                      {new Date(record.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">{record.buyer_name}</td>
                    <td className="px-4 py-3">{record.buyer_contact}</td>
                    <td className="px-4 py-3 capitalize">{record.coffee_type}</td>
                    <td className="px-4 py-3">{record.quality_grade}</td>
                    <td className="px-4 py-3">{record.location}</td>
                    <td className="px-4 py-3">
                      {record.quantity} {record.unit}
                    </td>
                    <td className="px-4 py-3">
                      {record.selling_price} {record.currency}
                    </td>
                    <td className="px-4 py-3">
                      {record.total_price} {record.currency}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        record.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        record.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CoffeeSalesRecords;
