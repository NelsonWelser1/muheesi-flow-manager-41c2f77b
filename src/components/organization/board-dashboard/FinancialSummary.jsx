
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const FinancialSummary = () => {
  const revenueData = [
    { company: 'Grand Berna', revenue: 8.5, profit: 2.1, margin: 24.7 },
    { company: 'KAJON Coffee', revenue: 3.2, profit: 0.8, margin: 25.0 },
    { company: 'Kyalima Farmers', revenue: 2.8, profit: 0.6, margin: 21.4 }
  ];

  const portfolioData = [
    { name: 'Grand Berna Dairies', value: 59.4, color: '#8884d8' },
    { name: 'KAJON Coffee', value: 22.4, color: '#82ca9d' },
    { name: 'Kyalima Farmers', value: 18.2, color: '#ffc658' }
  ];

  const monthlyTrends = [
    { month: 'Jan', total: 12.0, growth: 5.2 },
    { month: 'Feb', total: 12.6, growth: 4.8 },
    { month: 'Mar', total: 13.2, growth: 5.3 },
    { month: 'Apr', total: 13.6, growth: 2.9 },
    { month: 'May', total: 14.2, growth: 4.9 },
    { month: 'Jun', total: 14.5, growth: 2.0 }
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
            <p className="text-2xl font-bold">$14.5M</p>
            <p className="text-xs text-green-600">+8.5% YoY</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$3.5M</p>
            <p className="text-xs text-green-600">+12.1% YoY</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">24.1%</p>
            <p className="text-xs text-green-600">+2.3% YoY</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">19.2%</p>
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
