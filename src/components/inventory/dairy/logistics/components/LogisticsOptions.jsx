
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Package, Clock } from "lucide-react";

const LogisticsOptions = ({ activeDeliveries, delayedDeliveries, pendingOrders, avgDeliveryTime, onSelectOption }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card 
        className="hover:shadow-lg transition-shadow cursor-pointer" 
        onClick={() => onSelectOption('deliveries')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-medium">Deliveries</CardTitle>
          <Truck className="h-6 w-6 text-blue-600" />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Manage delivery schedules, vehicle assignments, and tracking
          </p>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="bg-blue-50 p-2 rounded-md">
              <div className="text-lg font-semibold">{activeDeliveries}</div>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
            <div className="bg-red-50 p-2 rounded-md">
              <div className="text-lg font-semibold">{delayedDeliveries}</div>
              <p className="text-xs text-muted-foreground">Delayed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card 
        className="hover:shadow-lg transition-shadow cursor-pointer" 
        onClick={() => onSelectOption('orders')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-medium">Orders</CardTitle>
          <Package className="h-6 w-6 text-green-600" />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Process customer orders, manage allocations and fulfillment
          </p>
          <div className="bg-green-50 p-2 rounded-md">
            <div className="text-lg font-semibold">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground">Pending Orders</p>
          </div>
        </CardContent>
      </Card>

      <Card 
        className="hover:shadow-lg transition-shadow cursor-pointer" 
        onClick={() => onSelectOption('performance')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-medium">Performance</CardTitle>
          <Clock className="h-6 w-6 text-purple-600" />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Track delivery time, efficiency metrics, and logistics analytics
          </p>
          <div className="bg-purple-50 p-2 rounded-md">
            <div className="text-lg font-semibold">{avgDeliveryTime}m</div>
            <p className="text-xs text-muted-foreground">Avg. Delivery Time</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogisticsOptions;
