
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { showInfoToast } from "@/components/ui/notifications";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import StockTable from './stock-visualization/StockTable';
import StockCards from './stock-visualization/StockCards';
import StockMap from './stock-visualization/StockMap';
import StockFilters from './stock-visualization/StockFilters';
import StockTrends from './stock-visualization/StockTrends';
import StockInsights from './stock-visualization/StockInsights';
import StockActions from './stock-visualization/StockActions';
import { useCoffeeInventory } from '@/integrations/supabase/hooks/useInventoryData';
import { Search, Filter, Download, Calendar, TrendingUp, TrendingDown, AlertCircle, Eye, List, LayoutGrid, Map, BarChart3, Sliders } from 'lucide-react';

// Mock data for demonstration
const mockStockData = [
  { id: 1, name: 'Arabica Coffee Beans', type: 'Arabica', grade: 'A', location: 'Kampala Warehouse', current_stock: 250, max_capacity: 400, updated_at: '2024-05-01', trend: 'up', health: 'good' },
  { id: 2, name: 'Robusta Coffee Beans', type: 'Robusta', grade: 'B', location: 'Mbarara Facility', current_stock: 120, max_capacity: 250, updated_at: '2024-05-02', trend: 'down', health: 'warning' },
  { id: 3, name: 'Green Coffee Beans', type: 'Arabica', grade: 'A+', location: 'Kampala Warehouse', current_stock: 80, max_capacity: 300, updated_at: '2024-05-03', trend: 'stable', health: 'critical' },
  { id: 4, name: 'Roasted Coffee Beans', type: 'Mixed', grade: 'A', location: 'Jinja Storage', current_stock: 175, max_capacity: 200, updated_at: '2024-05-01', trend: 'up', health: 'good' },
  { id: 5, name: 'Ground Coffee', type: 'Arabica', grade: 'B+', location: 'Entebbe Facility', current_stock: 90, max_capacity: 150, updated_at: '2024-04-28', trend: 'down', health: 'warning' },
  { id: 6, name: 'Coffee Powder', type: 'Robusta', grade: 'B', location: 'Mbarara Facility', current_stock: 30, max_capacity: 100, updated_at: '2024-04-30', trend: 'down', health: 'critical' },
];

const locationData = [
  { name: 'Kampala Warehouse', stockLevel: 330, maxCapacity: 700 },
  { name: 'Mbarara Facility', stockLevel: 150, maxCapacity: 350 },
  { name: 'Jinja Storage', stockLevel: 175, maxCapacity: 200 },
  { name: 'Entebbe Facility', stockLevel: 90, maxCapacity: 150 },
];

const historicalData = [
  { month: 'Jan', arabica: 200, robusta: 150 },
  { month: 'Feb', arabica: 220, robusta: 160 },
  { month: 'Mar', arabica: 250, robusta: 180 },
  { month: 'Apr', arabica: 280, robusta: 170 },
  { month: 'May', arabica: 330, robusta: 150 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ViewStockDashboard = ({ isKazo }) => {
  const [activeView, setActiveView] = useState('cards');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [stockData, setStockData] = useState(mockStockData);
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const { toast } = useToast();
  const { data: coffeeStock, isLoading } = useCoffeeInventory();

  useEffect(() => {
    // In a real app, this would use the actual coffeeStock data from the hook
    // For now, we'll just use the mock data
    setStockData(mockStockData);
  }, [coffeeStock]);

  const filteredStock = stockData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || item.type.toLowerCase() === filterType.toLowerCase();
    const matchesLocation = filterLocation === 'all' || item.location === filterLocation;
    
    return matchesSearch && matchesType && matchesLocation;
  });

  const stockByType = [
    { name: 'Arabica', value: stockData.filter(i => i.type === 'Arabica').reduce((acc, curr) => acc + curr.current_stock, 0) },
    { name: 'Robusta', value: stockData.filter(i => i.type === 'Robusta').reduce((acc, curr) => acc + curr.current_stock, 0) },
    { name: 'Mixed', value: stockData.filter(i => i.type === 'Mixed').reduce((acc, curr) => acc + curr.current_stock, 0) },
  ];

  const handleExportData = (format) => {
    showInfoToast(toast, `Exporting data as ${format}...`);
    // In a real app, this would trigger an actual export
  };

  const handleQuickFilter = (filter) => {
    if (filter === 'low') {
      const lowStock = stockData.filter(item => (item.current_stock / item.max_capacity) < 0.3);
      setStockData(lowStock);
    } else if (filter === 'critical') {
      const criticalStock = stockData.filter(item => item.health === 'critical');
      setStockData(criticalStock);
    } else {
      setStockData(mockStockData);
    }
  };

  if (isLoading) {
    return <div>Loading stock data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            Stock Dashboard {isKazo ? '- Kazo Coffee Development Project' : '- KAJON Coffee Limited'}
          </h2>
          <p className="text-muted-foreground">Interactive visualization of current inventory levels</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={() => handleQuickFilter('low')}
          >
            <AlertCircle className="h-4 w-4 text-amber-500" />
            Low Stock
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={() => handleQuickFilter('critical')}
          >
            <AlertCircle className="h-4 w-4 text-red-500" />
            Critical Stock
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={() => handleQuickFilter('all')}
          >
            <Eye className="h-4 w-4" />
            All Stock
          </Button>
          
          <Select onValueChange={(value) => handleExportData(value)} defaultValue="export">
            <SelectTrigger className="w-[140px]">
              <Download className="h-4 w-4 mr-2" />
              <span>Export</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="export" disabled>Export As...</SelectItem>
              <SelectItem value="pdf">PDF Report</SelectItem>
              <SelectItem value="csv">CSV Spreadsheet</SelectItem>
              <SelectItem value="excel">Excel Workbook</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-2/3">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Stock Visualization</CardTitle>
                <div className="flex space-x-1">
                  <Button 
                    variant={activeView === 'cards' ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => setActiveView('cards')}
                    className="h-8 w-8 p-0"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={activeView === 'table' ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => setActiveView('table')}
                    className="h-8 w-8 p-0"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={activeView === 'map' ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => setActiveView('map')}
                    className="h-8 w-8 p-0"
                  >
                    <Map className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={activeView === 'charts' ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => setActiveView('charts')}
                    className="h-8 w-8 p-0"
                  >
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-col sm:flex-row gap-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, type, or location..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select onValueChange={setFilterType} defaultValue="all">
                    <SelectTrigger className="w-[130px]">
                      <span>Coffee Type</span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="arabica">Arabica</SelectItem>
                      <SelectItem value="robusta">Robusta</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select onValueChange={setFilterLocation} defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <span>Location</span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="Kampala Warehouse">Kampala</SelectItem>
                      <SelectItem value="Mbarara Facility">Mbarara</SelectItem>
                      <SelectItem value="Jinja Storage">Jinja</SelectItem>
                      <SelectItem value="Entebbe Facility">Entebbe</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" size="icon">
                    <Sliders className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {activeView === 'cards' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredStock.map(item => (
                    <Card key={item.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">{item.type} - Grade {item.grade}</p>
                          </div>
                          <Badge 
                            className={
                              item.health === 'good' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 
                              item.health === 'warning' ? 'bg-amber-100 text-amber-800 hover:bg-amber-100' : 
                              'bg-red-100 text-red-800 hover:bg-red-100'
                            }
                          >
                            {item.health === 'good' ? 'Healthy' : item.health === 'warning' ? 'Low' : 'Critical'}
                          </Badge>
                        </div>
                        
                        <div className="mt-2">
                          <div className="flex justify-between items-center text-sm">
                            <span>Stock Level:</span>
                            <span className="font-medium">
                              {item.current_stock} / {item.max_capacity}
                              {item.trend === 'up' ? 
                                <TrendingUp className="h-3 w-3 inline ml-1 text-green-600" /> : 
                                item.trend === 'down' ? 
                                <TrendingDown className="h-3 w-3 inline ml-1 text-red-600" /> : 
                                null
                              }
                            </span>
                          </div>
                          <Progress 
                            value={(item.current_stock / item.max_capacity) * 100} 
                            className={`h-2 mt-1 ${
                              (item.current_stock / item.max_capacity) < 0.3 ? 'bg-red-200' : 
                              (item.current_stock / item.max_capacity) < 0.6 ? 'bg-amber-200' : 
                              'bg-green-200'
                            }`}
                          />
                        </div>
                        
                        <div className="mt-3 text-sm">
                          <p>Location: {item.location}</p>
                          <p>Last Updated: {new Date(item.updated_at).toLocaleDateString()}</p>
                        </div>
                        
                        <div className="mt-3 flex gap-2">
                          <Button variant="outline" size="sm" className="text-xs h-7">View Details</Button>
                          <Button variant="outline" size="sm" className="text-xs h-7">Actions</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              
              {activeView === 'table' && (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3 font-medium">Name</th>
                        <th className="text-left py-2 px-3 font-medium">Type</th>
                        <th className="text-left py-2 px-3 font-medium">Grade</th>
                        <th className="text-left py-2 px-3 font-medium">Location</th>
                        <th className="text-left py-2 px-3 font-medium">Stock</th>
                        <th className="text-left py-2 px-3 font-medium">Status</th>
                        <th className="text-left py-2 px-3 font-medium">Last Updated</th>
                        <th className="text-left py-2 px-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStock.map(item => (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-3">{item.name}</td>
                          <td className="py-2 px-3">{item.type}</td>
                          <td className="py-2 px-3">{item.grade}</td>
                          <td className="py-2 px-3">{item.location}</td>
                          <td className="py-2 px-3">
                            <div className="flex items-center gap-1">
                              <span>{item.current_stock}/{item.max_capacity}</span>
                              {item.trend === 'up' ? 
                                <TrendingUp className="h-3 w-3 text-green-600" /> : 
                                item.trend === 'down' ? 
                                <TrendingDown className="h-3 w-3 text-red-600" /> : 
                                null
                              }
                            </div>
                          </td>
                          <td className="py-2 px-3">
                            <Badge 
                              className={
                                item.health === 'good' ? 'bg-green-100 text-green-800' : 
                                item.health === 'warning' ? 'bg-amber-100 text-amber-800' : 
                                'bg-red-100 text-red-800'
                              }
                            >
                              {item.health === 'good' ? 'Healthy' : item.health === 'warning' ? 'Low' : 'Critical'}
                            </Badge>
                          </td>
                          <td className="py-2 px-3">{new Date(item.updated_at).toLocaleDateString()}</td>
                          <td className="py-2 px-3">
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {activeView === 'map' && (
                <div className="h-96 bg-gray-100 rounded-lg p-4">
                  <h3 className="font-medium mb-3">Stock by Location</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {locationData.map((location, index) => (
                      <Card key={index} className="shadow-sm">
                        <CardContent className="p-4">
                          <h4 className="font-medium">{location.name}</h4>
                          <div className="mt-2">
                            <div className="flex justify-between items-center text-sm">
                              <span>Utilization:</span>
                              <span className="font-medium">
                                {location.stockLevel} / {location.maxCapacity}
                              </span>
                            </div>
                            <Progress 
                              value={(location.stockLevel / location.maxCapacity) * 100} 
                              className={`h-2 mt-1 ${
                                (location.stockLevel / location.maxCapacity) < 0.3 ? 'bg-red-200' : 
                                (location.stockLevel / location.maxCapacity) < 0.6 ? 'bg-amber-200' : 
                                'bg-green-200'
                              }`}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    <div className="col-span-2 text-center text-sm text-muted-foreground">
                      Interactive map visualization coming soon
                    </div>
                  </div>
                </div>
              )}
              
              {activeView === 'charts' && (
                <Tabs defaultValue="distribution">
                  <TabsList className="mb-4">
                    <TabsTrigger value="distribution">Stock Distribution</TabsTrigger>
                    <TabsTrigger value="location">By Location</TabsTrigger>
                    <TabsTrigger value="trends">Historical Trends</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="distribution" className="mt-0">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={stockByType}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {stockByType.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                      {stockByType.map((type, index) => (
                        <div key={index} className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          ></div>
                          <span className="text-sm">{type.name}: {type.value} units</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="location" className="mt-0">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={locationData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="stockLevel" fill="#8884d8" name="Current Stock" />
                          <Bar dataKey="maxCapacity" fill="#82ca9d" name="Maximum Capacity" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="trends" className="mt-0">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={historicalData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="arabica" stroke="#8884d8" name="Arabica" />
                          <Line type="monotone" dataKey="robusta" stroke="#82ca9d" name="Robusta" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full md:w-1/3 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Total Stock</h4>
                  <div className="text-2xl font-bold">
                    {stockData.reduce((acc, item) => acc + item.current_stock, 0)} units
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {Math.round(stockData.reduce((acc, item) => acc + item.current_stock, 0) / 
                    stockData.reduce((acc, item) => acc + item.max_capacity, 0) * 100)}% of capacity
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Stock Health</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-green-50 p-2 rounded-lg text-center">
                      <div className="text-lg font-medium text-green-700">
                        {stockData.filter(i => i.health === 'good').length}
                      </div>
                      <div className="text-xs text-green-600">Healthy</div>
                    </div>
                    <div className="bg-amber-50 p-2 rounded-lg text-center">
                      <div className="text-lg font-medium text-amber-700">
                        {stockData.filter(i => i.health === 'warning').length}
                      </div>
                      <div className="text-xs text-amber-600">Low</div>
                    </div>
                    <div className="bg-red-50 p-2 rounded-lg text-center">
                      <div className="text-lg font-medium text-red-700">
                        {stockData.filter(i => i.health === 'critical').length}
                      </div>
                      <div className="text-xs text-red-600">Critical</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Quick Actions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="w-full text-sm h-9">Generate Report</Button>
                    <Button variant="outline" className="w-full text-sm h-9">Reorder Stock</Button>
                    <Button variant="outline" className="w-full text-sm h-9">Transfer Stock</Button>
                    <Button variant="outline" className="w-full text-sm h-9">Stock Alerts</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <h4 className="text-sm font-medium text-blue-700 mb-1">Stock Prediction</h4>
                  <p className="text-xs text-blue-600">
                    Arabica coffee stock is trending up by 10% this month compared to last month.
                  </p>
                </div>
                
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <h4 className="text-sm font-medium text-amber-700 mb-1">Low Stock Alert</h4>
                  <p className="text-xs text-amber-600">
                    Robusta coffee beans at Mbarara Facility will reach critical levels in approximately 2 weeks.
                  </p>
                </div>
                
                <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                  <h4 className="text-sm font-medium text-green-700 mb-1">Recommendation</h4>
                  <p className="text-xs text-green-600">
                    Consider transferring excess Ground Coffee from Kampala to Mbarara to optimize distribution.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                  <div>
                    <p className="text-sm">Received 50 bags of Arabica Coffee</p>
                    <p className="text-xs text-muted-foreground">Today, 10:25 AM</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-2"></div>
                  <div>
                    <p className="text-sm">Transferred 20 bags to Jinja Storage</p>
                    <p className="text-xs text-muted-foreground">Yesterday, 2:30 PM</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
                  <div>
                    <p className="text-sm">30 bags shipped to buyer in Nairobi</p>
                    <p className="text-xs text-muted-foreground">May 10, 2024, 11:15 AM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewStockDashboard;
