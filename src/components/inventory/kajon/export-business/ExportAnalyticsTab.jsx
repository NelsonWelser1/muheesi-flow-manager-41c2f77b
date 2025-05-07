
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
import { BarChart3, Globe, DollarSign, TrendingUp, ArrowRight } from 'lucide-react';

const ExportAnalyticsTab = () => {
  const [period, setPeriod] = useState('year');
  const [activeTab, setActiveTab] = useState('overview');

  // Sample data for demonstration
  const overviewData = [
    { month: 'Jan', quantity: 120, value: 520000 },
    { month: 'Feb', quantity: 132, value: 580000 },
    { month: 'Mar', quantity: 101, value: 470000 },
    { month: 'Apr', quantity: 134, value: 590000 },
    { month: 'May', quantity: 140, value: 610000 },
    { month: 'Jun', quantity: 145, value: 630000 },
    { month: 'Jul', quantity: 150, value: 650000 },
    { month: 'Aug', quantity: 160, value: 690000 },
    { month: 'Sep', quantity: 170, value: 730000 },
    { month: 'Oct', quantity: 180, value: 760000 },
    { month: 'Nov', quantity: 195, value: 810000 },
    { month: 'Dec', quantity: 210, value: 870000 },
  ];

  const destinationData = [
    { name: 'Europe', value: 35 },
    { name: 'North America', value: 30 },
    { name: 'Asia', value: 20 },
    { name: 'Middle East', value: 10 },
    { name: 'Africa', value: 5 },
  ];

  const priceData = [
    { month: 'Jan', arabicaPrice: 4.2, robustaPrice: 2.1 },
    { month: 'Feb', arabicaPrice: 4.3, robustaPrice: 2.0 },
    { month: 'Mar', arabicaPrice: 4.5, robustaPrice: 2.2 },
    { month: 'Apr', arabicaPrice: 4.6, robustaPrice: 2.3 },
    { month: 'May', arabicaPrice: 4.8, robustaPrice: 2.4 },
    { month: 'Jun', arabicaPrice: 4.7, robustaPrice: 2.3 },
    { month: 'Jul', arabicaPrice: 4.9, robustaPrice: 2.5 },
    { month: 'Aug', arabicaPrice: 5.0, robustaPrice: 2.6 },
    { month: 'Sep', arabicaPrice: 5.2, robustaPrice: 2.7 },
    { month: 'Oct', arabicaPrice: 5.1, robustaPrice: 2.6 },
    { month: 'Nov', arabicaPrice: 5.3, robustaPrice: 2.8 },
    { month: 'Dec', arabicaPrice: 5.4, robustaPrice: 2.9 },
  ];

  const forecastData = [
    { month: 'Jan', actual: 520000, forecast: 510000 },
    { month: 'Feb', actual: 580000, forecast: 570000 },
    { month: 'Mar', actual: 470000, forecast: 490000 },
    { month: 'Apr', actual: 590000, forecast: 580000 },
    { month: 'May', actual: 610000, forecast: 600000 },
    { month: 'Jun', actual: 630000, forecast: 640000 },
    { month: 'Jul', actual: null, forecast: 670000 },
    { month: 'Aug', actual: null, forecast: 700000 },
    { month: 'Sep', actual: null, forecast: 730000 },
    { month: 'Oct', actual: null, forecast: 760000 },
    { month: 'Nov', actual: null, forecast: 790000 },
    { month: 'Dec', actual: null, forecast: 820000 },
  ];

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Export Analytics</h2>
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
                    <BarChart data={overviewData}>
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
                    <AreaChart data={overviewData}>
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
                <CardTitle>Revenue vs Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={overviewData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={formatCurrency} />
                      <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'USD']} />
                      <Legend />
                      <Bar dataKey="value" name="Revenue" fill="#8884d8" />
                      <Bar dataKey="quantity" name="Costs" fill="#82ca9d" stackId="a" />
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
                <CardTitle>Export Destinations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={destinationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {destinationData.map((entry, index) => (
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
                <CardTitle>Market Share Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={overviewData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="quantity" stroke="#8884d8" name="Market Share" />
                    </LineChart>
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
                    <LineChart data={priceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}/kg`, '']} />
                      <Legend />
                      <Line type="monotone" dataKey="arabicaPrice" stroke="#8884d8" name="Arabica" />
                      <Line type="monotone" dataKey="robustaPrice" stroke="#82ca9d" name="Robusta" />
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
                <CardTitle>Revenue Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={forecastData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={formatCurrency} />
                      <Tooltip formatter={(value) => value ? [`$${value.toLocaleString()}`, ''] : ['N/A', '']} />
                      <Legend />
                      <Line type="monotone" dataKey="actual" stroke="#8884d8" name="Actual" strokeWidth={2} />
                      <Line type="monotone" dataKey="forecast" stroke="#82ca9d" name="Forecast" strokeWidth={2} strokeDasharray="5 5" />
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
