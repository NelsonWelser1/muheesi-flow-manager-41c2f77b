import React from 'react';
import { Card } from "@/components/ui/card";

const OrderMetrics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <div className="p-6">
          <div className="text-sm text-muted-foreground">Total Orders</div>
          <div className="text-2xl font-bold">21</div>
          <div className="text-xs text-green-600">↑ 25.2% last week</div>
        </div>
      </Card>
      <Card>
        <div className="p-6">
          <div className="text-sm text-muted-foreground">Order Items over time</div>
          <div className="text-2xl font-bold">15</div>
          <div className="text-xs text-green-600">↑ 18.2% last week</div>
        </div>
      </Card>
      <Card>
        <div className="p-6">
          <div className="text-sm text-muted-foreground">Returns Orders</div>
          <div className="text-2xl font-bold">0</div>
          <div className="text-xs text-red-600">↓ -1.2% last week</div>
        </div>
      </Card>
      <Card>
        <div className="p-6">
          <div className="text-sm text-muted-foreground">Fulfilled orders over time</div>
          <div className="text-2xl font-bold">12</div>
          <div className="text-xs text-green-600">↑ 12.2% last week</div>
        </div>
      </Card>
    </div>
  );
};

export default OrderMetrics;