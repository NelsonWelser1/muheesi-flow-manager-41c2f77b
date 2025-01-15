import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { month: 'Jan', sales: 4000, target: 3800 },
  { month: 'Feb', sales: 3000, target: 3900 },
  { month: 'Mar', sales: 2000, target: 4000 },
  { month: 'Apr', sales: 2780, target: 4100 },
  { month: 'May', sales: 1890, target: 4200 },
  { month: 'Jun', sales: 2390, target: 4300 },
];

const SalesAnalytics = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Performance vs Target</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#8884d8" name="Actual Sales" />
              <Line type="monotone" dataKey="target" stroke="#82ca9d" name="Target Sales" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesAnalytics;