
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { BarChart, LineChart, PieChart, Calendar } from "lucide-react";
import { BarChart as RechartsBarChart, Bar, LineChart as RechartsLineChart, Line, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AnalyticsView = () => {
  const [activeTab, setActiveTab] = useState('production');
  const [timeRange, setTimeRange] = useState('month');
  
  // Sample production data
  const productionData = [
    { month: 'Jan', milk: 2400, target: 2000, avg: 2200 },
    { month: 'Feb', milk: 1398, target: 2000, avg: 1800 },
    { month: 'Mar', milk: 9800, target: 8000, avg: 8500 },
    { month: 'Apr', milk: 3908, target: 4000, avg: 3900 },
    { month: 'May', milk: 4800, target: 5000, avg: 4700 },
    { month: 'Jun', milk: 3800, target: 4000, avg: 3900 },
  ];
  
  // Financial data
  const financialData = [
    { month: 'Jan', revenue: 12400, expenses: 8200, profit: 4200 },
    { month: 'Feb', revenue: 9800, expenses: 7600, profit: 2200 },
    { month: 'Mar', revenue: 14500, expenses: 9200, profit: 5300 },
    { month: 'Apr', revenue: 11200, expenses: 8400, profit: 2800 },
    { month: 'May', revenue: 13600, expenses: 8900, profit: 4700 },
    { month: 'Jun', revenue: 15800, expenses: 9600, profit: 6200 },
  ];
  
  // Historical trends
  const historicalData = [
    { year: '2020', milk: 12400, cattle: 85, revenue: 32000 },
    { year: '2021', milk: 15600, cattle: 92, revenue: 38000 },
    { year: '2022', milk: 14200, cattle: 88, revenue: 36000 },
    { year: '2023', milk: 18900, cattle: 110, revenue: 45000 },
    { year: '2024', milk: 21300, cattle: 124, revenue: 52000 },
  ];
  
  // Distribution data
  const distributionData = [
    { name: 'Milk', value: 55 },
    { name: 'Cheese', value: 20 },
    { name: 'Yogurt', value: 15 },
    { name: 'Other', value: 10 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Dairy Analytics</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last Week</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="quarter">Last Quarter</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="production" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span>Production Summary</span>
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            <span>Financial Reports</span>
          </TabsTrigger>
          <TabsTrigger value="historical" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Historical Trends</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="production" className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="p-4 bg-blue-50">
              <p className="text-sm text-gray-600">Total Milk Production</p>
              <div className="text-2xl font-bold">26,104 Liters</div>
              <p className="text-xs text-green-600">↑ 12% from previous {timeRange}</p>
            </Card>
            
            <Card className="p-4 bg-green-50">
              <p className="text-sm text-gray-600">Average Daily Production</p>
              <div className="text-2xl font-bold">870 Liters/day</div>
              <p className="text-xs text-green-600">↑ 5% from previous {timeRange}</p>
            </Card>
            
            <Card className="p-4 bg-purple-50">
              <p className="text-sm text-gray-600">Production Efficiency</p>
              <div className="text-2xl font-bold">92%</div>
              <p className="text-xs text-green-600">↑ 3% from previous {timeRange}</p>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Monthly Milk Production</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsBarChart data={productionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="milk" fill="#8884d8" name="Actual (L)" />
                  <Bar dataKey="target" fill="#82ca9d" name="Target (L)" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Production Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="financial" className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="p-4 bg-green-50">
              <p className="text-sm text-gray-600">Total Revenue</p>
              <div className="text-2xl font-bold">UGX 77,300,000</div>
              <p className="text-xs text-green-600">↑ 8% from previous {timeRange}</p>
            </Card>
            
            <Card className="p-4 bg-red-50">
              <p className="text-sm text-gray-600">Total Expenses</p>
              <div className="text-2xl font-bold">UGX 51,900,000</div>
              <p className="text-xs text-red-600">↑ 4% from previous {timeRange}</p>
            </Card>
            
            <Card className="p-4 bg-blue-50">
              <p className="text-sm text-gray-600">Net Profit</p>
              <div className="text-2xl font-bold">UGX 25,400,000</div>
              <p className="text-xs text-green-600">↑ 15% from previous {timeRange}</p>
            </Card>
          </div>
          
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Revenue vs Expenses</h3>
            <ResponsiveContainer width="100%" height={400}>
              <RechartsBarChart data={financialData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `UGX ${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="revenue" fill="#82ca9d" name="Revenue" />
                <Bar dataKey="expenses" fill="#ff7675" name="Expenses" />
                <Bar dataKey="profit" fill="#74b9ff" name="Profit" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </Card>
          
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Revenue Breakdown</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Milk Sales</span>
                  <span className="font-medium">UGX 42,500,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '55%' }}></div>
                </div>
                
                <div className="flex justify-between">
                  <span>Processed Products</span>
                  <span className="font-medium">UGX 26,800,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '35%' }}></div>
                </div>
                
                <div className="flex justify-between">
                  <span>Cattle Sales</span>
                  <span className="font-medium">UGX 8,000,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Expense Breakdown</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Feed & Nutrition</span>
                  <span className="font-medium">UGX 22,300,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '43%' }}></div>
                </div>
                
                <div className="flex justify-between">
                  <span>Labor</span>
                  <span className="font-medium">UGX 16,600,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '32%' }}></div>
                </div>
                
                <div className="flex justify-between">
                  <span>Veterinary & Health</span>
                  <span className="font-medium">UGX 7,200,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: '14%' }}></div>
                </div>
                
                <div className="flex justify-between">
                  <span>Equipment & Maintenance</span>
                  <span className="font-medium">UGX 5,800,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: '11%' }}></div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="historical" className="pt-6">
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-medium mb-4">Production Trends (5 Years)</h3>
            <ResponsiveContainer width="100%" height={400}>
              <RechartsLineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="milk" name="Milk Production (x100L)" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line yAxisId="right" type="monotone" dataKey="cattle" name="Cattle Count" stroke="#82ca9d" />
              </RechartsLineChart>
            </ResponsiveContainer>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Historical Financial Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsBarChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip formatter={(value) => `UGX ${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="revenue" fill="#82ca9d" name="Revenue (x1000 UGX)" />
              </RechartsBarChart>
            </ResponsiveContainer>
            
            <div className="mt-6 space-y-4">
              <h4 className="font-medium">Key Insights:</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>Milk production has shown a steady increase of approximately 15% annually over the past 5 years</li>
                <li>Cattle health metrics have improved, with lower mortality rates and fewer disease occurrences</li>
                <li>Feed efficiency has increased by 12% since 2020, resulting in better production-to-cost ratios</li>
                <li>Revenue growth has outpaced expense growth, leading to improved profit margins</li>
              </ul>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsView;
