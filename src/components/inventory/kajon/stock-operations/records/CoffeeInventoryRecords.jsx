
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
  Filter,
  CalendarDays
} from 'lucide-react';
import { useSupabaseAuth } from '@/integrations/supabase';
import { supabase } from '@/integrations/supabase/supabase';
import { fromSupabase } from '@/integrations/supabase/utils/supabaseUtils';
import CSVExportButton from '../../dairy/logistics/records/components/export-buttons/CSVExportButton';
import PDFExportButton from '../../dairy/logistics/records/components/export-buttons/PDFExportButton';
import ExcelExportButton from '../../dairy/logistics/records/components/export-buttons/ExcelExportButton';
import { exportToCSV, exportToExcel, exportToPDF } from '../../dairy/logistics/records/utils/exportUtils';
import { format } from 'date-fns';

const CoffeeInventoryRecords = ({ onBack, isKazo = false }) => {
  const [coffeeRecords, setCoffeeRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('all');
  const [showTimeFilter, setShowTimeFilter] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
  const { user } = useSupabaseAuth();

  // Fetch coffee inventory records from Supabase
  const fetchCoffeeRecords = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('coffee_inventory')
        .select('*');
      
      // Apply status filter if not 'all'
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      // Apply time range filter if not 'all'
      if (timeRange !== 'all') {
        const now = new Date();
        let timeAgo;
        
        switch (timeRange) {
          case 'hour':
            timeAgo = new Date(now.getTime() - 60 * 60 * 1000);
            break;
          case 'day':
            timeAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            break;
          case 'week':
            timeAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'month':
            timeAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case 'year':
            timeAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            break;
          default:
            timeAgo = null;
        }
        
        if (timeAgo) {
          query = query.gte('created_at', timeAgo.toISOString());
        }
      }
      
      // Sort the results
      query = query.order(sortConfig.key, { ascending: sortConfig.direction === 'asc' });
      
      const data = await fromSupabase(query);
      setCoffeeRecords(data || []);
    } catch (err) {
      console.error('Error fetching coffee inventory records:', err);
      setError('Failed to load coffee inventory records. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch records on component mount and when filters change
  useEffect(() => {
    fetchCoffeeRecords();
  }, [statusFilter, timeRange, sortConfig]);

  // Handle search filter
  const filteredRecords = coffeeRecords.filter(record => {
    if (!searchTerm) return true;
    
    const search = searchTerm.toLowerCase();
    return (
      (record.manager && record.manager.toLowerCase().includes(search)) ||
      (record.location && record.location.toLowerCase().includes(search)) ||
      (record.coffeeType && record.coffeeType.toLowerCase().includes(search)) ||
      (record.qualityGrade && record.qualityGrade.toLowerCase().includes(search)) ||
      (record.source && record.source.toLowerCase().includes(search)) ||
      (record.notes && record.notes.toLowerCase().includes(search))
    );
  });

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch (error) {
      return dateString;
    }
  };

  // Format currency for display
  const formatCurrency = (amount, currency = 'UGX') => {
    if (amount === undefined || amount === null) return 'N/A';
    return `${currency} ${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Handle column sort
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Handle export buttons
  const handleExportToPDF = () => {
    exportToPDF(filteredRecords, 'Coffee Inventory Records');
  };

  const handleExportToExcel = () => {
    exportToExcel(filteredRecords, 'Coffee Inventory Records');
  };

  const handleExportToCSV = () => {
    exportToCSV(filteredRecords, 'Coffee Inventory Records');
  };

  // Render status badge
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

  // Calculate total value of filtered inventory
  const totalInventoryValue = filteredRecords.reduce((sum, record) => {
    const itemValue = record.buying_price * record.quantity;
    return sum + (isNaN(itemValue) ? 0 : itemValue);
  }, 0);

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">Coffee Inventory Records</CardTitle>
        <div className="flex items-center space-x-2">
          <Button 
            onClick={onBack}
            variant="outline"
            size="sm"
          >
            Back
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Status tabs */}
        <Tabs defaultValue="all" className="mb-6" onValueChange={setStatusFilter}>
          <TabsList className="grid grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="sold">Sold</TabsTrigger>
            <TabsTrigger value="relocated">Relocated</TabsTrigger>
            <TabsTrigger value="expired">Expired</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Search and filters toolbar */}
        <div className="flex flex-wrap gap-3 mb-4 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search coffee records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
            onClick={fetchCoffeeRecords}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          
          <div className="flex items-center gap-2">
            <PDFExportButton onClick={handleExportToPDF} disabled={loading || filteredRecords.length === 0} />
            <ExcelExportButton onClick={handleExportToExcel} disabled={loading || filteredRecords.length === 0} />
            <CSVExportButton onClick={handleExportToCSV} disabled={loading || filteredRecords.length === 0} />
          </div>
        </div>
        
        {/* Time range filter dropdown */}
        {showTimeFilter && (
          <div className="mb-4 p-3 bg-muted rounded-md">
            <div className="text-sm font-medium mb-2">Select Time Range</div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              <Button 
                variant={timeRange === 'all' ? "default" : "outline"} 
                size="sm" 
                className="w-full" 
                onClick={() => setTimeRange('all')}
              >
                All Time
              </Button>
              <Button 
                variant={timeRange === 'hour' ? "default" : "outline"} 
                size="sm" 
                className="w-full" 
                onClick={() => setTimeRange('hour')}
              >
                Past Hour
              </Button>
              <Button 
                variant={timeRange === 'day' ? "default" : "outline"} 
                size="sm" 
                className="w-full" 
                onClick={() => setTimeRange('day')}
              >
                Past Day
              </Button>
              <Button 
                variant={timeRange === 'week' ? "default" : "outline"} 
                size="sm" 
                className="w-full" 
                onClick={() => setTimeRange('week')}
              >
                Past Week
              </Button>
              <Button 
                variant={timeRange === 'month' ? "default" : "outline"} 
                size="sm" 
                className="w-full" 
                onClick={() => setTimeRange('month')}
              >
                Past Month
              </Button>
              <Button 
                variant={timeRange === 'year' ? "default" : "outline"} 
                size="sm" 
                className="w-full" 
                onClick={() => setTimeRange('year')}
              >
                Past Year
              </Button>
            </div>
          </div>
        )}
        
        {/* Inventory summary card */}
        <div className="mb-4 p-4 bg-blue-50 border border-blue-100 rounded-md">
          <div className="flex flex-wrap justify-between items-center">
            <div>
              <h3 className="text-sm font-medium text-blue-800">Total Inventory Value</h3>
              <p className="text-2xl font-bold text-blue-900">{formatCurrency(totalInventoryValue)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-800">Total Records</h3>
              <p className="text-2xl font-bold text-blue-900">{filteredRecords.length}</p>
            </div>
          </div>
        </div>
        
        {/* Records table */}
        {loading ? (
          <div className="py-8 text-center">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">Loading coffee inventory records...</p>
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">
            <p>{error}</p>
            <Button variant="outline" className="mt-2" onClick={fetchCoffeeRecords}>
              Try Again
            </Button>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="py-8 text-center border rounded-md">
            <p className="text-muted-foreground mb-2">No coffee inventory records found</p>
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
                        onClick={() => requestSort('created_at')}
                      >
                        Date <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        className="flex items-center gap-1 p-0 h-auto font-medium"
                        onClick={() => requestSort('coffeeType')}
                      >
                        Type <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        className="flex items-center gap-1 p-0 h-auto font-medium"
                        onClick={() => requestSort('qualityGrade')}
                      >
                        Grade <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        className="flex items-center gap-1 p-0 h-auto font-medium"
                        onClick={() => requestSort('quantity')}
                      >
                        Quantity <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        className="flex items-center gap-1 p-0 h-auto font-medium"
                        onClick={() => requestSort('buying_price')}
                      >
                        Price <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        className="flex items-center gap-1 p-0 h-auto font-medium"
                        onClick={() => requestSort('location')}
                      >
                        Location <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        className="flex items-center gap-1 p-0 h-auto font-medium"
                        onClick={() => requestSort('source')}
                      >
                        Source <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        className="flex items-center gap-1 p-0 h-auto font-medium"
                        onClick={() => requestSort('status')}
                      >
                        Status <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{formatDate(record.created_at)}</TableCell>
                      <TableCell>{record.coffeeType || 'N/A'}</TableCell>
                      <TableCell>{record.qualityGrade || 'N/A'}</TableCell>
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
          Showing {filteredRecords.length} of {coffeeRecords.length} records
        </div>
      </CardContent>
    </Card>
  );
};

export default CoffeeInventoryRecords;
