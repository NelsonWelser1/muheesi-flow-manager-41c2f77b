
import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, AlertTriangle, Coffee, ArrowRight, CalendarDays, Map, User, Truck, Package, ShoppingCart, ArrowLeftRight } from 'lucide-react';
import { useCoffeeStockTransfers } from '@/hooks/useCoffeeStockTransfers';
import { useCoffeeStockData } from '@/hooks/useCoffeeStockData';

const CardsView = ({ isLoading, timeRange, statusFilter, searchTerm, categoryFilter, operationType }) => {
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
          source_location: item.location,
          destination_location: item.location,
          manager: item.manager || 'System',
          status: item.health === 'good' ? 'completed' : 
                 item.health === 'warning' ? 'pending' : 'declined',
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
    
    // Sort by created_at descending
    const sortedData = [...combinedData].sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });
    
    setFilteredData(sortedData);
  }, [transfers, stockData, timeRange, statusFilter, searchTerm, categoryFilter, operationType]);

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

  const getOperationIcon = (operationType) => {
    switch (operationType) {
      case 'receive-new':
        return <Package className="h-5 w-5 text-green-600" />;
      case 'sell':
        return <ShoppingCart className="h-5 w-5 text-blue-600" />;
      case 'relocate':
        return <ArrowLeftRight className="h-5 w-5 text-purple-600" />;
      case 'receive-partner':
        return <Truck className="h-5 w-5 text-amber-600" />;
      default:
        return <Coffee className="h-5 w-5 text-gray-600" />;
    }
  };

  const getCardColorClass = (operationType, coffeeType) => {
    const isArabica = coffeeType?.toLowerCase().includes('arabica');
    
    switch (operationType) {
      case 'receive-new':
        return isArabica 
          ? 'bg-gradient-to-br from-green-50 to-white border-green-200' 
          : 'bg-gradient-to-br from-green-50 to-white border-green-200';
      case 'sell':
        return isArabica 
          ? 'bg-gradient-to-br from-blue-50 to-white border-blue-200' 
          : 'bg-gradient-to-br from-blue-50 to-white border-blue-200';
      case 'relocate':
        return isArabica 
          ? 'bg-gradient-to-br from-purple-50 to-white border-purple-200' 
          : 'bg-gradient-to-br from-purple-50 to-white border-purple-200';
      case 'receive-partner':
      default:
        return isArabica 
          ? 'bg-gradient-to-br from-amber-50 to-white border-amber-200' 
          : 'bg-gradient-to-br from-amber-50 to-white border-amber-200';
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
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {filteredData.map(item => (
        <div 
          key={item.id} 
          className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${getCardColorClass(item.operationType, item.coffee_type)}`}
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="flex items-center">
                {getOperationIcon(item.operationType)}
                <h3 className="font-medium ml-2">
                  {item.operationName}
                </h3>
              </div>
              <div className="flex items-center mt-1">
                <Coffee className={`h-4 w-4 ${
                  item.coffee_type?.toLowerCase().includes('arabica') ? 'text-green-600' : 'text-amber-600'
                } mr-1`} />
                <p className="text-xs text-gray-600">{item.coffee_type || 'Coffee'} - {item.quality_grade || 'Standard'}</p>
              </div>
            </div>
            {getStatusBadge(item.status)}
          </div>
          
          <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-3">
            <div className="flex items-start gap-2">
              <Map className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Source</p>
                <p className="text-sm font-medium">{item.source_location || item.location || 'Unknown'}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Truck className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Destination</p>
                <p className="text-sm font-medium">{item.destination_location || item.location || 'Same'}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <CalendarDays className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Created</p>
                <p className="text-sm">{formatDate(item.created_at)}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <User className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Manager</p>
                <p className="text-sm">{item.manager || 'System'}</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center bg-white p-2 rounded border">
            <div>
              <p className="text-xs text-gray-500">Quantity</p>
              <p className="font-bold text-lg">{item.quantity} {item.unit || 'kg'}</p>
            </div>
            <Button variant="ghost" size="sm" className="text-xs">
              Details <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardsView;
