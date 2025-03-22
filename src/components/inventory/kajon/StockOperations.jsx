
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  ShoppingCart, 
  ArrowLeftRight, 
  Truck, 
  Eye, 
  BarChart4, 
  Activity,
  Filter,
  Layout,
  Settings
} from "lucide-react";
import ReceiveNewStock from './stock-operations/ReceiveNewStock';
import SellCurrentStock from './stock-operations/SellCurrentStock';
import RelocateStock from './stock-operations/RelocateStock';
import ReceivePartnerStock from './stock-operations/ReceivePartnerStock';
import CoffeeInventoryRecords from './stock-operations/records/CoffeeInventoryRecords';

const StockOperations = ({ isKazo = false }) => {
  const [activeComponent, setActiveComponent] = useState(null);
  const [viewType, setViewType] = useState('tiles'); // 'tiles' or 'list'
  const [filterActive, setFilterActive] = useState(false);
  
  // Define operation tiles with enhanced metadata
  const operationTiles = [
    {
      id: 'receive-new',
      title: 'Receive New Stock',
      description: 'Record incoming coffee stock from suppliers',
      icon: Package,
      color: 'bg-green-50 hover:bg-green-100 border-green-200',
      textColor: 'text-green-800',
      component: <ReceiveNewStock isKazo={isKazo} />,
      recentActivity: '2 days ago',
      priority: 'high'
    },
    {
      id: 'sell',
      title: 'Sell Current Stock',
      description: 'Record outgoing stock sales to customers',
      icon: ShoppingCart,
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
      textColor: 'text-blue-800',
      component: <SellCurrentStock isKazo={isKazo} />,
      recentActivity: '5 hours ago',
      priority: 'medium'
    },
    {
      id: 'relocate',
      title: 'Relocate Stock',
      description: 'Transfer stock between warehouse locations',
      icon: ArrowLeftRight,
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
      textColor: 'text-purple-800',
      component: <RelocateStock isKazo={isKazo} />,
      recentActivity: '1 week ago',
      priority: 'low'
    },
    {
      id: 'receive-partner',
      title: 'Receive Partner Stock',
      description: 'Record stock received from partner locations',
      icon: Truck,
      color: 'bg-amber-50 hover:bg-amber-100 border-amber-100',
      textColor: 'text-amber-800',
      component: <ReceivePartnerStock isKazo={isKazo} />,
      recentActivity: '3 days ago',
      priority: 'medium'
    }
  ];

  // Stock health summary data (mock data - in a real app this would come from API)
  const stockHealth = {
    total: 1240,
    healthy: 920,
    warning: 240,
    critical: 80,
    recentUpdates: 18
  };

  // Handler for tile click
  const handleTileClick = (tileId) => {
    setActiveComponent(tileId);
  };

  // Handler for back button
  const handleBackClick = () => {
    setActiveComponent(null);
  };

  // Handle view records click
  const handleViewRecords = () => {
    setActiveComponent('records');
  };

  // Toggle view type
  const toggleViewType = () => {
    setViewType(viewType === 'tiles' ? 'list' : 'tiles');
  };

  // Toggle filters
  const toggleFilters = () => {
    setFilterActive(!filterActive);
  };

  // Render activity indicator
  const renderActivityIndicator = (activity) => {
    const days = activity.includes('day') 
      ? parseInt(activity.split(' ')[0])
      : activity.includes('week') 
        ? parseInt(activity.split(' ')[0]) * 7
        : activity.includes('hour') 
          ? 0 
          : 30;
    
    return days <= 1 
      ? <span className="flex items-center text-green-600 text-xs"><Activity className="h-3 w-3 mr-1" /> {activity}</span>
      : days <= 3 
        ? <span className="flex items-center text-blue-600 text-xs"><Activity className="h-3 w-3 mr-1" /> {activity}</span>
        : <span className="flex items-center text-gray-600 text-xs"><Activity className="h-3 w-3 mr-1" /> {activity}</span>;
  };

  // Render priority indicator
  const renderPriorityIndicator = (priority) => {
    return priority === 'high' 
      ? <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">High</span>
      : priority === 'medium' 
        ? <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">Medium</span>
        : <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Low</span>;
  };

  // Render stock health dashboard
  const renderStockHealthDashboard = () => (
    <div className="grid grid-cols-5 gap-3 mb-6 text-center">
      <div className="bg-white p-3 rounded-lg border shadow-sm">
        <div className="text-xl font-semibold">{stockHealth.total}</div>
        <div className="text-xs text-gray-600">Total Stock</div>
      </div>
      <div className="bg-green-50 p-3 rounded-lg border border-green-100 shadow-sm">
        <div className="text-xl font-semibold text-green-700">{stockHealth.healthy}</div>
        <div className="text-xs text-green-600">Healthy</div>
      </div>
      <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 shadow-sm">
        <div className="text-xl font-semibold text-amber-700">{stockHealth.warning}</div>
        <div className="text-xs text-amber-600">Low</div>
      </div>
      <div className="bg-red-50 p-3 rounded-lg border border-red-100 shadow-sm">
        <div className="text-xl font-semibold text-red-700">{stockHealth.critical}</div>
        <div className="text-xs text-red-600">Critical</div>
      </div>
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 shadow-sm">
        <div className="text-xl font-semibold text-blue-700">{stockHealth.recentUpdates}</div>
        <div className="text-xs text-blue-600">Recent Updates</div>
      </div>
    </div>
  );

  // Render active component
  if (activeComponent) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-6">
            <Button 
              variant="outline" 
              onClick={handleBackClick}
              className="flex items-center gap-2"
            >
              Back to Operations
            </Button>
            
            {activeComponent === 'receive-new' && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={handleViewRecords}
              >
                <Eye className="h-4 w-4" />
                View Records
              </Button>
            )}
          </div>

          {activeComponent === 'records' ? (
            <CoffeeInventoryRecords onBack={handleBackClick} isKazo={isKazo} />
          ) : (
            <div className="animate-fade-in">
              {operationTiles.find(tile => tile.id === activeComponent)?.component}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Render dashboard
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Stock Operations Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleFilters}
              className={`flex items-center gap-1 ${filterActive ? 'bg-blue-50' : ''}`}
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleViewType}
              className="flex items-center gap-1"
            >
              <Layout className="h-4 w-4" />
              {viewType === 'tiles' ? 'List View' : 'Tile View'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleViewRecords}
              className="flex items-center gap-1"
            >
              <BarChart4 className="h-4 w-4" />
              Analytics
            </Button>
          </div>
        </div>

        {renderStockHealthDashboard()}
        
        {filterActive && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6 border animate-fade-in">
            <div className="text-sm font-medium mb-3">Quick Filters</div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" className="bg-white">All Locations</Button>
              <Button size="sm" variant="outline" className="bg-white">Recent Activity</Button>
              <Button size="sm" variant="outline" className="bg-white">Critical Items</Button>
              <Button size="sm" variant="outline" className="bg-white">Arabica Only</Button>
              <Button size="sm" variant="outline" className="bg-white">Robusta Only</Button>
            </div>
          </div>
        )}

        {viewType === 'tiles' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {operationTiles.map((tile) => (
              <Button
                key={tile.id}
                variant="outline"
                className={`h-40 flex flex-col items-center justify-center space-y-2 ${tile.color} border relative overflow-hidden hover:shadow-md transition-all duration-200`}
                onClick={() => handleTileClick(tile.id)}
              >
                <div className="absolute top-2 right-2 flex items-center space-x-2">
                  {renderPriorityIndicator(tile.priority)}
                </div>
                <tile.icon className={`h-8 w-8 ${tile.textColor}`} />
                <span className={`text-lg font-semibold ${tile.textColor}`}>{tile.title}</span>
                <span className="text-xs text-gray-500">{tile.description}</span>
                <div className="absolute bottom-2 left-2">
                  {renderActivityIndicator(tile.recentActivity)}
                </div>
              </Button>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {operationTiles.map((tile) => (
              <div 
                key={tile.id}
                className={`${tile.color} rounded-lg border p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition-all duration-200`}
                onClick={() => handleTileClick(tile.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${tile.color} border`}>
                    <tile.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className={`font-medium ${tile.textColor}`}>{tile.title}</h3>
                    <p className="text-xs text-gray-500">{tile.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {renderActivityIndicator(tile.recentActivity)}
                  {renderPriorityIndicator(tile.priority)}
                  <Button size="sm" variant="ghost" className="ml-2">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StockOperations;
