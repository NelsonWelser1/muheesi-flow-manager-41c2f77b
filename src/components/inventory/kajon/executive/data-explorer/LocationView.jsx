
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight, Coffee, PackageCheck } from 'lucide-react';
import { useCoffeeStockTransfers } from '@/hooks/useCoffeeStockTransfers';

const LocationView = ({ isLoading, timeRange, statusFilter, searchTerm, categoryFilter }) => {
  const {
    transfers,
    loading: transfersLoading,
    error,
    handleTimeRangeChange,
    handleStatusChange,
    handleSearch,
    handleRefresh
  } = useCoffeeStockTransfers();

  const [locationData, setLocationData] = useState({});

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
    
    // Process data by location
    const locationMap = {};
    
    transfers.forEach(transfer => {
      // Process source locations
      if (!locationMap[transfer.source_location]) {
        locationMap[transfer.source_location] = {
          name: transfer.source_location,
          outgoing: 0,
          incoming: 0,
          totalVolume: 0,
          arabicaVolume: 0,
          robustaVolume: 0,
          transfers: []
        };
      }
      
      // Process destination locations
      if (!locationMap[transfer.destination_location]) {
        locationMap[transfer.destination_location] = {
          name: transfer.destination_location,
          outgoing: 0,
          incoming: 0,
          totalVolume: 0,
          arabicaVolume: 0,
          robustaVolume: 0,
          transfers: []
        };
      }
      
      // Count outgoing transfers from source
      locationMap[transfer.source_location].outgoing += 1;
      locationMap[transfer.source_location].transfers.push(transfer);
      
      // Count incoming transfers to destination
      locationMap[transfer.destination_location].incoming += 1;
      locationMap[transfer.destination_location].transfers.push(transfer);
      
      // Update volume counts
      const quantity = parseFloat(transfer.quantity) || 0;
      
      if (transfer.status === 'received') {
        // Only count received transfers for volume calculations
        // For source, subtract volume (it's leaving)
        locationMap[transfer.source_location].totalVolume -= quantity;
        
        // For destination, add volume (it's arriving)
        locationMap[transfer.destination_location].totalVolume += quantity;
        
        // Update coffee type specific volumes
        if (transfer.coffee_type === 'arabica') {
          locationMap[transfer.source_location].arabicaVolume -= quantity;
          locationMap[transfer.destination_location].arabicaVolume += quantity;
        } else {
          locationMap[transfer.source_location].robustaVolume -= quantity;
          locationMap[transfer.destination_location].robustaVolume += quantity;
        }
      }
    });
    
    setLocationData(locationMap);
  }, [transfers, timeRange, statusFilter, searchTerm, categoryFilter]);

  if (transfersLoading || isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-amber-500 rounded-full border-t-transparent"></div>
        <p className="ml-2 text-amber-800">Loading location data...</p>
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

  // Convert location object to array and sort by total volume
  const locationArray = Object.values(locationData).sort((a, b) => {
    return Math.abs(b.totalVolume) - Math.abs(a.totalVolume);
  });

  if (locationArray.length === 0) {
    return (
      <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 text-center">
        <MapPin className="h-12 w-12 mx-auto text-amber-400 mb-3" />
        <h3 className="text-lg font-medium text-gray-700 mb-1">No Location Data Found</h3>
        <p className="text-gray-500 mb-4">Try adjusting your filters or search criteria.</p>
        <Button onClick={handleRefresh}>Refresh Data</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-700">Total Locations</h3>
              <Badge className="bg-amber-100 text-amber-800">{locationArray.length}</Badge>
            </div>
            <p className="text-sm text-gray-500 mt-2">Active locations in the system with coffee transfers</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-700">Arabica Volume</h3>
              <Badge className="bg-green-100 text-green-800">
                {locationArray.reduce((sum, loc) => sum + Math.max(0, loc.arabicaVolume), 0)} kg
              </Badge>
            </div>
            <p className="text-sm text-gray-500 mt-2">Total arabica coffee across all locations</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-700">Robusta Volume</h3>
              <Badge className="bg-amber-100 text-amber-800">
                {locationArray.reduce((sum, loc) => sum + Math.max(0, loc.robustaVolume), 0)} kg
              </Badge>
            </div>
            <p className="text-sm text-gray-500 mt-2">Total robusta coffee across all locations</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          Coffee Stock by Location
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {locationArray.map(location => (
            <div 
              key={location.name} 
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-amber-600 mt-0.5 mr-2" />
                  <div>
                    <h3 className="font-medium text-gray-800">{location.name}</h3>
                    <div className="flex space-x-3 mt-1">
                      <Badge variant="outline" className="text-xs">
                        Incoming: {location.incoming}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Outgoing: {location.outgoing}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 mb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Coffee className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm">Arabica Volume</span>
                  </div>
                  <Badge className={`${Math.max(0, location.arabicaVolume) > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {Math.max(0, location.arabicaVolume)} kg
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Coffee className="h-4 w-4 text-amber-600 mr-2" />
                    <span className="text-sm">Robusta Volume</span>
                  </div>
                  <Badge className={`${Math.max(0, location.robustaVolume) > 0 ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'}`}>
                    {Math.max(0, location.robustaVolume)} kg
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <PackageCheck className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="text-sm">Total Coffee Volume</span>
                  </div>
                  <Badge className={`${Math.max(0, location.totalVolume) > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                    {Math.max(0, location.totalVolume)} kg
                  </Badge>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-2 text-amber-800 border-amber-200 hover:bg-amber-50"
              >
                View Detailed Transfer History <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocationView;
