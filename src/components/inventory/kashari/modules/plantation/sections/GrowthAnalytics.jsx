
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { format, subMonths } from 'date-fns';
import { usePlantationData } from '@/hooks/usePlantationData';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const mockProductionData = [
  { month: 'Jan', banana: 2500, coffee: 1200, maize: 0, beans: 0 },
  { month: 'Feb', banana: 2700, coffee: 1400, maize: 0, beans: 0 },
  { month: 'Mar', banana: 3000, coffee: 1300, maize: 1000, beans: 0 },
  { month: 'Apr', banana: 2800, coffee: 1200, maize: 1500, beans: 500 },
  { month: 'May', banana: 3200, coffee: 1000, maize: 2000, beans: 700 },
  { month: 'Jun', banana: 3500, coffee: 900, maize: 2200, beans: 900 }
];

const mockCropDistribution = [
  { name: 'Banana', value: 35 },
  { name: 'Coffee', value: 25 },
  { name: 'Maize', value: 20 },
  { name: 'Beans', value: 15 },
  { name: 'Other', value: 5 }
];

const mockYieldTrends = [
  { year: '2020', banana: 22, coffee: 18, maize: 15, beans: 12 },
  { year: '2021', banana: 24, coffee: 20, maize: 18, beans: 14 },
  { year: '2022', banana: 26, coffee: 19, maize: 20, beans: 15 },
  { year: '2023', banana: 28, coffee: 21, maize: 22, beans: 16 },
  { year: '2024', banana: 30, coffee: 22, maize: 24, beans: 18 }
];

const generateMonthlyExpenses = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map(month => ({
    month,
    fertilizer: Math.floor(Math.random() * 500000) + 100000,
    seeds: Math.floor(Math.random() * 300000) + 50000,
    labor: Math.floor(Math.random() * 800000) + 200000,
    equipment: Math.floor(Math.random() * 400000) + 100000
  }));
};

const mockRevenueExpenses = [
  { month: 'Jan', revenue: 3800000, expenses: 1500000 },
  { month: 'Feb', revenue: 4200000, expenses: 1700000 },
  { month: 'Mar', revenue: 4500000, expenses: 1900000 },
  { month: 'Apr', revenue: 4300000, expenses: 1800000 },
  { month: 'May', revenue: 4800000, expenses: 2000000 },
  { month: 'Jun', revenue: 5100000, expenses: 2100000 }
];

const mockWeatherImpact = [
  { month: 'Jan', rainfall: 120, temperature: 24, production: 90 },
  { month: 'Feb', rainfall: 100, temperature: 25, production: 85 },
  { month: 'Mar', rainfall: 80, temperature: 26, production: 80 },
  { month: 'Apr', rainfall: 150, temperature: 24, production: 95 },
  { month: 'May', rainfall: 170, temperature: 23, production: 100 },
  { month: 'Jun', rainfall: 140, temperature: 22, production: 98 }
];

const GrowthAnalytics = () => {
  const { cropsData, loading, error } = usePlantationData();
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  
  const cropTypes = [
    { value: 'all', label: 'All Crops' },
    { value: 'banana', label: 'Banana' },
    { value: 'coffee', label: 'Coffee' },
    { value: 'maize', label: 'Maize' },
    { value: 'beans', label: 'Beans' }
  ];

  const periods = [
    { value: '3months', label: 'Last 3 Months' },
    { value: '6months', label: 'Last 6 Months' },
    { value: '1year', label: 'Last Year' }
  ];

  const expensesData = generateMonthlyExpenses();

  // Filter data based on crop selection
  const filterDataByCrop = (data) => {
    if (selectedCrop === 'all') return data;
    
    return data.map(item => {
      const filteredItem = { ...item };
      Object.keys(item).forEach(key => {
        if (key !== selectedCrop && key !== 'month' && key !== 'year') {
          filteredItem[key] = 0;
        }
      });
      return filteredItem;
    });
  };

  const filteredProductionData = filterDataByCrop(mockProductionData);
  const filteredYieldTrends = filterDataByCrop(mockYieldTrends);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-2">
        <h2 className="text-2xl font-bold">Plantation Analytics</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={selectedCrop} onValueChange={setSelectedCrop}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select crop" />
            </SelectTrigger>
            <SelectContent>
              {cropTypes.map(crop => (
                <SelectItem key={crop.value} value={crop.value}>
                  {crop.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              {periods.map(period => (
                <SelectItem key={period.value} value={period.value}>
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="production">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
          <TabsTrigger value="production">Production</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="yields">Yields & Growth</TabsTrigger>
          <TabsTrigger value="weather">Weather Impact</TabsTrigger>
        </TabsList>
        
        <TabsContent value="production">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Production by Crop (Last 6 Months)</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={filteredProductionData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value} kg`} />
                    <Legend />
                    <Bar dataKey="banana" name="Banana" fill="#0088FE" />
                    <Bar dataKey="coffee" name="Coffee" fill="#00C49F" />
                    <Bar dataKey="maize" name="Maize" fill="#FFBB28" />
                    <Bar dataKey="beans" name="Beans" fill="#FF8042" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Crop Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockCropDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {mockCropDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="financial">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue vs Expenses</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={mockRevenueExpenses}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `UGX ${value.toLocaleString()}`} />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenue" fill="#0088FE" />
                    <Bar dataKey="expenses" name="Expenses" fill="#FF8042" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={expensesData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `UGX ${value.toLocaleString()}`} />
                    <Legend />
                    <Bar dataKey="fertilizer" name="Fertilizer" fill="#8884d8" />
                    <Bar dataKey="seeds" name="Seeds" fill="#82ca9d" />
                    <Bar dataKey="labor" name="Labor" fill="#ffc658" />
                    <Bar dataKey="equipment" name="Equipment" fill="#ff8042" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="yields">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Yield Trends by Crop</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={filteredYieldTrends}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value} tons/acre`} />
                    <Legend />
                    <Line type="monotone" dataKey="banana" name="Banana" stroke="#0088FE" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="coffee" name="Coffee" stroke="#00C49F" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="maize" name="Maize" stroke="#FFBB28" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="beans" name="Beans" stroke="#FF8042" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Growth Projections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Projected Growth by Crop</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Banana</span>
                          <span className="text-sm font-medium">+12%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '78%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Coffee</span>
                          <span className="text-sm font-medium">+8%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Maize</span>
                          <span className="text-sm font-medium">+15%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '82%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Beans</span>
                          <span className="text-sm font-medium">+10%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Growth Insights</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full mr-2 mt-0.5">Positive</span>
                        <span>Maize production expected to increase by 15% due to improved farming techniques</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full mr-2 mt-0.5">Stable</span>
                        <span>Coffee yields are stabilizing after previous year's decline</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full mr-2 mt-0.5">Monitor</span>
                        <span>Bean production needs monitoring due to potential pest issues</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="weather">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Weather Impact on Production</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={mockWeatherImpact}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="rainfall" name="Rainfall (mm)" stroke="#0088FE" activeDot={{ r: 8 }} />
                    <Line yAxisId="left" type="monotone" dataKey="temperature" name="Temperature (°C)" stroke="#FF8042" activeDot={{ r: 8 }} />
                    <Line yAxisId="right" type="monotone" dataKey="production" name="Production Index" stroke="#82ca9d" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Climate Adaptation Strategies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-800 mb-2">Rainfall Management</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Implemented water harvesting systems to capture excess rainfall</li>
                      <li>Improved drainage in flood-prone plantation areas</li>
                      <li>Installed soil moisture sensors for precise irrigation scheduling</li>
                    </ul>
                  </div>
                  
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h3 className="font-medium text-orange-800 mb-2">Temperature Adaptation</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Planted shade trees in coffee plots to mitigate high temperatures</li>
                      <li>Adjusted planting schedules to avoid extreme heat periods</li>
                      <li>Introduced heat-resistant crop varieties</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-medium text-green-800 mb-2">Soil Conservation</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Implemented contour farming to prevent soil erosion</li>
                      <li>Increased use of organic matter to improve soil water retention</li>
                      <li>Practicing crop rotation to maintain soil health</li>
                    </ul>
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

export default GrowthAnalytics;
