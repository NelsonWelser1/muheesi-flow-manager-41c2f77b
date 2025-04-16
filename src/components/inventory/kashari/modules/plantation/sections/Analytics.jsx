
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';

const Analytics = () => {
  // Sample data for charts
  const salesData = [
    { name: 'Jan', sales: 780000, expenses: 350000 },
    { name: 'Feb', sales: 650000, expenses: 410000 },
    { name: 'Mar', sales: 820000, expenses: 390000 },
    { name: 'Apr', sales: 960000, expenses: 430000 },
  ];
  
  const inventoryData = [
    { name: 'Bananas (Ripe)', stock: 160, value: 1040000, color: '#8884d8' },
    { name: 'Bananas (Green)', stock: 355, value: 1775000, color: '#82ca9d' },
  ];
  
  const salesByProductData = [
    { name: 'Bananas (Ripe)', value: 585000, color: '#8884d8' },
    { name: 'Bananas (Green)', value: 375000, color: '#82ca9d' },
  ];
  
  const salesTrend = [
    { day: '01', sales: 55000 },
    { day: '02', sales: 48000 },
    { day: '03', sales: 62000 },
    { day: '04', sales: 37000 },
    { day: '05', sales: 42000 },
    { day: '06', sales: 58000 },
    { day: '07', sales: 63000 },
    { day: '08', sales: 51000 },
    { day: '09', sales: 59000 },
    { day: '10', sales: 76000 },
  ];
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Plantation Inventory & Sales Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales & Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `UGX ${value.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="sales" name="Sales (UGX)" fill="#8884d8" />
                  <Bar dataKey="expenses" name="Expenses (UGX)" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Inventory Value by Product</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={inventoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {inventoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `UGX ${value.toLocaleString()}`} />
                  <Legend formatter={(value) => `${value} (UGX ${inventoryData.find(item => item.name === value).value.toLocaleString()})`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Sales by Product</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={salesByProductData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {salesByProductData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `UGX ${value.toLocaleString()}`} />
                  <Legend formatter={(value) => `${value} (UGX ${salesByProductData.find(item => item.name === value).value.toLocaleString()})`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Daily Sales Trend (April)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip formatter={(value) => `UGX ${value.toLocaleString()}`} />
                  <Legend />
                  <Line type="monotone" dataKey="sales" name="Daily Sales (UGX)" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
