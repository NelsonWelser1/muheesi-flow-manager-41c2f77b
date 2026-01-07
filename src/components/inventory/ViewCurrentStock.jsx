import React, { useState, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ViewStockDashboard from './ViewStockDashboard';
import StockCards from './stock-visualization/StockCards';
import StockTable from './stock-visualization/StockTable';
import StockMap from './stock-visualization/StockMap';
import StockInsights from './stock-visualization/StockInsights';
import useCoffeeStockData from '@/hooks/useCoffeeStockData';
import { Loader2 } from 'lucide-react';

const ViewCurrentStock = ({ isKazo }) => {
  const [viewMode, setViewMode] = useState('dashboard');
  const { stockData, isLoading, error } = useCoffeeStockData();
  
  // Transform database data to match the expected format for StockCards/StockTable
  const transformedStockData = useMemo(() => {
    if (!stockData || stockData.length === 0) return [];
    
    return stockData.map((item, index) => {
      // Calculate health based on quantity thresholds
      let health = 'good';
      if (item.quantity < 100) health = 'critical';
      else if (item.quantity < 500) health = 'warning';
      
      // Determine trend based on status
      let trend = 'stable';
      if (item.status === 'in_stock') trend = 'up';
      else if (item.status === 'low_stock') trend = 'down';
      
      return {
        id: item.id || index + 1,
        name: `${item.coffee_type}: ${item.quality_grade}`,
        type: item.coffee_type,
        grade: item.quality_grade,
        location: item.location,
        current_stock: item.quantity,
        max_capacity: Math.max(item.quantity * 2, 1000), // Estimate max capacity
        health,
        trend,
        updated_at: item.updated_at || item.created_at
      };
    });
  }, [stockData]);
  
  // Generate location data from stock data
  const locationData = useMemo(() => {
    if (!stockData || stockData.length === 0) return [];
    
    const locationMap = {};
    
    stockData.forEach(item => {
      if (!locationMap[item.location]) {
        locationMap[item.location] = {
          name: item.location,
          stockLevel: 0,
          maxCapacity: 0,
          stockTypes: new Set()
        };
      }
      locationMap[item.location].stockLevel += item.quantity;
      locationMap[item.location].maxCapacity += Math.max(item.quantity * 2, 1000);
      locationMap[item.location].stockTypes.add(item.coffee_type);
    });
    
    return Object.values(locationMap).map(loc => ({
      ...loc,
      stockTypes: Array.from(loc.stockTypes)
    }));
  }, [stockData]);
  
  // Handle viewing item details
  const handleViewDetails = (item) => {
    console.log('Viewing details for item:', item);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading stock data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-destructive">
        Error loading stock data: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs value={viewMode} onValueChange={setViewMode} className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="cards">Card View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="map">Location Map</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="animate-fade-in">
          <ViewStockDashboard isKazo={isKazo} />
        </TabsContent>
        
        <TabsContent value="cards" className="animate-fade-in">
          <Card>
            <CardContent className="pt-6">
              {transformedStockData.length > 0 ? (
                <StockCards data={transformedStockData} onViewDetails={handleViewDetails} />
              ) : (
                <p className="text-center text-muted-foreground py-8">No stock data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="table" className="animate-fade-in">
          <Card>
            <CardContent className="pt-6">
              {transformedStockData.length > 0 ? (
                <StockTable data={transformedStockData} onViewDetails={handleViewDetails} />
              ) : (
                <p className="text-center text-muted-foreground py-8">No stock data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="map" className="animate-fade-in">
          <Card>
            <CardContent className="pt-6">
              {locationData.length > 0 ? (
                <StockMap locationData={locationData} />
              ) : (
                <p className="text-center text-muted-foreground py-8">No location data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="insights" className="animate-fade-in">
          <StockInsights stockData={transformedStockData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ViewCurrentStock;
