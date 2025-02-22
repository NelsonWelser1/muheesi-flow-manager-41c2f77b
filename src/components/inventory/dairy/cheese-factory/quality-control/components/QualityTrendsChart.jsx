
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const QualityTrendsChart = ({ chartData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quality Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="temperature" stroke="#8884d8" name="Temperature" />
              <Line type="monotone" dataKey="ph" stroke="#82ca9d" name="pH Level" />
              <Line type="monotone" dataKey="moisture" stroke="#ffc658" name="Moisture" />
              <Line type="monotone" dataKey="fat" stroke="#ff7300" name="Fat" />
              <Line type="monotone" dataKey="protein" stroke="#00C49F" name="Protein" />
              <Line type="monotone" dataKey="salt" stroke="#FFBB28" name="Salt" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default QualityTrendsChart;
