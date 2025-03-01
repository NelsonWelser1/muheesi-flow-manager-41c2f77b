
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

// Sample data - in a real app, this would come from your backend
const salesData = [
  { month: 'Jan', sales: 4000, target: 4500, lastYear: 3800 },
  { month: 'Feb', sales: 3000, target: 3500, lastYear: 2800 },
  { month: 'Mar', sales: 2000, target: 2000, lastYear: 1800 },
  { month: 'Apr', sales: 2780, target: 2500, lastYear: 2600 },
  { month: 'May', sales: 1890, target: 2000, lastYear: 1700 },
  { month: 'Jun', sales: 2390, target: 2200, lastYear: 2100 },
  { month: 'Jul', sales: 3490, target: 3000, lastYear: 3200 },
  { month: 'Aug', sales: 4000, target: 3800, lastYear: 3700 },
  { month: 'Sep', sales: 4500, target: 4000, lastYear: 4100 },
  { month: 'Oct', sales: 5000, target: 4500, lastYear: 4300 },
  { month: 'Nov', sales: 4700, target: 4700, lastYear: 4200 },
  { month: 'Dec', sales: 5200, target: 5000, lastYear: 4600 },
];

const customerSegments = [
  { name: 'Retailers', value: 45 },
  { name: 'Wholesalers', value: 30 },
  { name: 'Direct Consumers', value: 15 },
  { name: 'Export', value: 10 },
];

const productPerformance = [
  { product: 'Fresh Milk', sales: 1200, growth: 8 },
  { product: 'Yogurt', sales: 800, growth: 12 },
  { product: 'Cheese', sales: 600, growth: 5 },
  { product: 'Butter', sales: 400, growth: -2 },
  { product: 'Ice Cream', sales: 700, growth: 15 },
  { product: 'Cream', sales: 300, growth: 3 },
];

const marketingEffectiveness = [
  { channel: 'Social Media', roi: 320, budget: 1200 },
  { channel: 'Email Marketing', roi: 280, budget: 800 },
  { channel: 'Trade Shows', roi: 180, budget: 1500 },
  { channel: 'Print Ads', roi: 90, budget: 1000 },
  { channel: 'Referrals', roi: 400, budget: 300 },
];

const SalesAnalytics = () => {
  const [timeRange, setTimeRange] = useState('yearly');
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  const formatCurrency = (value) => {
    return `$${value.toLocaleString()}`
  };
  
  const calculateTotalSales = () => {
    return salesData.reduce((total, item) => total + item.sales, 0);
  };
  
  const calculateAverageGrowth = () => {
    return (productPerformance.reduce((total, item) => total + item.growth, 0) / productPerformance.length).toFixed(1);
  };
  
  const calculateTotalROI = () => {
    const totalBudget = marketingEffectiveness.reduce((total, item) => total + item.budget, 0);
    const totalROI = marketingEffectiveness.reduce((total, item) => total + item.roi, 0);
    return ((totalROI / totalBudget) * 100).toFixed(1);
  };
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow">
          <p className="font-medium text-sm">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${typeof entry.value === 'number' ? formatCurrency(entry.value) : entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Sales Analytics Dashboard</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(calculateTotalSales())}</div>
            <p className="text-xs text-muted-foreground">+14% from previous period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Product Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateAverageGrowth()}%</div>
            <p className="text-xs text-muted-foreground">Across all product categories</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Marketing ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateTotalROI()}%</div>
            <p className="text-xs text-muted-foreground">Return on marketing investment</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="sales">Sales Performance</TabsTrigger>
          <TabsTrigger value="customers">Customer Segments</TabsTrigger>
          <TabsTrigger value="products">Product Performance</TabsTrigger>
          <TabsTrigger value="marketing">Marketing ROI</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Sales Performance vs Target</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="#8884d8" name="Sales" strokeWidth={2} />
                    <Line type="monotone" dataKey="target" stroke="#82ca9d" name="Target" strokeWidth={2} />
                    <Line type="monotone" dataKey="lastYear" stroke="#ffc658" name="Last Year" strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Customer Segments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={customerSegments}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {customerSegments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="product" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="sales" fill="#8884d8" name="Sales Volume" />
                    <Bar yAxisId="right" dataKey="growth" fill="#82ca9d" name="Growth %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="marketing">
          <Card>
            <CardHeader>
              <CardTitle>Marketing Channel Effectiveness</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={marketingEffectiveness} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="channel" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area type="monotone" dataKey="budget" fill="#8884d8" stroke="#8884d8" name="Budget" />
                    <Area type="monotone" dataKey="roi" fill="#82ca9d" stroke="#82ca9d" name="ROI" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesAnalytics;
