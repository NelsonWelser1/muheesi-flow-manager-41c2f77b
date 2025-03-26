
import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, AlertTriangle, Coffee, ArrowRight, CalendarDays, Map, User, Truck } from 'lucide-react';
import { useCoffeeStockTransfers } from '@/hooks/useCoffeeStockTransfers';

const CardsView = ({ isLoading, timeRange, statusFilter, searchTerm, categoryFilter }) => {
  const {
    transfers,
    loading: transfersLoading,
    error,
    handleTimeRangeChange,
    handleStatusChange,
    handleSearch,
    handleRefresh
  } = useCoffeeStockTransfers();

  const [filteredTransfers, setFilteredTransfers] = useState([]);

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
    
    setFilteredTransfers(transfers);
  }, [transfers, timeRange, statusFilter, searchTerm, categoryFilter]);

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

  if (filteredTransfers.length === 0) {
    return (
      <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 text-center">
        <Coffee className="h-12 w-12 mx-auto text-amber-400 mb-3" />
        <h3 className="text-lg font-medium text-gray-700 mb-1">No Coffee Transfer Records Found</h3>
        <p className="text-gray-500 mb-4">Try adjusting your filters or search criteria.</p>
        <Button onClick={handleRefresh}>Refresh Data</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {filteredTransfers.map(transfer => (
        <div 
          key={transfer.id} 
          className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
            transfer.coffee_type === 'arabica' 
              ? 'bg-gradient-to-br from-green-50 to-white border-green-200' 
              : 'bg-gradient-to-br from-amber-50 to-white border-amber-200'
          }`}
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="flex items-center">
                <Coffee className={`h-5 w-5 ${
                  transfer.coffee_type === 'arabica' ? 'text-green-600' : 'text-amber-600'
                } mr-2`} />
                <h3 className={`font-medium ${
                  transfer.coffee_type === 'arabica' ? 'text-green-800' : 'text-amber-800'
                }`}>
                  {transfer.coffee_type === 'arabica' ? 'Arabica' : 'Robusta'} Coffee
                </h3>
              </div>
              <p className="text-xs text-gray-500 mt-1">{transfer.quality_grade}</p>
            </div>
            {getStatusBadge(transfer.status)}
          </div>
          
          <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-3">
            <div className="flex items-start gap-2">
              <Map className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Source</p>
                <p className="text-sm font-medium">{transfer.source_location}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Truck className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Destination</p>
                <p className="text-sm font-medium">{transfer.destination_location}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <CalendarDays className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Created</p>
                <p className="text-sm">{formatDate(transfer.created_at)}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <User className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Manager</p>
                <p className="text-sm">{transfer.manager}</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center bg-white p-2 rounded border">
            <div>
              <p className="text-xs text-gray-500">Quantity</p>
              <p className="font-bold text-lg">{transfer.quantity} {transfer.unit}</p>
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
