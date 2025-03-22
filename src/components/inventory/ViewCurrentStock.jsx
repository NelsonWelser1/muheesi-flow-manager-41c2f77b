
import React, { useState } from 'react';
import ViewStockDashboard from './ViewStockDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/card";
import { Card, CardContent } from "@/components/ui/card";
import StockCards from './stock-visualization/StockCards';
import StockTable from './stock-visualization/StockTable';
import StockMap from './stock-visualization/StockMap';
import StockInsights from './stock-visualization/StockInsights';

const ViewCurrentStock = ({ isKazo }) => {
  const [viewMode, setViewMode] = useState('dashboard');
  
  // Mock data for stock visualization
  const mockStockData = [
    {
      id: 1,
      name: 'Arabica Coffee: Bugisu AA',
      type: 'Arabica',
      grade: 'AA',
      location: isKazo ? 'Kanoni-Mbogo' : 'Kampala Store',
      current_stock: 1200,
      max_capacity: 2000,
      health: 'good',
      trend: 'up',
      updated_at: '2023-08-15T10:30:00Z'
    },
    {
      id: 2,
      name: 'Robusta Coffee: FAQ',
      type: 'Robusta',
      grade: 'FAQ',
      location: isKazo ? 'Engari-Kaichumu' : 'JBER',
      current_stock: 450,
      max_capacity: 1500,
      health: 'warning',
      trend: 'down',
      updated_at: '2023-08-10T14:45:00Z'
    },
    {
      id: 3,
      name: 'Arabica Coffee: Bugisu B',
      type: 'Arabica',
      grade: 'B',
      location: isKazo ? 'Migina' : 'Mbarara Warehouse',
      current_stock: 80,
      max_capacity: 500,
      health: 'critical',
      trend: 'down',
      updated_at: '2023-08-01T09:15:00Z'
    },
    {
      id: 4,
      name: 'Robusta Coffee: Screen 18',
      type: 'Robusta',
      grade: 'Screen 18',
      location: isKazo ? 'Buremba' : 'Kakyinga Factory',
      current_stock: 750,
      max_capacity: 1000,
      health: 'good',
      trend: 'stable',
      updated_at: '2023-08-12T16:20:00Z'
    },
    {
      id: 5,
      name: 'Arabica Coffee: DRUGAR',
      type: 'Arabica',
      grade: 'DRUGAR',
      location: isKazo ? 'Kyampangara' : 'Kazo - Kanoni Warehouse',
      current_stock: 320,
      max_capacity: 800,
      health: 'warning',
      trend: 'up',
      updated_at: '2023-08-14T11:10:00Z'
    },
    {
      id: 6,
      name: 'Robusta Coffee: Organic',
      type: 'Robusta',
      grade: 'Organic',
      location: isKazo ? 'Kazo Town council' : 'Kampala Store',
      current_stock: 900,
      max_capacity: 1200,
      health: 'good',
      trend: 'up',
      updated_at: '2023-08-11T13:40:00Z'
    }
  ];
  
  // Mock data for locations
  const locationData = [
    {
      name: isKazo ? 'Kanoni-Mbogo' : 'Kampala Store',
      stockLevel: 2100,
      maxCapacity: 3000,
      stockTypes: ['Arabica', 'Robusta']
    },
    {
      name: isKazo ? 'Engari-Kaichumu' : 'JBER',
      stockLevel: 1200,
      maxCapacity: 2500,
      stockTypes: ['Arabica', 'Robusta']
    },
    {
      name: isKazo ? 'Migina' : 'Mbarara Warehouse',
      stockLevel: 950,
      maxCapacity: 1800,
      stockTypes: ['Arabica', 'Robusta']
    },
    {
      name: isKazo ? 'Buremba' : 'Kakyinga Factory',
      stockLevel: 750,
      maxCapacity: 1000,
      stockTypes: ['Robusta']
    }
  ];
  
  // Handle viewing item details
  const handleViewDetails = (item) => {
    console.log('Viewing details for item:', item);
    // Implementation for displaying the details modal/view
  };

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
              <StockCards data={mockStockData} onViewDetails={handleViewDetails} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="table" className="animate-fade-in">
          <Card>
            <CardContent className="pt-6">
              <StockTable data={mockStockData} onViewDetails={handleViewDetails} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="map" className="animate-fade-in">
          <Card>
            <CardContent className="pt-6">
              <StockMap locationData={locationData} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="insights" className="animate-fade-in">
          <StockInsights stockData={mockStockData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ViewCurrentStock;
