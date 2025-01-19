import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const mockAnalyticsData = [
  { date: '2025-01', roi: 2.5, sales: 15000, inventory: 85 },
  { date: '2025-02', roi: 3.2, sales: 18000, inventory: 75 },
  { date: '2025-03', roi: 2.8, sales: 16500, inventory: 80 },
];

const CampaignAnalytics = () => {
  console.log('Rendering CampaignAnalytics component');
  
  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>AI Recommendation</AlertTitle>
        <AlertDescription>
          Based on current trends, increasing your social media ad spend by 20% could improve ROI by an estimated 35%.
        </AlertDescription>
      </Alert>

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Campaign ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">285%</div>
            <Badge className="mt-2" variant="success">+15% from last month</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <Badge className="mt-2">2 ending soon</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Budget Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75%</div>
            <Badge className="mt-2" variant="outline">On track</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CampaignAnalytics;