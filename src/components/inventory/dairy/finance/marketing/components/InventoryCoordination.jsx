import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const InventoryCoordination = () => {
  console.log('Rendering InventoryCoordination component');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Inventory Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Fresh Milk</span>
            <Badge variant={75 > 50 ? "default" : "destructive"}>75% in stock</Badge>
          </div>
          <Progress value={75} className="h-2" />
          
          <div className="flex justify-between items-center">
            <span className="font-medium">Yogurt</span>
            <Badge variant={45 > 50 ? "default" : "destructive"}>45% in stock</Badge>
          </div>
          <Progress value={45} className="h-2" />
          
          <div className="flex justify-between items-center">
            <span className="font-medium">Cheese</span>
            <Badge variant={90 > 50 ? "default" : "destructive"}>90% in stock</Badge>
          </div>
          <Progress value={90} className="h-2" />
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Restocking Recommendations</h4>
          <ul className="space-y-2">
            <li className="flex justify-between">
              <span>Yogurt</span>
              <span className="text-red-500">Order 500 units</span>
            </li>
            <li className="flex justify-between">
              <span>Fresh Milk</span>
              <span className="text-yellow-500">Monitor closely</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryCoordination;