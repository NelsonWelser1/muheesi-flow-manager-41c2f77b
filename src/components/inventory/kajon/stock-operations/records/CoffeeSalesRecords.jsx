
import React, { useState, useEffect } from 'react';
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
import { useToast } from "@/components/ui/use-toast";
import { exportToCSV, exportToExcel, exportToPDF } from '@/utils/coffeeStockUtils';
import { fetchCoffeeStock } from '@/utils/coffee/coffeeStockCore';
import { format } from 'date-fns';

const CoffeeSalesRecords = ({ onBack }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('sold');
  const [timeRange, setTimeRange] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ field: 'created_at', ascending: false });
  const [showTimeFilter, setShowTimeFilter] = useState(false);
  const { toast } = useToast();

  const fetchRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      // Calculate the date range based on selected time filter
      let startDate = null;
      let endDate = new Date();
      
      if (timeRange !== 'all') {
        const now = new Date();
        switch (timeRange) {
          case 'hour':
            startDate = new Date(now.getTime() - 60 * 60 * 1000);
            break;
          case 'day':
            startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            break;
          case 'week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'month':
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case 'year':
            startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            break;
          default:
            startDate = null;
        }
      }

      // Fetch data with filters
      const data = await fetchCoffeeStock({
        statusFilter: statusFilter,
        startDate,
        endDate,
        sortField: sortConfig.field,
        ascending: sortConfig.ascending
      });

      // Filter to only show sales records
      const salesRecords = data.filter(record => record.status === 'sold');
      setRecords(salesRecords);
    } catch (err) {
      console.error('Error fetching coffee sales records:', err);
      setError('Failed to load coffee sales records');
      toast({
        title: "Error",
        description: "Failed to load coffee sales records",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [statusFilter, timeRange, sortConfig]);

  // Filter records based on search term
  const filteredRecords = records.filter(record => {
    if (!searchTerm) return true;
    
    const search = searchTerm.toLowerCase();
    return (
      (record.manager && record.manager.toLowerCase().includes(search)) ||
      (record.location && record.location.toLowerCase().includes(search)) ||
      (record.coffee_type && record.coffee_type.toLowerCase().includes(search)) ||
      (record.quality_grade && record.quality_grade.toLowerCase().includes(search)) ||
      (record.buyerName && record.buyerName.toLowerCase().includes(search)) ||
      (record.buyerContact && record.buyerContact.toLowerCase().includes(search)) ||
      (record.notes && record.notes.toLowerCase().includes(search))
    );
  });

  const handleSort = (field) => {
    setSortConfig(prevConfig => ({
      field,
      ascending: prevConfig.field === field ? !prevConfig.ascending : true
    }));
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRefresh = () => {
    fetchRecords();
  };

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

  const handleExportToCSV = () => {
    exportToCSV(filteredRecords, 'coffee-sales-records');
  };

  const handleExportToExcel = () => {
    exportToExcel(filteredRecords, 'coffee-sales-records');
  };

  const handleExportToPDF = () => {
    exportToPDF(filteredRecords, 'coffee-sales-records');
  };

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">Coffee Sales Records</CardTitle>
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
        <div className="flex flex-wrap gap-3 mb-4 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sales records..."
              value={searchTerm}
              onChange={handleSearch}
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
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExportToPDF}
              disabled={loading || filteredRecords.length === 0}
            >
              Export to PDF
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExportToExcel}
              disabled={loading || filteredRecords.length === 0}
            >
              Export to Excel
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExportToCSV}
              disabled={loading || filteredRecords.length === 0}
            >
              Export to CSV
            </Button>
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
              <h3 className="text-sm font-medium text-blue-800">Total Sales Records</h3>
              <p className="text-2xl font-bold text-blue-900">{filteredRecords.length}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-800">Time Range</h3>
              <p className="text-md font-medium text-blue-900">
                {timeRange === 'all' ? 'All Time' : 
                 timeRange === 'hour' ? 'Past Hour' :
                 timeRange === 'day' ? 'Past Day' :
                 timeRange === 'week' ? 'Past Week' :
                 timeRange === 'month' ? 'Past Month' : 'Past Year'}
              </p>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="py-8 text-center">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">Loading coffee sales records...</p>
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">
            <p>{error}</p>
            <Button variant="outline" className="mt-2" onClick={handleRefresh}>
              Try Again
            </Button>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="py-8 text-center border rounded-md">
            <p className="text-muted-foreground mb-2">No coffee sales records found</p>
            <p className="text-sm text-muted-foreground">Try changing your search or time range settings</p>
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
                        onClick={() => handleSort('buyerName')}
                      >
                        Buyer <ArrowUpDown className="h-3 w-3" />
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
                        onClick={() => handleSort('sellingPrice')}
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
                        onClick={() => handleSort('manager')}
                      >
                        Manager <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{formatDate(record.created_at)}</TableCell>
                      <TableCell>{record.buyerName || 'N/A'}</TableCell>
                      <TableCell>{record.coffee_type || 'N/A'}</TableCell>
                      <TableCell>{record.quality_grade || 'N/A'}</TableCell>
                      <TableCell>{record.quantity} {record.unit || 'kg'}</TableCell>
                      <TableCell>{formatCurrency(record.sellingPrice, record.currency)}</TableCell>
                      <TableCell>{record.location || 'N/A'}</TableCell>
                      <TableCell>{record.manager || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
        
        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredRecords.length} sales records
        </div>
      </CardContent>
    </Card>
  );
};

export default CoffeeSalesRecords;
