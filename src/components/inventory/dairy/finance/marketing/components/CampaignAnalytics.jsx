import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockAnalyticsData = [
  { date: '2025-01', roi: 2.5, sales: 15000, inventory: 85 },
  { date: '2025-02', roi: 3.2, sales: 18000, inventory: 75 },
  { date: '2025-03', roi: 2.8, sales: 16500, inventory: 80 },
];

const CampaignAnalytics = () => {
  console.log('Rendering CampaignAnalytics component');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Performance Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockAnalyticsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Line yAxisId="left" type="monotone" dataKey="roi" stroke="#8884d8" name="ROI" />
              <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#82ca9d" name="Sales" />
              <Line yAxisId="right" type="monotone" dataKey="inventory" stroke="#ffc658" name="Inventory Level" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignAnalytics;