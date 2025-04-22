
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BukomeroAnalytics = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Production Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center bg-gray-100 rounded-md">
            <p className="text-gray-500">Production trend charts will be displayed here</p>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Productivity Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Average Milk Per Cow</span>
                <span className="font-medium">14.7 liters/day</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Feed Conversion Ratio</span>
                <span className="font-medium">1:1.8</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Production Efficiency</span>
                <span className="font-medium text-green-600">92%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Staff Productivity</span>
                <span className="font-medium">208 liters/staff</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quality Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Milk Fat Content</span>
                <span className="font-medium">3.8%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Protein Content</span>
                <span className="font-medium">3.2%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Somatic Cell Count</span>
                <span className="font-medium text-green-600">180,000 cells/ml</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Bacterial Count</span>
                <span className="font-medium text-green-600">15,000 CFU/ml</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Financial Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-60 flex items-center justify-center bg-gray-100 rounded-md">
            <p className="text-gray-500">Financial performance charts will be displayed here</p>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span>Production Cost</span>
              <span className="font-medium">UGX 1,800/liter</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Average Selling Price</span>
              <span className="font-medium">UGX 2,500/liter</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Profit Margin</span>
              <span className="font-medium text-green-600">28%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BukomeroAnalytics;
