import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from "@/components/ui/badge";

const mockData = [
  { month: 'Jan', revenue: 4000, roi: 1.5 },
  { month: 'Feb', revenue: 3000, roi: 1.2 },
  { month: 'Mar', revenue: 2000, roi: 1.8 },
  { month: 'Apr', revenue: 2780, roi: 1.4 },
  { month: 'May', revenue: 1890, roi: 1.6 },
  { month: 'Jun', revenue: 2390, roi: 1.3 },
];

const CampaignAnalytics = () => {
  console.log('Rendering CampaignAnalytics component');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue" />
                <Line yAxisId="right" type="monotone" dataKey="roi" stroke="#82ca9d" name="ROI" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <div className="flex items-center mt-2">
              <Badge variant="success">+2 from last month</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Average ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">145%</div>
            <div className="flex items-center mt-2">
              <Badge variant="success">+15% from last month</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Budget Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,678</div>
            <div className="flex items-center mt-2">
              <Badge variant="warning">80% of allocated</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CampaignAnalytics;