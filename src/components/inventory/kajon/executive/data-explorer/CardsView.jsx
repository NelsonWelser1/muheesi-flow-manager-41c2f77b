
import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, AlertTriangle, Coffee, ArrowRight, CalendarDays, Map, User, Truck, Package, ShoppingCart, ArrowLeftRight } from 'lucide-react';
import { filterDataByOperationType } from '@/utils/coffee/coffeeDataFilters';

const CardsView = ({ 
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

  useEffect(() => {
    if (!data) return;
    
    // Apply operation type filter
    let filtered = data;
    
    // If specific operation type is provided, filter the data
    if (operationType && operationType !== 'all') {
      filtered = filterDataByOperationType(filtered, operationType);
    }
    
    // Apply specific status filter if provided
    if (filterStatus) {
      filtered = filtered.filter(item => item.status === filterStatus);
    }
    
    // Apply partner filter if provided
    if (filterPartner !== undefined) {
      filtered = filtered.filter(item => !!item.is_partner_transfer === filterPartner);
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
    
    // Sort by creation date
    const sortedData = [...filtered].sort((a, b) => {
      const dateA = new Date(a.created_at || a.date || 0);
      const dateB = new Date(b.created_at || b.date || 0);
      return dateB - dateA;
    });
    
    setFilteredData(sortedData);
  }, [data, searchTerm, operationType, filterStatus, filterPartner]);

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

  const getOperationIcon = (item) => {
    // Determine operation type based on data structure and source table
    let opType = item.operation_type;
    
    if (!opType) {
      if (sourceTable === 'coffee_sales') {
        opType = 'sell-stock';
      } else if (sourceTable === 'coffee_stock') {
        opType = 'receive-new';
      } else if (sourceTable === 'coffee_stock_transfers') {
        opType = item.is_partner_transfer ? 'partner-stock' : 'relocate-stock';
      }
    }
    
    switch (opType) {
      case 'receive-new':
        return <Package className="h-5 w-5 text-green-600" />;
      case 'sell-stock':
      case 'sell':
        return <ShoppingCart className="h-5 w-5 text-blue-600" />;
      case 'relocate-stock':
      case 'relocate':
        return <ArrowLeftRight className="h-5 w-5 text-purple-600" />;
      case 'partner-stock':
      case 'receive-partner':
        return <Truck className="h-5 w-5 text-amber-600" />;
      default:
        return <Coffee className="h-5 w-5 text-gray-600" />;
    }
  };

  const getOperationName = (item) => {
    // Determine operation type based on data structure and source table
    let opType = item.operation_type;
    
    if (!opType) {
      if (sourceTable === 'coffee_sales') {
        opType = 'sell-stock';
      } else if (sourceTable === 'coffee_stock') {
        opType = 'receive-new';
      } else if (sourceTable === 'coffee_stock_transfers') {
        opType = item.is_partner_transfer ? 'partner-stock' : 'relocate-stock';
      }
    }
    
    switch (opType) {
      case 'receive-new':
        return "Receive New Stock";
      case 'sell-stock':
      case 'sell':
        return "Sell Current Stock";
      case 'relocate-stock':
      case 'relocate':
        return "Relocate Stock";
      case 'partner-stock':
      case 'receive-partner':
        return "Partner Stock Transfer";
      default:
        return "Coffee Operation";
    }
  };

  const getCardColorClass = (item) => {
    const coffeeType = item.coffee_type || '';
    const isArabica = coffeeType.toLowerCase().includes('arabica');
    
    // Determine operation type
    let opType = item.operation_type;
    
    if (!opType) {
      if (sourceTable === 'coffee_sales') {
        opType = 'sell-stock';
      } else if (sourceTable === 'coffee_stock') {
        opType = 'receive-new';
      } else if (sourceTable === 'coffee_stock_transfers') {
        opType = item.is_partner_transfer ? 'partner-stock' : 'relocate-stock';
      }
    }
    
    switch (opType) {
      case 'receive-new':
        return isArabica 
          ? 'bg-gradient-to-br from-green-50 to-white border-green-200' 
          : 'bg-gradient-to-br from-green-50 to-white border-green-200';
      case 'sell-stock':
      case 'sell':
        return isArabica 
          ? 'bg-gradient-to-br from-blue-50 to-white border-blue-200' 
          : 'bg-gradient-to-br from-blue-50 to-white border-blue-200';
      case 'relocate-stock':
      case 'relocate':
        return isArabica 
          ? 'bg-gradient-to-br from-purple-50 to-white border-purple-200' 
          : 'bg-gradient-to-br from-purple-50 to-white border-purple-200';
      case 'partner-stock':
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

  // Get source and destination locations based on operation type
  const getSourceLocation = (item) => {
    if (sourceTable === 'coffee_stock_transfers') {
      return item.source_location || 'Unknown';
    }
    
    if (sourceTable === 'coffee_sales') {
      return item.location || 'Unknown';
    }
    
    if (sourceTable === 'coffee_stock') {
      return item.source || item.location || 'Unknown';
    }
    
    return item.source_location || item.source || item.location || 'Unknown';
  };
  
  const getDestinationLocation = (item) => {
    if (sourceTable === 'coffee_stock_transfers') {
      return item.destination_location || 'Unknown';
    }
    
    if (sourceTable === 'coffee_sales') {
      return item.buyer_name || 'Customer';
    }
    
    return item.destination_location || item.location || 'Same';
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
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {filteredData.map(item => (
        <div 
          key={item.id} 
          className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${getCardColorClass(item)}`}
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="flex items-center">
                {getOperationIcon(item)}
                <h3 className="font-medium ml-2">
                  {getOperationName(item)}
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
                <p className="text-sm font-medium">{getSourceLocation(item)}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Truck className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Destination</p>
                <p className="text-sm font-medium">{getDestinationLocation(item)}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <CalendarDays className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Created</p>
                <p className="text-sm">{formatDate(item.created_at || item.date)}</p>
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
