
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const FinancialSummary = () => {
  const revenueData = [
    { company: 'Grand Berna', revenue: 8.5, profit: 2.1, margin: 24.7 },
    { company: 'KAJON Coffee', revenue: 3.2, profit: 0.8, margin: 25.0 },
    { company: 'Kyalima Farmers', revenue: 2.8, profit: 0.6, margin: 21.4 },
    { company: 'Fresheco', revenue: 0.65, profit: 0.1, margin: 15.4 }
  ];

  const portfolioData = [
    { name: 'Grand Berna Dairies', value: 56.3, color: '#8884d8' },
    { name: 'KAJON Coffee', value: 21.2, color: '#82ca9d' },
    { name: 'Kyalima Farmers', value: 18.5, color: '#ffc658' },
    { name: 'Fresheco Farming', value: 4.0, color: '#ff7300' }
  ];

  const monthlyTrends = [
    { month: 'Jan', total: 12.5, growth: 5.2 },
    { month: 'Feb', total: 13.1, growth: 4.8 },
    { month: 'Mar', total: 13.8, growth: 5.3 },
    { month: 'Apr', total: 14.2, growth: 2.9 },
    { month: 'May', total: 14.9, growth: 4.9 },
    { month: 'Jun', total: 15.2, growth: 2.0 }
  ];

  return (
    <div className="space-y-6">
      {/* Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$15.15M</p>
            <p className="text-xs text-green-600">+8.5% YoY</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$3.6M</p>
            <p className="text-xs text-green-600">+12.1% YoY</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">23.8%</p>
            <p className="text-xs text-green-600">+2.3% YoY</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">18.5%</p>
            <p className="text-xs text-green-600">+1.8% YoY</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Company */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Company (Last 12 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="company" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}M`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Revenue Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={portfolioData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {portfolioData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}M`, 'Total Revenue']} />
                <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialSummary;
