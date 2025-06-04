
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, RotateCcw, Truck } from 'lucide-react';

const StockOperations = () => {
  const recentOperations = [
    { id: 1, type: 'Inbound', item: 'Coffee Beans - Arabica', quantity: 500, time: '2 hours ago' },
    { id: 2, type: 'Outbound', item: 'Export Bags', quantity: 200, time: '4 hours ago' },
    { id: 3, type: 'Transfer', item: 'Packaging Materials', quantity: 100, time: '6 hours ago' },
    { id: 4, type: 'Adjustment', item: 'Coffee Beans - Robusta', quantity: -25, time: '1 day ago' }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">Stock Operations</h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <ArrowDown className="h-8 w-8 text-green-600 mb-2" />
            <h4 className="font-semibold">Receive Stock</h4>
            <p className="text-sm text-muted-foreground text-center">Process incoming inventory</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <ArrowUp className="h-8 w-8 text-blue-600 mb-2" />
            <h4 className="font-semibold">Ship Stock</h4>
            <p className="text-sm text-muted-foreground text-center">Process outgoing orders</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <RotateCcw className="h-8 w-8 text-orange-600 mb-2" />
            <h4 className="font-semibold">Transfer Stock</h4>
            <p className="text-sm text-muted-foreground text-center">Move between locations</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Truck className="h-8 w-8 text-purple-600 mb-2" />
            <h4 className="font-semibold">Schedule Delivery</h4>
            <p className="text-sm text-muted-foreground text-center">Plan shipment logistics</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Operations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOperations.map((operation) => (
              <div key={operation.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    operation.type === 'Inbound' ? 'bg-green-500' :
                    operation.type === 'Outbound' ? 'bg-blue-500' :
                    operation.type === 'Transfer' ? 'bg-orange-500' :
                    'bg-gray-500'
                  }`} />
                  <div>
                    <p className="font-medium">{operation.type} - {operation.item}</p>
                    <p className="text-sm text-muted-foreground">Quantity: {operation.quantity}</p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">{operation.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockOperations;
