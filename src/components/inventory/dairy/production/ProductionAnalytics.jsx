
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const mockData = {
  production: [
    { date: '2024-01', output: 1200, efficiency: 92 },
    { date: '2024-02', output: 1350, efficiency: 94 },
    { date: '2024-03', output: 1100, efficiency: 89 },
    { date: '2024-04', output: 1400, efficiency: 95 },
  ],
  quality: [
    { month: 'Jan', passed: 95, failed: 5 },
    { month: 'Feb', passed: 97, failed: 3 },
    { month: 'Mar', passed: 94, failed: 6 },
    { month: 'Apr', passed: 98, failed: 2 },
  ]
};

const ProductionAnalytics = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Production Output Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData.production}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="output" stroke="#8884d8" name="Output (kg)" />
                <Line type="monotone" dataKey="efficiency" stroke="#82ca9d" name="Efficiency (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quality Control Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData.quality}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="passed" fill="#82ca9d" name="Passed" />
                <Bar dataKey="failed" fill="#ff8042" name="Failed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionAnalytics;
