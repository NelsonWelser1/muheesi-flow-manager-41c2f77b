import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const InventoryAnalytics = () => {
  const stockTrends = [
    { date: '2024-01-09', stock: 1200 },
    { date: '2024-01-10', stock: 1150 },
    { date: '2024-01-11', stock: 1300 },
    { date: '2024-01-12', stock: 1250 },
    { date: '2024-01-13', stock: 1400 },
    { date: '2024-01-14', stock: 1350 },
    { date: '2024-01-15', stock: 1500 }
  ];

  const productDistribution = [
    { name: 'Fresh Milk', value: 500 },
    { name: 'Yogurt', value: 300 },
    { name: 'Cheese', value: 200 },
    { name: 'Butter', value: 150 },
    { name: 'Cream', value: 100 }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Stock Level Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stockTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="stock" 
                  stroke="#8884d8" 
                  name="Stock Level"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="value" 
                  fill="#82ca9d" 
                  name="Quantity"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryAnalytics;