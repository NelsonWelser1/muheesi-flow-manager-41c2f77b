
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

const TableView = ({ isLoading, timeRange, statusFilter, searchTerm, categoryFilter, operationType }) => {
  const {
    transfers,
    loading: transfersLoading,
    error: transfersError,
    handleTimeRangeChange,
    handleStatusChange,
    handleSearch,
    handleRefresh
  } = useCoffeeStockTransfers();

  const { stockData, isLoading: stockLoading, error: stockError } = useCoffeeStockData();
  
  const [filteredData, setFilteredData] = useState([]);
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
    
    // Combine and filter data based on operation type
    let combinedData = [];
    
    // Process transfer data (for "Receive Partner Stock")
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
    
    // Process stock data for other operation types
    if (!operationType || operationType === 'all' || ['receive-new', 'sell', 'relocate'].includes(operationType)) {
      const mappedStockData = stockData.map(item => {
        // Determine operation type based on source/name/metadata
        let opType = 'receive-new'; // Default
        let opName = 'Receive New Stock';
        
        if (item.name && item.name.toLowerCase().includes('sale')) {
          opType = 'sell';
          opName = 'Sell Current Stock';
        } else if (item.name && item.name.toLowerCase().includes('transfer')) {
          opType = 'relocate';
          opName = 'Relocate Stock';
        } else if (item.source === 'transfers') {
          opType = 'receive-partner';
          opName = 'Receive Partner Stock';
        }
        
        // Only include if it matches the operation type filter
        if (operationType && operationType !== 'all' && opType !== operationType) {
          return null;
        }
        
        return {
          id: item.id,
          operationType: opType,
          operationName: opName,
          itemName: item.name || 'Coffee',
          coffee_type: item.type || 'Coffee',
          quality_grade: item.grade || 'Standard',
          quantity: item.current_stock,
          unit: 'kg',
          location: item.location,
          manager: item.manager || 'System',
          status: item.health === 'good' ? 'completed' : 
                 item.health === 'warning' ? 'pending' : 'declined',
          date: item.updated_at,
          created_at: item.updated_at
        };
      }).filter(Boolean);
      
      combinedData = [...combinedData, ...mappedStockData];
    }
    
    // Apply category filter if specified
    if (categoryFilter && categoryFilter !== 'all') {
      combinedData = combinedData.filter(item => {
        const location = (item.location || '').toLowerCase();
        return location.includes(categoryFilter.toLowerCase());
      });
    }
    
    // Sort the combined data
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
  }, [transfers, stockData, timeRange, statusFilter, searchTerm, categoryFilter, operationType, sortConfig]);

  const handleSort = (field) => {
    setSortConfig(prevConfig => ({
      field,
      ascending: prevConfig.field === field ? !prevConfig.ascending : true
    }));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'received':
      case 'completed':
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

  if (isLoading || transfersLoading || stockLoading) {
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
        <p className="text-red-600">{transfersError || stockError}</p>
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
