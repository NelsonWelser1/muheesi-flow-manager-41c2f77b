
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Package, 
  Factory, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  BarChart3,
  Layers,
  Clock
} from 'lucide-react';

const InventoryProduction = ({ selectedEntity }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const inventoryData = [
    {
      id: 1,
      item: 'Premium Cheese',
      company: 'Grand Berna Dairies',
      category: 'Finished Goods',
      currentStock: 2500,
      unit: 'kg',
      reorderLevel: 500,
      maxCapacity: 5000,
      value: 12500000,
      status: 'Optimal',
      lastUpdated: '2024-06-01'
    },
    {
      id: 2,
      item: 'Arabica Coffee Beans',
      company: 'KAJON Coffee Limited',
      category: 'Raw Materials',
      currentStock: 8200,
      unit: 'kg',
      reorderLevel: 2000,
      maxCapacity: 15000,
      value: 24600000,
      status: 'Optimal',
      lastUpdated: '2024-06-01'
    },
    {
      id: 3,
      item: 'Organic Fertilizer',
      company: 'Kyalima Farmers Limited',
      category: 'Supplies',
      currentStock: 450,
      unit: 'tons',
      reorderLevel: 200,
      maxCapacity: 1000,
      value: 2250000,
      status: 'Low Stock',
      lastUpdated: '2024-05-31'
    },
    {
      id: 4,
      item: 'Fresh Milk',
      company: 'Grand Berna Dairies',
      category: 'Raw Materials',
      currentStock: 15000,
      unit: 'liters',
      reorderLevel: 5000,
      maxCapacity: 25000,
      value: 15000000,
      status: 'Optimal',
      lastUpdated: '2024-06-02'
    },
    {
      id: 5,
      item: 'Roasted Coffee',
      company: 'KAJON Coffee Limited',
      category: 'Finished Goods',
      currentStock: 1200,
      unit: 'kg',
      reorderLevel: 300,
      maxCapacity: 3000,
      value: 8400000,
      status: 'Optimal',
      lastUpdated: '2024-06-01'
    }
  ];

  const productionData = [
    {
      id: 1,
      product: 'Cheese Production',
      company: 'Grand Berna Dairies',
      dailyTarget: 500,
      dailyActual: 485,
      weeklyTarget: 3500,
      weeklyActual: 3280,
      efficiency: 97,
      quality: 98,
      status: 'On Track'
    },
    {
      id: 2,
      product: 'Coffee Processing',
      company: 'KAJON Coffee Limited',
      dailyTarget: 800,
      dailyActual: 720,
      weeklyTarget: 5600,
      weeklyActual: 5040,
      efficiency: 90,
      quality: 95,
      status: 'Below Target'
    },
    {
      id: 3,
      product: 'Rice Processing',
      company: 'Kyalima Farmers Limited',
      dailyTarget: 300,
      dailyActual: 285,
      weeklyTarget: 2100,
      weeklyActual: 1995,
      efficiency: 95,
      quality: 92,
      status: 'On Track'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Optimal': return 'bg-success';
      case 'On Track': return 'bg-success';
      case 'Low Stock': return 'bg-warning';
      case 'Below Target': return 'bg-warning';
      case 'Critical': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const filteredInventory = inventoryData.filter(item => {
    const matchesSearch = item.item.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesEntity = selectedEntity === 'all' || item.company === selectedEntity;
    return matchesSearch && matchesCategory && matchesEntity;
  });

  const filteredProduction = productionData.filter(prod => {
    const matchesEntity = selectedEntity === 'all' || prod.company === selectedEntity;
    return matchesEntity;
  });

  const totalInventoryValue = filteredInventory.reduce((sum, item) => sum + item.value, 0);
  const lowStockItems = filteredInventory.filter(item => item.status === 'Low Stock').length;
  const avgEfficiency = filteredProduction.reduce((sum, prod) => sum + prod.efficiency, 0) / filteredProduction.length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Inventory & Production Management</h3>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Finished Goods">Finished Goods</SelectItem>
              <SelectItem value="Raw Materials">Raw Materials</SelectItem>
              <SelectItem value="Supplies">Supplies</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              Total Inventory Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totalInventoryValue)}</p>
            <p className="text-xs text-success">+5.2% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-warning">{lowStockItems}</p>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Factory className="h-4 w-4" />
              Avg Production Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">{avgEfficiency.toFixed(1)}%</p>
            <p className="text-xs text-success">Above target</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Active Production Lines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-success">{filteredProduction.length}</p>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Inventory Management</TabsTrigger>
          <TabsTrigger value="production">Production Monitoring</TabsTrigger>
          <TabsTrigger value="analytics">Analytics & Reports</TabsTrigger>
          <TabsTrigger value="planning">Production Planning</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory" className="space-y-4">
          <div className="space-y-3">
            {filteredInventory.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{item.item}</h4>
                        <Badge variant="outline">{item.category}</Badge>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Current Stock</p>
                          <p className="font-semibold">{item.currentStock.toLocaleString()} {item.unit}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Reorder Level</p>
                          <p className="font-semibold">{item.reorderLevel.toLocaleString()} {item.unit}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Capacity</p>
                          <p className="font-semibold">{item.maxCapacity.toLocaleString()} {item.unit}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Value</p>
                          <p className="font-semibold">{formatCurrency(item.value)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Company</p>
                          <p className="font-semibold text-xs">{item.company}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                          <span>Stock Level</span>
                          <span>{((item.currentStock / item.maxCapacity) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-muted/20 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              item.currentStock <= item.reorderLevel ? 'bg-warning' : 'bg-success'
                            }`}
                            style={{ width: `${(item.currentStock / item.maxCapacity) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Update Stock
                      </Button>
                      {item.status === 'Low Stock' && (
                        <Button size="sm">
                          Reorder
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="production" className="space-y-4">
          <div className="space-y-3">
            {filteredProduction.map((prod) => (
              <Card key={prod.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <h4 className="font-semibold">{prod.product}</h4>
                        <Badge variant="outline">{prod.company}</Badge>
                        <Badge className={getStatusColor(prod.status)}>
                          {prod.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Daily Progress</p>
                          <p className="font-semibold">{prod.dailyActual} / {prod.dailyTarget}</p>
                          <div className="w-full bg-muted/20 rounded-full h-2 mt-1">
                            <div 
                              className={`h-2 rounded-full ${
                                prod.dailyActual >= prod.dailyTarget ? 'bg-success' : 'bg-warning'
                              }`}
                              style={{ width: `${Math.min((prod.dailyActual / prod.dailyTarget) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Weekly Progress</p>
                          <p className="font-semibold">{prod.weeklyActual} / {prod.weeklyTarget}</p>
                          <div className="w-full bg-muted/20 rounded-full h-2 mt-1">
                            <div 
                              className={`h-2 rounded-full ${
                                prod.weeklyActual >= prod.weeklyTarget ? 'bg-success' : 'bg-warning'
                              }`}
                              style={{ width: `${Math.min((prod.weeklyActual / prod.weeklyTarget) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Efficiency</p>
                          <p className="font-semibold text-primary">{prod.efficiency}%</p>
                          <div className="w-full bg-muted/20 rounded-full h-2 mt-1">
                            <div 
                              className="h-2 rounded-full bg-primary"
                              style={{ width: `${prod.efficiency}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Quality</p>
                          <p className="font-semibold text-success">{prod.quality}%</p>
                          <div className="w-full bg-muted/20 rounded-full h-2 mt-1">
                            <div 
                              className="h-2 rounded-full bg-success"
                              style={{ width: `${prod.quality}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Monitor
                      </Button>
                      <Button size="sm" variant="outline">
                        Adjust
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Turnover</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center bg-muted/10 rounded-md">
                  <BarChart3 className="h-8 w-8 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Inventory Analytics</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Production Efficiency Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center bg-muted/10 rounded-md">
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Production Trends</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Key Performance Indicators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">Inventory Accuracy</p>
                  <p className="text-2xl font-bold text-primary">98.5%</p>
                </div>
                <div className="text-center p-4 bg-success/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">Production Uptime</p>
                  <p className="text-2xl font-bold text-success">96.2%</p>
                </div>
                <div className="text-center p-4 bg-accent/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">Quality Rate</p>
                  <p className="text-2xl font-bold text-accent">95.0%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="planning" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Production Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { time: '06:00 - 14:00', shift: 'Morning Shift', status: 'Active' },
                    { time: '14:00 - 22:00', shift: 'Afternoon Shift', status: 'Scheduled' },
                    { time: '22:00 - 06:00', shift: 'Night Shift', status: 'Scheduled' }
                  ].map((schedule, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">{schedule.shift}</p>
                        <p className="text-sm text-muted-foreground">{schedule.time}</p>
                      </div>
                      <Badge className={schedule.status === 'Active' ? 'bg-success' : 'bg-primary'}>
                        {schedule.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Resource Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Equipment Utilization</span>
                      <span>85%</span>
                    </div>
                    <div className="w-full bg-muted/20 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Workforce Capacity</span>
                      <span>92%</span>
                    </div>
                    <div className="w-full bg-muted/20 rounded-full h-2">
                      <div className="bg-success h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Raw Material Availability</span>
                      <span>78%</span>
                    </div>
                    <div className="w-full bg-muted/20 rounded-full h-2">
                      <div className="bg-warning h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryProduction;
