import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Charts = ({ data }) => {
  const mockData = {
    sourcing: [
      { month: 'Jan', arabica: 4000, robusta: 2400 },
      { month: 'Feb', arabica: 3000, robusta: 1398 },
      { month: 'Mar', arabica: 2000, robusta: 9800 },
      { month: 'Apr', arabica: 2780, robusta: 3908 },
    ],
    financial: [
      { month: 'Jan', revenue: 4000, expenses: 2400 },
      { month: 'Feb', revenue: 3000, expenses: 1398 },
      { month: 'Mar', revenue: 2000, expenses: 9800 },
      { month: 'Apr', revenue: 2780, expenses: 3908 },
    ]
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Sourcing Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data?.sourcing || mockData.sourcing}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="arabica" stroke="#8884d8" />
              <Line type="monotone" dataKey="robusta" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Financial Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data?.financial || mockData.financial}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#8884d8" />
              <Bar dataKey="expenses" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Charts;