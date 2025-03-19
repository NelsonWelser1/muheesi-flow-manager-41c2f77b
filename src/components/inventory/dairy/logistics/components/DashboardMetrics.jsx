
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Truck, Package, Clock, AlertTriangle } from "lucide-react";

const DashboardMetrics = ({ activeDeliveries, pendingOrders, avgDeliveryTime, delayedDeliveries }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Deliveries</CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeDeliveries}</div>
          <p className="text-xs text-muted-foreground">{Math.round(activeDeliveries * 0.7)} in transit</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingOrders}</div>
          <p className="text-xs text-muted-foreground">Awaiting processing</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Delivery Time</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgDeliveryTime}m</div>
          <p className="text-xs text-muted-foreground">Based on last 100 deliveries</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Delayed Deliveries</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{delayedDeliveries}</div>
          <p className="text-xs text-muted-foreground">
            {delayedDeliveries > 0 ? 'Action required' : 'No delays'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardMetrics;
