import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";

const PredictiveDemand = () => {
  console.log('Rendering PredictiveDemand component');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Demand Predictions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Predicted Demand Spike</AlertTitle>
          <AlertDescription>
            Expected 35% increase in demand for Fresh Milk during the upcoming "Back to School" campaign.
          </AlertDescription>
        </Alert>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-2">Top Products</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Fresh Milk</span>
                <Badge>+35%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Yogurt</span>
                <Badge>+28%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Cheese</span>
                <Badge>+20%</Badge>
              </div>
            </div>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-2">Recommended Actions</h4>
            <ul className="list-disc list-inside space-y-2">
              <li>Increase Fresh Milk stock by 40%</li>
              <li>Schedule additional delivery slots</li>
              <li>Prepare promotional materials</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictiveDemand;