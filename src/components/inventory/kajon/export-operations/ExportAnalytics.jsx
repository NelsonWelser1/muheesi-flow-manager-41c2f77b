
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, AreaChart, PieChart, AreaChart as AreaChartIcon } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

// Sample data for charts
const monthlyExportData = [
  { month: 'Jan', volume: 25, value: 112500 },
  { month: 'Feb', volume: 30, value: 135000 },
  { month: 'Mar', volume: 35, value: 157500 },
  { month: 'Apr', volume: 40, value: 180000 },
  { month: 'May', volume: 45, value: 202500 },
  { month: 'Jun', volume: 50, value: 225000 },
  { month: 'Jul', volume: 45, value: 202500 },
  { month: 'Aug', volume: 40, value: 180000 },
  { month: 'Sep', volume: 35, value: 157500 },
  { month: 'Oct', volume: 30, value: 135000 },
  { month: 'Nov', volume: 25, value: 112500 },
  { month: 'Dec', volume: 20, value: 90000 }
];

const destinationData = [
  { name: 'European Union', value: 45 },
  { name: 'North America', value: 25 },
  { name: 'Asia', value: 15 },
  { name: 'Middle East', value: 10 },
  { name: 'Others', value: 5 }
];

const productTypeData = [
  { name: 'Robusta Grade 1', value: 35 },
  { name: 'Arabica AA', value: 25 },
  { name: 'Robusta Grade 2', value: 20 },
  { name: 'Arabica A', value: 15 },
  { name: 'Specialty Coffee', value: 5 }
];

const priceData = [
  { month: 'Jan', arabica: 4.6, robusta: 2.8 },
  { month: 'Feb', arabica: 4.7, robusta: 2.9 },
  { month: 'Mar', arabica: 4.9, robusta: 3.0 },
  { month: 'Apr', arabica: 5.2, robusta: 3.2 },
  { month: 'May', arabica: 5.4, robusta: 3.3 },
  { month: 'Jun', arabica: 5.3, robusta: 3.2 },
  { month: 'Jul', arabica: 5.1, robusta: 3.1 },
  { month: 'Aug', arabica: 4.9, robusta: 3.0 },
  { month: 'Sep', arabica: 4.8, robusta: 2.9 },
  { month: 'Oct', arabica: 4.7, robusta: 2.8 },
  { month: 'Nov', arabica: 4.6, robusta: 2.7 },
  { month: 'Dec', arabica: 4.5, robusta: 2.6 }
];

// Colors for pie charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ExportAnalytics = () => {
  const [timeframe, setTimeframe] = React.useState("yearly");
  const [chartTab, setChartTab] = React.useState("exports");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <BarChart className="mr-2 h-6 w-6" />
            Export Business Analytics
          </h2>
          <p className="text-muted-foreground mt-1">
            Comprehensive insights into your coffee export business
          </p>
        </div>
        <div className="flex gap-3">
          <Select 
            value={timeframe}
            onValueChange={setTimeframe}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Export Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">420 MT</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">↑ 12%</span> from previous year
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Export Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1.89M</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">↑ 8%</span> from previous year
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4.50/kg</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500">↓ 2%</span> from previous year
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Markets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">↑ 2</span> from previous year
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={chartTab} onValueChange={setChartTab}>
        <TabsList className="grid grid-cols-1 md:grid-cols-4 w-full">
          <TabsTrigger value="exports" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span>Export Volume & Value</span>
          </TabsTrigger>
          <TabsTrigger value="markets" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            <span>Market Distribution</span>
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            <span>Product Types</span>
          </TabsTrigger>
          <TabsTrigger value="prices" className="flex items-center gap-2">
            <AreaChartIcon className="h-4 w-4" />
            <span>Price Trends</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="exports" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Export Volume & Value</CardTitle>
              <CardDescription>Export performance over the past 12 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyExportData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="volume" name="Volume (MT)" fill="#8884d8" />
                    <Bar yAxisId="right" dataKey="value" name="Value ($)" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="markets" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Export Destinations</CardTitle>
                <CardDescription>Distribution by region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={destinationData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {destinationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Market Growth</CardTitle>
                <CardDescription>Year-over-year change by market</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { region: 'European Union', change: '+15%', volume: '189 MT' },
                    { region: 'North America', change: '+8%', volume: '105 MT' },
                    { region: 'Asia', change: '+22%', volume: '63 MT' },
                    { region: 'Middle East', change: '+5%', volume: '42 MT' },
                    { region: 'Others', change: '-2%', volume: '21 MT' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{item.region}</p>
                        <p className="text-sm text-muted-foreground">Volume: {item.volume}</p>
                      </div>
                      <span className={item.change.startsWith('+') ? 'text-green-500 font-medium' : 'text-red-500 font-medium'}>
                        {item.change}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="products" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Type Distribution</CardTitle>
                <CardDescription>Percentage by coffee type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={productTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {productTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Quality Premium</CardTitle>
                <CardDescription>Price premium by coffee grade</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { grade: 'Specialty Grade', premium: '+45%', price: '$6.30/kg' },
                    { grade: 'Arabica AA', premium: '+35%', price: '$5.80/kg' },
                    { grade: 'Arabica A', premium: '+20%', price: '$5.10/kg' },
                    { grade: 'Robusta Grade 1', premium: '+10%', price: '$3.30/kg' },
                    { grade: 'Robusta Grade 2', premium: '0%', price: '$3.00/kg' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{item.grade}</p>
                        <p className="text-sm text-muted-foreground">Avg. Price: {item.price}</p>
                      </div>
                      <span className="text-green-500 font-medium">
                        {item.premium}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="prices" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Coffee Price Trends</CardTitle>
              <CardDescription>Average export price by coffee type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={priceData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="arabica" name="Arabica ($/kg)" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="robusta" name="Robusta ($/kg)" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Price Factors</CardTitle>
                <CardDescription>Key factors affecting coffee prices</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center justify-between">
                    <span>Global Supply</span>
                    <span className="text-red-500 font-medium">↓ Decreasing</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Global Demand</span>
                    <span className="text-green-500 font-medium">↑ Increasing</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Weather Conditions</span>
                    <span className="text-amber-500 font-medium">⚠ Variable</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Currency Exchange</span>
                    <span className="text-amber-500 font-medium">⚠ Volatile</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Specialty Market</span>
                    <span className="text-green-500 font-medium">↑ Growing</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Price Forecast</CardTitle>
                <CardDescription>6-month export price outlook</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Arabica</span>
                    <span className="text-green-500 font-medium">↑ Expected to rise 3-5%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Lower production in Brazil and Colombia, increased specialty demand
                  </p>
                  
                  <div className="flex items-center justify-between mt-4">
                    <span className="font-medium">Robusta</span>
                    <span className="text-green-500 font-medium">↑ Expected to rise 1-3%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Stable demand from instant coffee sector, moderate supply
                  </p>
                  
                  <div className="border-t pt-4 mt-4">
                    <p className="font-medium">Recommendation:</p>
                    <p className="text-sm text-muted-foreground">
                      Focus on securing long-term contracts at current prices with gradual increases.
                      Consider diversifying into specialty markets for higher margins.
                    </p>
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

export default ExportAnalytics;
