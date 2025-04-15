
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const GrowthMetricsView = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center">
          <Scale className="mr-2 h-6 w-6 text-blue-500" />
          Growth Metrics
        </h2>
        <Button className="flex items-center">
          <TrendingUp className="mr-2 h-4 w-4" />
          Generate Predictions
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Growth Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h3 className="text-lg font-medium text-blue-600">Average Weight</h3>
              <p className="text-3xl font-bold">425 kg</p>
              <p className="text-sm text-green-500">+12kg from last month</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <h3 className="text-lg font-medium text-green-600">Growth Rate</h3>
              <p className="text-3xl font-bold">0.8 kg/day</p>
              <p className="text-sm text-green-500">+0.1kg from target</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
              <h3 className="text-lg font-medium text-amber-600">Feed Efficiency</h3>
              <p className="text-3xl font-bold">4.2</p>
              <p className="text-sm text-gray-500">Feed conversion ratio</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Growth Trends</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <p className="text-muted-foreground">Displaying growth charts here...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GrowthMetricsView;
