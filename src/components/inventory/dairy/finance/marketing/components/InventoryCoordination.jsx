import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Package } from "lucide-react";

const InventoryCoordination = () => {
  console.log('Rendering InventoryCoordination component');

  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Campaign Impact Alert</AlertTitle>
        <AlertDescription>
          Current "Summer Sale" campaign is affecting inventory levels. 
          Some products require restocking within the next 7 days.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Campaign-Driven Inventory Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Package className="h-4 w-4 mr-2" />
                <span className="font-medium">Fresh Milk</span>
              </div>
              <Badge variant={75 > 50 ? "default" : "destructive"}>75% in stock</Badge>
            </div>
            <Progress value={75} className="h-2" />
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Package className="h-4 w-4 mr-2" />
                <span className="font-medium">Yogurt</span>
              </div>
              <Badge variant={45 > 50 ? "default" : "destructive"}>45% in stock</Badge>
            </div>
            <Progress value={45} className="h-2" />
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Package className="h-4 w-4 mr-2" />
                <span className="font-medium">Cheese</span>
              </div>
              <Badge variant={90 > 50 ? "default" : "destructive"}>90% in stock</Badge>
            </div>
            <Progress value={90} className="h-2" />
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-4">Restocking Recommendations</h4>
            <ul className="space-y-4">
              <li className="flex justify-between items-center">
                <span>Yogurt</span>
                <span className="text-red-500 font-medium">Order 500 units</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Fresh Milk</span>
                <span className="text-yellow-500 font-medium">Monitor closely</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Cheese</span>
                <span className="text-green-500 font-medium">Stock adequate</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Campaign Impact Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex justify-between items-center">
                <span>Total Products Affected</span>
                <Badge>8 products</Badge>
              </li>
              <li className="flex justify-between items-center">
                <span>Critical Stock Alerts</span>
                <Badge variant="destructive">2 products</Badge>
              </li>
              <li className="flex justify-between items-center">
                <span>Pending Restocks</span>
                <Badge variant="secondary">3 orders</Badge>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex justify-between items-center">
                <span>Yogurt Restock</span>
                <Badge variant="outline">Expected in 3 days</Badge>
              </li>
              <li className="flex justify-between items-center">
                <span>Fresh Milk Restock</span>
                <Badge variant="outline">Expected in 5 days</Badge>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InventoryCoordination;