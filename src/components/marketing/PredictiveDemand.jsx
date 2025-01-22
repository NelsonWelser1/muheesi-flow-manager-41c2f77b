import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const mockForecastData = [
  { product: 'Product A', current: 100, predicted: 150 },
  { product: 'Product B', current: 80, predicted: 120 },
  { product: 'Product C', current: 60, predicted: 90 },
  { product: 'Product D', current: 40, predicted: 45 },
];

const PredictiveDemand = () => {
  console.log('Rendering PredictiveDemand component');

  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Demand Forecast Alert</AlertTitle>
        <AlertDescription>
          Predicted 50% increase in demand for Product A during the upcoming campaign period.
          Consider increasing inventory levels.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Demand Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockForecastData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="product" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="current" fill="#8884d8" name="Current Demand" />
                <Bar dataKey="predicted" fill="#82ca9d" name="Predicted Demand" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Top Products by Predicted Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {mockForecastData.map((item) => (
                <li key={item.product} className="flex justify-between items-center">
                  <span>{item.product}</span>
                  <span className="text-green-500">
                    +{Math.round(((item.predicted - item.current) / item.current) * 100)}%
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center text-amber-500">
                <AlertCircle className="h-4 w-4 mr-2" />
                Increase Product A stock by 50 units
              </li>
              <li className="flex items-center text-amber-500">
                <AlertCircle className="h-4 w-4 mr-2" />
                Review Product B supplier capacity
              </li>
              <li className="flex items-center text-green-500">
                <AlertCircle className="h-4 w-4 mr-2" />
                Current stock adequate for Product C
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PredictiveDemand;