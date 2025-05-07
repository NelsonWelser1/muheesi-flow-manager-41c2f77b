
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ExportButtons from "@/components/ui/data-export/ExportButtons";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  AreaChart
} from 'recharts';
import { ChartBarIcon, GlobeIcon, CurrencyDollarIcon, TrendingUpIcon, ArrowRightIcon } from 'lucide-react';

const ExportAnalyticsTab = () => {
  const [timeRange, setTimeRange] = useState('year');
  const [analyticsView, setAnalyticsView] = useState('overview');

  // Monthly export volumes data
  const volumeData = [
    { month: 'Jan', arabica: 42000, robusta: 25000, total: 67000 },
    { month: 'Feb', arabica: 38000, robusta: 28000, total: 66000 },
    { month: 'Mar', arabica: 45000, robusta: 30000, total: 75000 },
    { month: 'Apr', arabica: 50000, robusta: 28000, total: 78000 },
    { month: 'May', arabica: 48000, robusta: 32000, total: 80000 },
    { month: 'Jun', arabica: 52000, robusta: 35000, total: 87000 },
    { month: 'Jul', arabica: 49000, robusta: 34000, total: 83000 },
    { month: 'Aug', arabica: 55000, robusta: 38000, total: 93000 },
    { month: 'Sep', arabica: 60000, robusta: 40000, total: 100000 },
    { month: 'Oct', arabica: 58000, robusta: 39000, total: 97000 },
    { month: 'Nov', arabica: 54000, robusta: 36000, total: 90000 },
    { month: 'Dec', arabica: 62000, robusta: 42000, total: 104000 }
  ];
  
  // Revenue data
  const revenueData = [
    { month: 'Jan', revenue: 380000, costs: 270000, profit: 110000 },
    { month: 'Feb', revenue: 360000, costs: 250000, profit: 110000 },
    { month: 'Mar', revenue: 420000, costs: 290000, profit: 130000 },
    { month: 'Apr', revenue: 455000, costs: 310000, profit: 145000 },
    { month: 'May', revenue: 480000, costs: 320000, profit: 160000 },
    { month: 'Jun', revenue: 520000, costs: 350000, profit: 170000 },
    { month: 'Jul', revenue: 495000, costs: 340000, profit: 155000 },
    { month: 'Aug', revenue: 550000, costs: 370000, profit: 180000 },
    { month: 'Sep', revenue: 620000, costs: 410000, profit: 210000 },
    { month: 'Oct', revenue: 590000, costs: 400000, profit: 190000 },
    { month: 'Nov', revenue: 530000, costs: 360000, profit: 170000 },
    { month: 'Dec', revenue: 650000, costs: 430000, profit: 220000 }
  ];
  
  // Market data
  const marketData = [
    { name: 'Europe', value: 40 },
    { name: 'North America', value: 30 },
    { name: 'Asia', value: 20 },
    { name: 'Middle East', value: 7 },
    { name: 'Others', value: 3 },
  ];

  // Price trends data
  const priceTrendsData = [
    { month: 'Jan', arabica: 7.2, robusta: 4.8 },
    { month: 'Feb', arabica: 7.4, robusta: 4.9 },
    { month: 'Mar', arabica: 7.3, robusta: 5.0 },
    { month: 'Apr', arabica: 7.5, robusta: 5.1 },
    { month: 'May', arabica: 7.8, robusta: 5.2 },
    { month: 'Jun', arabica: 8.0, robusta: 5.3 },
    { month: 'Jul', arabica: 8.1, robusta: 5.4 },
    { month: 'Aug', arabica: 8.3, robusta: 5.5 },
    { month: 'Sep', arabica: 8.5, robusta: 5.6 },
    { month: 'Oct', arabica: 8.4, robusta: 5.5 },
    { month: 'Nov', arabica: 8.6, robusta: 5.7 },
    { month: 'Dec', arabica: 8.8, robusta: 5.8 }
  ];
  
  // Client performance data
  const clientPerformanceData = [
    { name: 'Equata Coffee Co.', orders: 24, volume: 240000, value: 1920000 },
    { name: 'Nordic Bean Imports', orders: 18, volume: 180000, value: 1440000 },
    { name: 'Golden Bean Trading', orders: 12, volume: 160000, value: 1280000 },
    { name: 'Aroma Imports LLC', orders: 8, volume: 100000, value: 800000 },
    { name: 'Coffee Masters GmbH', orders: 6, volume: 90000, value: 720000 },
  ];
  
  // Quality distribution data
  const qualityDistributionData = [
    { name: 'Grade AA', value: 45 },
    { name: 'Grade AB', value: 30 },
    { name: 'Grade PB', value: 15 },
    { name: 'Grade C', value: 10 }
  ];

  // Forecast data
  const forecastData = [
    { month: 'Jan', actual: 67000, forecast: 67000 },
    { month: 'Feb', actual: 66000, forecast: 66000 },
    { month: 'Mar', actual: 75000, forecast: 75000 },
    { month: 'Apr', actual: 78000, forecast: 78000 },
    { month: 'May', actual: 80000, forecast: 80000 },
    { month: 'Jun', actual: 87000, forecast: 87000 },
    { month: 'Jul', actual: 83000, forecast: 83000 },
    { month: 'Aug', actual: 93000, forecast: 93000 },
    { month: 'Sep', actual: 100000, forecast: 100000 },
    { month: 'Oct', actual: 97000, forecast: 97000 },
    { month: 'Nov', actual: 90000, forecast: 90000 },
    { month: 'Dec', actual: 104000, forecast: 104000 },
    { month: 'Jan (Next)', actual: null, forecast: 110000 },
    { month: 'Feb (Next)', actual: null, forecast: 115000 },
    { month: 'Mar (Next)', actual: null, forecast: 120000 }
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  const handleTimeRangeChange = (value) => {
    setTimeRange(value);
  };
  
  const handleExportData = (data, type) => {
    console.log(`Exporting ${type} data`);
    // In a real implementation, this would call the export functionality
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-semibold">Export Analytics</h2>
        
        <div className="flex items-center space-x-3">
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          
          <ExportButtons 
            data={analyticsView === 'overview' ? volumeData : 
                  analyticsView === 'financial' ? revenueData :
                  analyticsView === 'markets' ? marketData : 
                  analyticsView === 'prices' ? priceTrendsData : volumeData}
            filename={`coffee-export-analytics-${analyticsView}`}
            type="Export Analytics"
          />
        </div>
      </div>
      
      <Tabs value={analyticsView} onValueChange={setAnalyticsView}>
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 h-auto bg-muted/50 p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white">
            Overview
          </TabsTrigger>
          <TabsTrigger value="financial" className="data-[state=active]:bg-white">
            Financial
          </TabsTrigger>
          <TabsTrigger value="markets" className="data-[state=active]:bg-white">
            Markets
          </TabsTrigger>
          <TabsTrigger value="prices" className="data-[state=active]:bg-white">
            Price Trends
          </TabsTrigger>
          <TabsTrigger value="forecast" className="data-[state=active]:bg-white">
            Forecast
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-blue-50 border-0">
              <CardContent className="pt-6">
                <div className="flex flex-col">
                  <span className="text-sm text-blue-800 font-medium">Total Export Volume</span>
                  <span className="text-3xl font-bold text-blue-900">1,020 MT</span>
                  <span className="text-xs text-blue-700">+8.5% vs previous year</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-0">
              <CardContent className="pt-6">
                <div className="flex flex-col">
                  <span className="text-sm text-green-800 font-medium">Revenue Generated</span>
                  <span className="text-3xl font-bold text-green-900">$6.05M</span>
                  <span className="text-xs text-green-700">+12.3% vs previous year</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-amber-50 border-0">
              <CardContent className="pt-6">
                <div className="flex flex-col">
                  <span className="text-sm text-amber-800 font-medium">Average Price</span>
                  <span className="text-3xl font-bold text-amber-900">$5.93/kg</span>
                  <span className="text-xs text-amber-700">+3.8% vs previous year</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50 border-0">
              <CardContent className="pt-6">
                <div className="flex flex-col">
                  <span className="text-sm text-purple-800 font-medium">Export Countries</span>
                  <span className="text-3xl font-bold text-purple-900">14</span>
                  <span className="text-xs text-purple-700">+2 new markets this year</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Monthly Export Volumes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={volumeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${value.toLocaleString()} kg`, undefined]}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Legend />
                    <Bar dataKey="arabica" name="Arabica" stackId="a" fill="#8884d8" />
                    <Bar dataKey="robusta" name="Robusta" stackId="a" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Export Destinations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={marketData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {marketData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Coffee Quality Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={qualityDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {qualityDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue & Profit Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`$${value.toLocaleString()}`, undefined]}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="costs" name="Costs" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="profit" name="Profit" stroke="#ffc658" fill="#ffc658" fillOpacity={0.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Client Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="text-left p-4 font-medium">Client</th>
                      <th className="text-left p-4 font-medium">Orders</th>
                      <th className="text-left p-4 font-medium">Volume (kg)</th>
                      <th className="text-left p-4 font-medium">Value (USD)</th>
                      <th className="text-left p-4 font-medium">Avg. Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientPerformanceData.map((client) => (
                      <tr key={client.name} className="border-b hover:bg-muted/30">
                        <td className="p-4 font-medium">{client.name}</td>
                        <td className="p-4">{client.orders}</td>
                        <td className="p-4">{client.volume.toLocaleString()}</td>
                        <td className="p-4">${client.value.toLocaleString()}</td>
                        <td className="p-4">${(client.value / client.volume).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-green-50 border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-green-900">Profitability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-800">32.4%</div>
                <p className="text-sm text-green-700">Average margin on coffee exports</p>
              </CardContent>
            </Card>
            
            <Card className="bg-blue-50 border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-blue-900">Return on Investment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-800">27.5%</div>
                <p className="text-sm text-blue-700">Annual ROI on export operations</p>
              </CardContent>
            </Card>
            
            <Card className="bg-amber-50 border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-amber-900">Cost Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-amber-800">Sourcing: 68%</div>
                    <div className="text-sm font-medium text-amber-800">Logistics: 22%</div>
                    <div className="text-sm font-medium text-amber-800">Operations: 10%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Markets Tab */}
        <TabsContent value="markets" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Export Market Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={marketData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {marketData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Market Growth Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Europe</span>
                      <span className="font-medium">+4.2%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '42%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>North America</span>
                      <span className="font-medium">+6.8%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Asia</span>
                      <span className="font-medium">+12.5%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-amber-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Middle East</span>
                      <span className="font-medium">+9.3%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '74%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Others</span>
                      <span className="font-medium">+3.1%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gray-600 h-2 rounded-full" style={{ width: '31%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Market Opportunity Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border rounded-lg p-4 bg-blue-50">
                  <h3 className="font-semibold text-lg text-blue-900 mb-2">Emerging Markets</h3>
                  <ul className="space-y-2 text-blue-800">
                    <li className="flex items-center">
                      <ArrowRightIcon className="h-4 w-4 mr-2" />
                      <span>South Korea: High specialty demand</span>
                    </li>
                    <li className="flex items-center">
                      <ArrowRightIcon className="h-4 w-4 mr-2" />
                      <span>UAE: Growing premium coffee culture</span>
                    </li>
                    <li className="flex items-center">
                      <ArrowRightIcon className="h-4 w-4 mr-2" />
                      <span>Australia: Growing specialty sector</span>
                    </li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4 bg-green-50">
                  <h3 className="font-semibold text-lg text-green-900 mb-2">Market Preferences</h3>
                  <ul className="space-y-2 text-green-800">
                    <li className="flex items-center">
                      <ArrowRightIcon className="h-4 w-4 mr-2" />
                      <span>Europe: Certified sustainable coffee</span>
                    </li>
                    <li className="flex items-center">
                      <ArrowRightIcon className="h-4 w-4 mr-2" />
                      <span>North America: Single-origin specialty</span>
                    </li>
                    <li className="flex items-center">
                      <ArrowRightIcon className="h-4 w-4 mr-2" />
                      <span>Asia: Medium roast, balanced profile</span>
                    </li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4 bg-amber-50">
                  <h3 className="font-semibold text-lg text-amber-900 mb-2">Market Challenges</h3>
                  <ul className="space-y-2 text-amber-800">
                    <li className="flex items-center">
                      <ArrowRightIcon className="h-4 w-4 mr-2" />
                      <span>Increased competition in EU market</span>
                    </li>
                    <li className="flex items-center">
                      <ArrowRightIcon className="h-4 w-4 mr-2" />
                      <span>Rising logistics costs to Asia</span>
                    </li>
                    <li className="flex items-center">
                      <ArrowRightIcon className="h-4 w-4 mr-2" />
                      <span>New coffee import regulations in US</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Price Trends Tab */}
        <TabsContent value="prices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Coffee Price Trends (USD/kg)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceTrendsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                    <Tooltip 
                      formatter={(value) => [`$${value}/kg`, undefined]}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="arabica"
                      name="Arabica"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="robusta"
                      name="Robusta"
                      stroke="#82ca9d"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-purple-50 border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-purple-900">Price Premium Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-xl font-bold text-purple-800">+15%</div>
                    <p className="text-sm text-purple-700">Quality premium over market</p>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-purple-800">+8%</div>
                    <p className="text-sm text-purple-700">Certification premium</p>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-purple-800">+5%</div>
                    <p className="text-sm text-purple-700">Origin reputation premium</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-blue-50 border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-blue-900">Market Indicators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-xl font-bold text-blue-800">$4.35/lb</div>
                    <p className="text-sm text-blue-700">ICO Composite Price</p>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-blue-800">$5.20/lb</div>
                    <p className="text-sm text-blue-700">Arabica Futures (Dec)</p>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-blue-800">$3.85/lb</div>
                    <p className="text-sm text-blue-700">Robusta Futures (Dec)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-amber-50 border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-amber-900">Price Forecasts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-xl font-bold text-amber-800">+4-6%</div>
                    <p className="text-sm text-amber-700">Expected Q1 price change</p>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-amber-800">+2-3%</div>
                    <p className="text-sm text-amber-700">Expected Q2 price change</p>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-amber-800">Moderate</div>
                    <p className="text-sm text-amber-700">Market volatility forecast</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Forecast Tab */}
        <TabsContent value="forecast" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Export Volume Forecast (kg)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={forecastData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={['dataMin - 10000', 'dataMax + 10000']} />
                    <Tooltip 
                      formatter={(value) => [value ? `${value.toLocaleString()} kg` : 'N/A', undefined]}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      name="Actual Volume"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="forecast"
                      name="Forecast Volume"
                      stroke="#82ca9d"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Growth Drivers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <TrendingUpIcon className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                      <h4 className="font-medium">Specialty Market Expansion</h4>
                      <p className="text-sm text-muted-foreground">Growing demand for high-quality specialty coffees in Europe and North America</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <GlobeIcon className="h-5 w-5 text-green-700" />
                    </div>
                    <div>
                      <h4 className="font-medium">New Market Entry</h4>
                      <p className="text-sm text-muted-foreground">Expanding into South Korean and Australian markets</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-amber-100 p-2 rounded-full mr-3">
                      <ChartBarIcon className="h-5 w-5 text-amber-700" />
                    </div>
                    <div>
                      <h4 className="font-medium">Production Capacity</h4>
                      <p className="text-sm text-muted-foreground">15% increase in processing capacity at Kakyinga Factory</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Potential Challenges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-red-100 p-2 rounded-full mr-3">
                      <TrendingUpIcon className="h-5 w-5 text-red-700" />
                    </div>
                    <div>
                      <h4 className="font-medium">Weather Risks</h4>
                      <p className="text-sm text-muted-foreground">Potential drought conditions could impact crop yields in Q2</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-red-100 p-2 rounded-full mr-3">
                      <CurrencyDollarIcon className="h-5 w-5 text-red-700" />
                    </div>
                    <div>
                      <h4 className="font-medium">Currency Volatility</h4>
                      <p className="text-sm text-muted-foreground">Fluctuations in USD/UGX exchange rates affecting revenues</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-red-100 p-2 rounded-full mr-3">
                      <GlobeIcon className="h-5 w-5 text-red-700" />
                    </div>
                    <div>
                      <h4 className="font-medium">Logistics Disruptions</h4>
                      <p className="text-sm text-muted-foreground">Shipping delays and increased container costs</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Strategic Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-purple-100 p-2 rounded-full mr-3">
                      <ChartBarIcon className="h-5 w-5 text-purple-700" />
                    </div>
                    <div>
                      <h4 className="font-medium">Diversify Coffee Products</h4>
                      <p className="text-sm text-muted-foreground">Expand specialty and microlot offerings</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-purple-100 p-2 rounded-full mr-3">
                      <GlobeIcon className="h-5 w-5 text-purple-700" />
                    </div>
                    <div>
                      <h4 className="font-medium">Enter East Asian Markets</h4>
                      <p className="text-sm text-muted-foreground">Focus on South Korea and Japan expansion</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-purple-100 p-2 rounded-full mr-3">
                      <CurrencyDollarIcon className="h-5 w-5 text-purple-700" />
                    </div>
                    <div>
                      <h4 className="font-medium">Forward Contracts</h4>
                      <p className="text-sm text-muted-foreground">Increase long-term contract ratio to 65%</p>
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

export default ExportAnalyticsTab;
