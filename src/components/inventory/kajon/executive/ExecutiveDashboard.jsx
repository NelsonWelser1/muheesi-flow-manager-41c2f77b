
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  AlertCircle, 
  Calendar, 
  PieChart, 
  FileText, 
  Download, 
  Filter, 
  MoreHorizontal,
  Layers,
  Truck,
  Coffee,
  Users,
  DollarSign
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RPieChart, Pie, Cell } from 'recharts';
import StrategicOverview from './StrategicOverview';
import PerformanceMetrics from './PerformanceMetrics';
import InventoryAnalytics from './InventoryAnalytics';
import SalesForecasting from './SalesForecasting';
import QualityInsights from './QualityInsights';
import StrategicActions from './StrategicActions';

const COLORS = ['#8B4513', '#A0522D', '#CD853F', '#D2691E', '#DEB887', '#F5DEB3'];

const ExecutiveDashboard = () => {
  const [dateRange, setDateRange] = useState('month');
  const [reportType, setReportType] = useState('summary');
  
  // Mock data for executive dashboard
  const stockPerformance = [
    { month: 'Jan', arabica: 4000, robusta: 2400 },
    { month: 'Feb', arabica: 3000, robusta: 1398 },
    { month: 'Mar', arabica: 2000, robusta: 9800 },
    { month: 'Apr', arabica: 2780, robusta: 3908 },
    { month: 'May', arabica: 1890, robusta: 4800 },
    { month: 'Jun', arabica: 2390, robusta: 3800 },
  ];
  
  const stockDistribution = [
    { name: 'Arabica AA', value: 400 },
    { name: 'Arabica AB', value: 300 },
    { name: 'Robusta Screen 18', value: 300 },
    { name: 'Robusta Screen 15', value: 200 },
    { name: 'Arabica PB', value: 100 },
    { name: 'Robusta Organic', value: 50 },
  ];
  
  const revenueData = [
    { month: 'Jan', revenue: 12000, projection: 10000 },
    { month: 'Feb', revenue: 15000, projection: 14000 },
    { month: 'Mar', revenue: 18000, projection: 16000 },
    { month: 'Apr', revenue: 16000, projection: 18000 },
    { month: 'May', revenue: 21000, projection: 20000 },
    { month: 'Jun', revenue: 28000, projection: 22000 },
  ];

  // Mock KPIs and alerts for the dashboard
  const kpis = [
    { title: 'Total Inventory Value', value: '$245,000', trend: '+12%', status: 'positive' },
    { title: 'Sales This Month', value: '$68,500', trend: '+8%', status: 'positive' },
    { title: 'Avg. Quality Score', value: '92.4', trend: '+2.1', status: 'positive' },
    { title: 'Processing Efficiency', value: '94%', trend: '-1%', status: 'warning' },
  ];

  const alerts = [
    { type: 'critical', message: 'Arabica AA stock below reorder level', action: 'Review' },
    { type: 'warning', message: 'Quality deviation in recent Robusta batches', action: 'Review' },
    { type: 'info', message: 'New quarterly report available', action: 'View' },
  ];

  const recentReports = [
    { title: 'Q2 Inventory Summary', date: '2023-06-30', type: 'Quarterly' },
    { title: 'Coffee Quality Analysis', date: '2023-06-15', type: 'Monthly' },
    { title: 'Export Performance Report', date: '2023-06-10', type: 'Monthly' },
    { title: 'Price Trend Analysis', date: '2023-06-05', type: 'Weekly' },
  ];

  return (
    <div className="space-y-6">
      {/* Executive Actions Bar */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-bold">Executive Dashboard</h2>
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">Strategic View</Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-[150px]">
              <FileText className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Report Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="summary">Summary</SelectItem>
              <SelectItem value="detailed">Detailed</SelectItem>
              <SelectItem value="forecast">Forecast</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground">{kpi.title}</div>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <div className={cn(
                "text-xs flex items-center",
                kpi.status === 'positive' ? "text-green-600" : 
                kpi.status === 'negative' ? "text-red-600" : "text-amber-600"
              )}>
                {kpi.status === 'positive' ? <TrendingUp className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
                {kpi.trend}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Main Dashboard Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Strategic Overview</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Analytics</TabsTrigger>
          <TabsTrigger value="sales">Sales & Forecasting</TabsTrigger>
          <TabsTrigger value="quality">Quality Insights</TabsTrigger>
          <TabsTrigger value="actions">Strategic Actions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Stock Performance Chart */}
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle>Coffee Stock Performance</CardTitle>
                <CardDescription>Tracking inventory levels and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stockPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="arabica" fill="#8B4513" name="Arabica" />
                      <Bar dataKey="robusta" fill="#D2691E" name="Robusta" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Stock Distribution */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Inventory Distribution</CardTitle>
                <CardDescription>By coffee type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RPieChart>
                      <Pie
                        data={stockDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {stockDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {stockDistribution.map((entry, index) => (
                    <div key={index} className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-1" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span className="text-xs">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Revenue Trends */}
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle>Revenue Performance</CardTitle>
                <CardDescription>Actual vs projected revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="revenue" stroke="#8B4513" name="Actual Revenue" />
                      <Line type="monotone" dataKey="projection" stroke="#D2691E" strokeDasharray="5 5" name="Projected" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Alerts and Notifications */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Strategic Alerts</CardTitle>
                <CardDescription>Issues requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.map((alert, index) => (
                    <div 
                      key={index}
                      className={cn(
                        "p-3 rounded-lg flex justify-between items-start",
                        alert.type === 'critical' ? "bg-red-50 border border-red-100" :
                        alert.type === 'warning' ? "bg-amber-50 border border-amber-100" :
                        "bg-blue-50 border border-blue-100"
                      )}
                    >
                      <div className="flex gap-2">
                        <AlertCircle className={cn(
                          "h-4 w-4 mt-0.5",
                          alert.type === 'critical' ? "text-red-500" :
                          alert.type === 'warning' ? "text-amber-500" :
                          "text-blue-500"
                        )} />
                        <div>
                          <p className="text-sm font-medium">{alert.message}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 px-2">
                        {alert.action}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Recent Reports */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Recent Reports & Analytics</CardTitle>
              <CardDescription>Access the latest business insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {recentReports.map((report, index) => (
                  <Card key={index} className="bg-gray-50">
                    <CardContent className="p-4 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <FileText className="h-4 w-4 text-amber-700" />
                        <Badge variant="outline" className="text-xs h-5">{report.type}</Badge>
                      </div>
                      <h3 className="font-medium text-sm mb-1">{report.title}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{new Date(report.date).toLocaleDateString()}</p>
                      <div className="mt-auto pt-2 flex justify-between">
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">View</Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inventory">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Detailed Inventory Analytics</h3>
              <p className="text-muted-foreground">
                This section will display comprehensive inventory analytics, including stock movement, 
                value trends, and optimization recommendations based on operational data from Kazo Coffee Project.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
                <Card className="bg-amber-50 border-amber-100">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <Layers className="h-8 w-8 text-amber-700 mb-2" />
                    <h3 className="font-medium">Total Inventory</h3>
                    <div className="text-2xl font-bold">12,450 kg</div>
                    <div className="text-xs text-green-600">↑ 8.2% this month</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-amber-50 border-amber-100">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <Coffee className="h-8 w-8 text-amber-700 mb-2" />
                    <h3 className="font-medium">Premium Stock</h3>
                    <div className="text-2xl font-bold">5,280 kg</div>
                    <div className="text-xs text-green-600">↑ 12.5% this month</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-amber-50 border-amber-100">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <Truck className="h-8 w-8 text-amber-700 mb-2" />
                    <h3 className="font-medium">Pending Orders</h3>
                    <div className="text-2xl font-bold">3,200 kg</div>
                    <div className="text-xs text-amber-600">→ Stable this month</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-amber-50 border-amber-100">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <DollarSign className="h-8 w-8 text-amber-700 mb-2" />
                    <h3 className="font-medium">Stock Value</h3>
                    <div className="text-2xl font-bold">$245,000</div>
                    <div className="text-xs text-green-600">↑ 10.2% this month</div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex justify-center">
                <Button className="bg-amber-800 hover:bg-amber-900">View Complete Inventory Report</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sales">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Sales Performance & Forecasting</h3>
              <p className="text-muted-foreground">
                This section will provide detailed sales analysis, trend forecasting, and strategic 
                recommendations based on sales data collected from operational activities.
              </p>
              
              <div className="flex justify-center my-6">
                <Button className="bg-amber-800 hover:bg-amber-900">View Complete Sales Analytics</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="quality">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Coffee Quality Insights</h3>
              <p className="text-muted-foreground">
                This section will display quality metrics, cupping scores, and quality trend analysis
                for all coffee processed through the Kazo operations.
              </p>
              
              <div className="flex justify-center my-6">
                <Button className="bg-amber-800 hover:bg-amber-900">View Quality Reports</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="actions">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Strategic Action Recommendations</h3>
              <p className="text-muted-foreground">
                AI-driven recommendations for executive decisions based on operational data trends,
                market conditions, and business performance metrics.
              </p>
              
              <div className="flex justify-center my-6">
                <Button className="bg-amber-800 hover:bg-amber-900">View Strategic Recommendations</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExecutiveDashboard;
