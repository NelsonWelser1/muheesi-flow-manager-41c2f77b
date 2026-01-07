import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { BarChart3, Globe, DollarSign, TrendingUp, ArrowRight, Loader2 } from 'lucide-react';
import useCoffeeAnalytics from '@/hooks/useCoffeeAnalytics';

const ExportAnalyticsTab = () => {
  const [period, setPeriod] = useState('year');
  const [activeTab, setActiveTab] = useState('overview');
  
  const { 
    isLoading, 
    getMonthlyOverview, 
    getDestinationData, 
    getPriceTrends,
    getSummaryStats 
  } = useCoffeeAnalytics();

  // Get data from hooks
  const overviewData = getMonthlyOverview();
  const destinationData = getDestinationData();
  const priceData = getPriceTrends();
  const stats = getSummaryStats();

  // Fallback data if no real data available
  const fallbackOverviewData = [
    { month: 'Jan', quantity: 120, value: 520000 },
    { month: 'Feb', quantity: 132, value: 580000 },
    { month: 'Mar', quantity: 101, value: 470000 },
  ];

  const fallbackDestinationData = [
    { name: 'Europe', value: 35 },
    { name: 'North America', value: 30 },
    { name: 'Asia', value: 20 },
    { name: 'Middle East', value: 10 },
    { name: 'Africa', value: 5 },
  ];

  const fallbackPriceData = [
    { month: 'Jan', arabicaPrice: 8.50, robustaPrice: 5.50 },
    { month: 'Feb', arabicaPrice: 9.00, robustaPrice: 5.50 },
  ];

  const displayOverviewData = overviewData.length > 0 ? overviewData : fallbackOverviewData;
  const displayDestinationData = destinationData.length > 0 ? destinationData : fallbackDestinationData;
  const displayPriceData = priceData.length > 0 ? priceData : fallbackPriceData;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'financial', label: 'Financial', icon: <DollarSign className="h-4 w-4" /> },
    { id: 'market', label: 'Market Analysis', icon: <Globe className="h-4 w-4" /> },
    { id: 'price', label: 'Price Trends', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'forecast', label: 'Forecasts', icon: <ArrowRight className="h-4 w-4" /> },
  ];

  const formatCurrency = (value) => {
    return `$${(value / 1000).toFixed(0)}K`;
  };

  const formatValue = (value) => {
    return `${value}%`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Export Analytics</h2>
          <p className="text-sm text-muted-foreground">
            {stats.totalOrders} orders • ${stats.totalRevenue.toLocaleString()} total revenue
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="year">Last 12 Months</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Export Data</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">Total Orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total Revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{(stats.totalQuantity / 1000).toFixed(1)} MT</div>
            <p className="text-xs text-muted-foreground">Total Volume</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">${stats.avgOrderValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Avg Order Value</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-6">
          {tabs.map(tab => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              {tab.icon}
              <span>{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Export Volume (Metric Tons)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={displayOverviewData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="quantity" fill="#8884d8" name="MT of Coffee" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Export Value (USD)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={displayOverviewData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={formatCurrency} />
                      <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Value']} />
                      <Legend />
                      <Area type="monotone" dataKey="value" stroke="#82ca9d" fill="#82ca9d" name="Export Value" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Financial Tab */}
        {activeTab === 'financial' && (
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={displayOverviewData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={formatCurrency} />
                      <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'USD']} />
                      <Legend />
                      <Bar dataKey="value" name="Revenue" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Market Analysis Tab */}
        {activeTab === 'market' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Destinations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={displayDestinationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {displayDestinationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={formatValue} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Confirmed', value: stats.confirmedOrders },
                          { name: 'Pending', value: stats.pendingOrders }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        <Cell fill="#00C49F" />
                        <Cell fill="#FFBB28" />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Price Trends Tab */}
        {activeTab === 'price' && (
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Coffee Price Trends (USD/kg)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={displayPriceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => value ? [`$${value.toFixed(2)}/kg`, ''] : ['N/A', '']} />
                      <Legend />
                      <Line type="monotone" dataKey="arabicaPrice" stroke="#8884d8" name="Arabica" connectNulls />
                      <Line type="monotone" dataKey="robustaPrice" stroke="#82ca9d" name="Robusta" connectNulls />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Forecasts Tab */}
        {activeTab === 'forecast' && (
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend & Projection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={displayOverviewData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={formatCurrency} />
                      <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                      <Legend />
                      <Line type="monotone" dataKey="value" stroke="#8884d8" name="Revenue" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </Tabs>
    </div>
  );
};

export default ExportAnalyticsTab;
