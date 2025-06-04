
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, Package, TrendingDown, TrendingUp, AlertTriangle, Plus } from 'lucide-react';

const StockManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const stockItems = [
    {
      id: 'SKU001',
      name: 'Arabica Coffee Beans',
      category: 'Raw Materials',
      currentStock: 1250,
      minStock: 500,
      maxStock: 2000,
      unit: 'kg',
      location: 'Warehouse A',
      lastUpdated: '2024-06-04',
      value: '$12,500',
      status: 'Normal'
    },
    {
      id: 'SKU002',
      name: 'Pasteurized Milk',
      category: 'Dairy Products',
      currentStock: 150,
      minStock: 200,
      maxStock: 800,
      unit: 'liters',
      location: 'Cold Storage',
      lastUpdated: '2024-06-04',
      value: '$750',
      status: 'Low Stock'
    },
    {
      id: 'SKU003',
      name: 'Processed Cheese',
      category: 'Finished Goods',
      currentStock: 890,
      minStock: 300,
      maxStock: 1000,
      unit: 'units',
      location: 'Warehouse B',
      lastUpdated: '2024-06-04',
      value: '$8,900',
      status: 'Near Capacity'
    },
    {
      id: 'SKU004',
      name: 'Packaging Materials',
      category: 'Supplies',
      currentStock: 5000,
      minStock: 2000,
      maxStock: 8000,
      unit: 'pieces',
      location: 'Supply Room',
      lastUpdated: '2024-06-03',
      value: '$2,500',
      status: 'Normal'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Normal': return 'bg-green-100 text-green-800';
      case 'Low Stock': return 'bg-red-100 text-red-800';
      case 'Near Capacity': return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockLevel = (current, min, max) => {
    return ((current - min) / (max - min)) * 100;
  };

  const getStockIcon = (status) => {
    switch (status) {
      case 'Low Stock': return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'Near Capacity': return <TrendingUp className="h-4 w-4 text-yellow-600" />;
      case 'Normal': return <Package className="h-4 w-4 text-green-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search inventory items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            Import Data
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,847</div>
            <p className="text-xs text-muted-foreground">Active stock items</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">23</div>
            <p className="text-xs text-muted-foreground">Need replenishment</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">$2.8M</div>
            <p className="text-xs text-muted-foreground">Current inventory value</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Avg Turnover</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">6.2x</div>
            <p className="text-xs text-muted-foreground">Annual turnover rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {stockItems.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  {getStockIcon(item.status)}
                  <div>
                    <h4 className="font-semibold text-lg">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">SKU: {item.id} | {item.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                  <Badge variant="outline">
                    {item.location}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Current Stock</p>
                  <p className="text-xl font-bold">{item.currentStock.toLocaleString()} {item.unit}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Stock Range</p>
                  <p className="font-semibold">{item.minStock} - {item.maxStock} {item.unit}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Value</p>
                  <p className="font-semibold">{item.value}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Last Updated</p>
                  <p className="font-semibold">{item.lastUpdated}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Stock Level</span>
                  <span className="text-sm font-semibold">
                    {Math.round(getStockLevel(item.currentStock, item.minStock, item.maxStock))}%
                  </span>
                </div>
                <Progress 
                  value={getStockLevel(item.currentStock, item.minStock, item.maxStock)}
                  className="h-2"
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Update Stock
                </Button>
                <Button variant="outline" size="sm">
                  View History
                </Button>
                <Button variant="outline" size="sm">
                  Reorder
                </Button>
                <Button variant="outline" size="sm">
                  Transfer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StockManagement;
