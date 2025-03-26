
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
import { 
  filterDataByOperationType, 
  filterPartnerStockTransfers,
  filterRelocationTransfers
} from '@/utils/coffee/coffeeDataFilters';

const TableView = ({ 
  data = [], 
  isLoading = false, 
  error = null, 
  handleRefresh, 
  title = "Coffee Stock Data",
  sourceTable = "coffee_stock",
  timeRange,
  searchTerm,
  operationType,
  filterStatus,
  filterPartner 
}) => {
  const [filteredData, setFilteredData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ field: 'created_at', ascending: false });

  useEffect(() => {
    if (!data) return;
    
    // Apply operation type filter
    let filtered = data;
    
    // If specific operation type is provided, filter the data
    if (operationType && operationType !== 'all') {
      switch(operationType) {
        case 'partner-stock':
          filtered = filterPartnerStockTransfers(filtered);
          break;
        case 'relocate-stock':
          filtered = filterRelocationTransfers(filtered);
          break;
        default:
          filtered = filterDataByOperationType(filtered, operationType);
          break;
      }
    }
    
    // Apply specific status filter if provided
    if (filterStatus) {
      filtered = filtered.filter(item => item.status === filterStatus);
    }
    
    // Apply partner filter if provided
    if (filterPartner !== undefined) {
      if (operationType === 'partner-stock') {
        filtered = filterPartnerStockTransfers(filtered);
      } else if (operationType === 'relocate-stock') {
        filtered = filterRelocationTransfers(filtered);
      }
    }
    
    // Apply search filter if there's a search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(item => {
        const searchableFields = [
          'coffee_type', 'quality_grade', 'location', 'source_location', 
          'destination_location', 'manager', 'buyer_name', 'name'
        ];
        
        return searchableFields.some(field => {
          return item[field] && item[field].toString().toLowerCase().includes(search);
        });
      });
    }
    
    // Sort the data
    const sortedData = [...filtered].sort((a, b) => {
      let aValue = a[sortConfig.field];
      let bValue = b[sortConfig.field];
      
      // Handle dates
      if (sortConfig.field === 'created_at' || sortConfig.field === 'date' || sortConfig.field.includes('date')) {
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
      }
      
      if (aValue < bValue) {
        return sortConfig.ascending ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.ascending ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredData(sortedData);
  }, [data, sortConfig, searchTerm, operationType, filterStatus, filterPartner]);

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

  const getOperationBadge = (item) => {
    // Determine operation type based on data structure and source table
    let operationType = item.operation_type;
    
    if (!operationType) {
      if (sourceTable === 'coffee_sales') {
        operationType = 'sell-stock';
      } else if (sourceTable === 'coffee_stock') {
        operationType = 'receive-new';
      } else if (sourceTable === 'coffee_stock_transfers') {
        // For transfers, distinguish between partner and relocation
        const isPartnerTransfer = filterPartnerStockTransfers([item]).length > 0;
        operationType = isPartnerTransfer ? 'partner-stock' : 'relocate-stock';
      }
    }
    
    switch (operationType) {
      case 'receive-new':
        return <Badge className="bg-green-100 text-green-800">Receive New</Badge>;
      case 'sell':
      case 'sell-stock':
        return <Badge className="bg-blue-100 text-blue-800">Sell</Badge>;
      case 'relocate':
      case 'relocate-stock':
        return <Badge className="bg-purple-100 text-purple-800">Relocate</Badge>;
      case 'receive-partner':
      case 'partner-stock':
        return <Badge className="bg-amber-100 text-amber-800">Receive Partner</Badge>;
      default:
        return <Badge variant="outline">{operationType || "Unknown"}</Badge>;
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

  // Get location display value based on operation type and source table
  const getLocationDisplay = (item) => {
    if (sourceTable === 'coffee_stock_transfers') {
      // For partner transfers, focus on destination (receiving location)
      if (operationType === 'partner-stock' || filterPartnerStockTransfers([item]).length > 0) {
        return item.destination_location || 'Unknown';
      } else {
        return `${item.source_location || 'Unknown'} → ${item.destination_location || 'Unknown'}`;
      }
    }
    return item.location || 'Unknown';
  };

  // Get quantity display with units
  const getQuantityDisplay = (item) => {
    return `${item.quantity || 0} ${item.unit || 'kg'}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-amber-500 rounded-full border-t-transparent"></div>
        <p className="ml-2 text-amber-800">Loading coffee data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md border border-red-200">
        <h3 className="text-red-800 font-medium">Error loading data</h3>
        <p className="text-red-600">{error?.message || error}</p>
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
              <Button variant="ghost" size="sm" onClick={() => handleSort('created_at')} className="flex items-center">
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
              <TableCell className="font-medium">{formatDate(item.created_at || item.date)}</TableCell>
              <TableCell>{getOperationBadge(item)}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Coffee className={`h-4 w-4 ${
                    item.coffee_type?.toLowerCase().includes('arabica') ? 'text-green-600' : 'text-amber-600'
                  } mr-2`} />
                  <span>{item.coffee_type || 'Coffee'}</span>
                </div>
              </TableCell>
              <TableCell>{getQuantityDisplay(item)}</TableCell>
              <TableCell>{getLocationDisplay(item)}</TableCell>
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
