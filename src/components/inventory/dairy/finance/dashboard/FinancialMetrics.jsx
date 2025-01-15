import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { month: 'Jan', revenue: 4000, expenses: 3000, profit: 1000 },
  { month: 'Feb', revenue: 4500, expenses: 3200, profit: 1300 },
  { month: 'Mar', revenue: 5000, expenses: 3500, profit: 1500 },
  { month: 'Apr', revenue: 4800, expenses: 3300, profit: 1500 },
];

const MetricCard = ({ title, value, trend }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <span className={`text-xs ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {trend >= 0 ? '+' : ''}{trend}%
      </span>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">UGX {value.toLocaleString()}</div>
    </CardContent>
  </Card>
);

const FinancialMetrics = () => {
  console.log('Rendering FinancialMetrics component');
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Revenue" value={5000000} trend={12} />
        <MetricCard title="Total Expenses" value={3500000} trend={-5} />
        <MetricCard title="Net Profit" value={1500000} trend={8} />
        <MetricCard title="Cash Flow" value={2000000} trend={15} />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Financial Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue" />
                <Line type="monotone" dataKey="expenses" stroke="#82ca9d" name="Expenses" />
                <Line type="monotone" dataKey="profit" stroke="#ffc658" name="Profit" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialMetrics;