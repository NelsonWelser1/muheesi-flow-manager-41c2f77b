import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, TrendingUp, TrendingDown } from "lucide-react";

const PredictiveDemand = () => {
  console.log('Rendering PredictiveDemand component');

  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>AI-Powered Demand Forecast</AlertTitle>
        <AlertDescription>
          Expected 35% increase in demand for Fresh Milk during the upcoming "Back to School" campaign.
          Consider increasing stock levels by 40% to meet projected demand.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Top Products by Predicted Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                  <span>Fresh Milk</span>
                </div>
                <Badge variant="success">+35%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                  <span>Yogurt</span>
                </div>
                <Badge variant="success">+28%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <TrendingDown className="h-4 w-4 mr-2 text-red-500" />
                  <span>Cheese</span>
                </div>
                <Badge variant="destructive">-12%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recommended Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-center text-green-600">
                <AlertCircle className="h-4 w-4 mr-2" />
                Increase Fresh Milk stock by 40%
              </li>
              <li className="flex items-center text-amber-600">
                <AlertCircle className="h-4 w-4 mr-2" />
                Schedule additional delivery slots
              </li>
              <li className="flex items-center text-blue-600">
                <AlertCircle className="h-4 w-4 mr-2" />
                Prepare promotional materials
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Seasonal Impact Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Back to School Season</span>
              <Badge variant="outline">High Impact</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Holiday Season</span>
              <Badge variant="outline">Medium Impact</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Summer Break</span>
              <Badge variant="outline">Low Impact</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictiveDemand;