
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertTriangle, Coffee, ArrowUpDown } from 'lucide-react';
import { useCoffeeStockData } from '@/hooks/useCoffeeStockData';
import { useCoffeeStockTransfers } from '@/hooks/useCoffeeStockTransfers';

const TableView = ({ timeRange, statusFilter, searchTerm, categoryFilter, operationType }) => {
  const {
    transfers,
    loading: transfersLoading,
    error: transfersError,
    fetchTransfers
  } = useCoffeeStockTransfers();

  const { 
    stockData, 
    isLoading: stockLoading, 
    error: stockError, 
    fetchCoffeeStockData 
  } = useCoffeeStockData();
  
  const [filteredData, setFilteredData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ field: 'created_at', ascending: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      try {
        const filters = {
          timeRange,
          status: statusFilter,
          searchTerm,
          location: categoryFilter !== 'all' ? categoryFilter : undefined
        };
        
        await Promise.all([
          fetchCoffeeStockData(filters),
          fetchTransfers(filters)
        ]);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [timeRange, statusFilter, searchTerm, categoryFilter, operationType]);

  useEffect(() => {
    let combinedData = [];
    
    if (!operationType || operationType === 'all' || operationType === 'receive-partner') {
      const mappedTransfers = transfers.map(transfer => ({
        ...transfer,
        operationType: 'receive-partner',
        operationName: 'Receive Partner Stock',
        itemName: transfer.coffee_type || 'Coffee',
        quantity: transfer.quantity,
        location: transfer.destination_location || transfer.source_location,
        date: transfer.created_at
      }));
      combinedData = [...combinedData, ...mappedTransfers];
    }
    
    if (!operationType || operationType === 'all' || operationType === 'receive-new') {
      const mappedStockData = stockData.map(item => ({
        id: item.id,
        operationType: 'receive-new',
        operationName: 'Receive New Stock',
        coffee_type: item.coffee_type || 'Coffee',
        quality_grade: item.quality_grade || 'Standard',
        quantity: item.quantity,
        unit: item.unit || 'kg',
        location: item.location,
        manager: item.manager || 'System',
        status: item.status || 'completed',
        date: item.created_at,
        created_at: item.created_at,
        humidity: item.humidity,
        buying_price: item.buying_price,
        currency: item.currency,
        source: item.source
      }));
      
      combinedData = [...combinedData, ...mappedStockData];
    }
    
    if (categoryFilter && categoryFilter !== 'all') {
      combinedData = combinedData.filter(item => {
        const location = (item.location || '').toLowerCase();
        return location.includes(categoryFilter.toLowerCase());
      });
    }
    
    if (operationType && operationType !== 'all') {
      combinedData = combinedData.filter(item => item.operationType === operationType);
    }
    
    const sortedData = [...combinedData].sort((a, b) => {
      const aValue = a[sortConfig.field] || '';
      const bValue = b[sortConfig.field] || '';
      
      if (aValue < bValue) {
        return sortConfig.ascending ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.ascending ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredData(sortedData);
  }, [transfers, stockData, categoryFilter, operationType, sortConfig]);

  const handleSort = (field) => {
    setSortConfig(prevConfig => ({
      field,
      ascending: prevConfig.field === field ? !prevConfig.ascending : true
    }));
  };

  const handleRefresh = () => {
    fetchCoffeeStockData();
    fetchTransfers();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'received':
      case 'completed':
      case 'active':
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Completed
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
      default:
        return (
          <Badge variant="outline">{status}</Badge>
        );
    }
  };

  const getOperationBadge = (operationType) => {
    switch (operationType) {
      case 'receive-new':
        return <Badge className="bg-green-100 text-green-800">Receive New</Badge>;
      case 'sell':
        return <Badge className="bg-blue-100 text-blue-800">Sell</Badge>;
      case 'relocate':
        return <Badge className="bg-purple-100 text-purple-800">Relocate</Badge>;
      case 'receive-partner':
        return <Badge className="bg-amber-100 text-amber-800">Receive Partner</Badge>;
      default:
        return <Badge variant="outline">{operationType}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading || transfersLoading || stockLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-amber-500 rounded-full border-t-transparent"></div>
        <p className="ml-2 text-amber-800">Loading coffee stock data...</p>
      </div>
    );
  }

  if (transfersError || stockError) {
    return (
      <div className="bg-red-50 p-4 rounded-md border border-red-200">
        <h3 className="text-red-800 font-medium">Error loading data</h3>
        <p className="text-red-600">{transfersError?.message || stockError?.message}</p>
        <Button 
          onClick={handleRefresh} 
          className="mt-2 bg-red-100 text-red-800 hover:bg-red-200"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (filteredData.length === 0) {
    return (
      <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 text-center">
        <Coffee className="h-12 w-12 mx-auto text-amber-400 mb-3" />
        <h3 className="text-lg font-medium text-gray-700 mb-1">No Coffee Data Found</h3>
        <p className="text-gray-500 mb-4">Try adjusting your filters or search criteria.</p>
        <Button onClick={handleRefresh}>Refresh Data</Button>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">
              <Button variant="ghost" size="sm" onClick={() => handleSort('date')} className="flex items-center">
                Date
                <ArrowUpDown className="ml-2 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" size="sm" onClick={() => handleSort('operationName')} className="flex items-center">
                Operation
                <ArrowUpDown className="ml-2 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" size="sm" onClick={() => handleSort('coffee_type')} className="flex items-center">
                Coffee Type
                <ArrowUpDown className="ml-2 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" size="sm" onClick={() => handleSort('quantity')} className="flex items-center">
                Quantity
                <ArrowUpDown className="ml-2 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" size="sm" onClick={() => handleSort('location')} className="flex items-center">
                Location
                <ArrowUpDown className="ml-2 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Manager</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{formatDate(item.date)}</TableCell>
              <TableCell>{getOperationBadge(item.operationType)}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Coffee className={`h-4 w-4 ${
                    item.coffee_type?.toLowerCase().includes('arabica') ? 'text-green-600' : 'text-amber-600'
                  } mr-2`} />
                  <span>{item.coffee_type || 'Coffee'}</span>
                </div>
              </TableCell>
              <TableCell>{item.quantity} {item.unit || 'kg'}</TableCell>
              <TableCell>{item.location || 'Unknown'}</TableCell>
              <TableCell>{getStatusBadge(item.status)}</TableCell>
              <TableCell>{item.manager || 'System'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableView;
