import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { 
  Search, 
  RefreshCw, 
  ArrowUpDown, 
  ArrowLeft,
  CalendarDays
} from 'lucide-react';
import { useCoffeeStockRecords } from '@/hooks/useCoffeeStockRecords';
import CSVExportButton from "@/components/inventory/dairy/logistics/records/components/export-buttons/CSVExportButton";
import PDFExportButton from "@/components/inventory/dairy/logistics/records/components/export-buttons/PDFExportButton";
import ExcelExportButton from "@/components/inventory/dairy/logistics/records/components/export-buttons/ExcelExportButton";
import { format } from 'date-fns';
import { 
  calculateTotalInventoryValue, 
  exportToCSV, 
  exportToExcel, 
  exportToPDF 
} from '@/utils/coffeeStockUtils';

const CoffeeStockRecords = ({ onBack }) => {
  const [showTimeFilter, setShowTimeFilter] = useState(false);
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch (error) {
      return dateString;
    }
  };

  const formatCurrency = (amount, currency = 'UGX') => {
    if (amount === undefined || amount === null) return 'N/A';
    return `${currency} ${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleExportToPDF = () => {
    exportToPDF(records, 'coffee-stock-records');
  };

  const handleExportToExcel = () => {
    exportToExcel(records, 'coffee-stock-records');
  };

  const handleExportToCSV = () => {
    exportToCSV(records, 'coffee-stock-records');
  };

  const renderStatusBadge = (status) => {
    const statusColors = {
      active: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-blue-100 text-blue-800 border-blue-200',
      sold: 'bg-purple-100 text-purple-800 border-purple-200',
      expired: 'bg-red-100 text-red-800 border-red-200',
      relocated: 'bg-amber-100 text-amber-800 border-amber-200'
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full border ${statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
        {status || 'Unknown'}
      </span>
    );
  };

  const totalInventoryValue = calculateTotalInventoryValue(records);

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">Coffee Stock Records</CardTitle>
        <div className="flex items-center space-x-2">
          <Button 
            onClick={onBack}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue={statusFilter} className="mb-6" onValueChange={handleStatusChange}>
          <TabsList className="grid grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="sold">Sold</TabsTrigger>
            <TabsTrigger value="relocated">Relocated</TabsTrigger>
            <TabsTrigger value="expired">Expired</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex flex-wrap gap-3 mb-4 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search coffee records..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setShowTimeFilter(!showTimeFilter)}
          >
            <CalendarDays className="h-4 w-4" />
            Time Range
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          
          <div className="flex items-center gap-2">
            <PDFExportButton onClick={handleExportToPDF} disabled={loading || records.length === 0} />
            <ExcelExportButton onClick={handleExportToExcel} disabled={loading || records.length === 0} />
            <CSVExportButton onClick={handleExportToCSV} disabled={loading || records.length === 0} />
          </div>
        </div>
        
        {showTimeFilter && (
          <div className="mb-4 p-3 bg-muted rounded-md">
            <div className="text-sm font-medium mb-2">Select Time Range</div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              <Button 
                variant={timeRange === 'all' ? "default" : "outline"} 
                size="sm" 
                className="w-full" 
                onClick={() => handleTimeRangeChange('all')}
              >
                All Time
              </Button>
              <Button 
                variant={timeRange === 'hour' ? "default" : "outline"} 
                size="sm" 
                className="w-full" 
                onClick={() => handleTimeRangeChange('hour')}
              >
                Past Hour
              </Button>
              <Button 
                variant={timeRange === 'day' ? "default" : "outline"} 
                size="sm" 
                className="w-full" 
                onClick={() => handleTimeRangeChange('day')}
              >
                Past Day
              </Button>
              <Button 
                variant={timeRange === 'week' ? "default" : "outline"} 
                size="sm" 
                className="w-full" 
                onClick={() => handleTimeRangeChange('week')}
              >
                Past Week
              </Button>
              <Button 
                variant={timeRange === 'month' ? "default" : "outline"} 
                size="sm" 
                className="w-full" 
                onClick={() => handleTimeRangeChange('month')}
              >
                Past Month
              </Button>
              <Button 
                variant={timeRange === 'year' ? "default" : "outline"} 
                size="sm" 
                className="w-full" 
                onClick={() => handleTimeRangeChange('year')}
              >
                Past Year
              </Button>
            </div>
          </div>
        )}
        
        <div className="mb-4 p-4 bg-blue-50 border border-blue-100 rounded-md">
          <div className="flex flex-wrap justify-between items-center">
            <div>
              <h3 className="text-sm font-medium text-blue-800">Total Inventory Value</h3>
              <p className="text-2xl font-bold text-blue-900">{formatCurrency(totalInventoryValue)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-800">Total Records</h3>
              <p className="text-2xl font-bold text-blue-900">{records.length}</p>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="py-8 text-center">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">Loading coffee stock records...</p>
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">
            <p>{error}</p>
            <Button variant="outline" className="mt-2" onClick={handleRefresh}>
              Try Again
            </Button>
          </div>
        ) : records.length === 0 ? (
          <div className="py-8 text-center border rounded-md">
            <p className="text-muted-foreground mb-2">No coffee stock records found</p>
            <p className="text-sm text-muted-foreground">Try changing your search or filter settings</p>
          </div>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">
                      <Button 
                        variant="ghost" 
                        className="flex items-center gap-1 p-0 h-auto font-medium"
                        onClick={() => handleSort('created_at')}
                      >
                        Date <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        className="flex items-center gap-1 p-0 h-auto font-medium"
                        onClick={() => handleSort('coffee_type')}
                      >
                        Type <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        className="flex items-center gap-1 p-0 h-auto font-medium"
                        onClick={() => handleSort('quality_grade')}
                      >
                        Grade <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        className="flex items-center gap-1 p-0 h-auto font-medium"
                        onClick={() => handleSort('quantity')}
                      >
                        Quantity <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        className="flex items-center gap-1 p-0 h-auto font-medium"
                        onClick={() => handleSort('buying_price')}
                      >
                        Price <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        className="flex items-center gap-1 p-0 h-auto font-medium"
                        onClick={() => handleSort('location')}
                      >
                        Location <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        className="flex items-center gap-1 p-0 h-auto font-medium"
                        onClick={() => handleSort('source')}
                      >
                        Source <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        className="flex items-center gap-1 p-0 h-auto font-medium"
                        onClick={() => handleSort('status')}
                      >
                        Status <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{formatDate(record.created_at)}</TableCell>
                      <TableCell>{record.coffee_type || 'N/A'}</TableCell>
                      <TableCell>{record.quality_grade || 'N/A'}</TableCell>
                      <TableCell>{record.quantity} {record.unit || 'kg'}</TableCell>
                      <TableCell>{formatCurrency(record.buying_price, record.currency)}</TableCell>
                      <TableCell>{record.location || 'N/A'}</TableCell>
                      <TableCell>{record.source || 'N/A'}</TableCell>
                      <TableCell>{renderStatusBadge(record.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
        
        <div className="mt-4 text-sm text-muted-foreground">
          Showing {records.length} records
        </div>
      </CardContent>
    </Card>
  );
};

export default CoffeeStockRecords;
