
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LogisticsMetricsCards from './logistics-manager/LogisticsMetricsCards';
import FleetManagement from './logistics-manager/FleetManagement';
import RouteOptimization from './logistics-manager/RouteOptimization';
import WarehouseOperations from './logistics-manager/WarehouseOperations';
import SupplyChainTracking from './logistics-manager/SupplyChainTracking';
import DeliveryScheduling from './logistics-manager/DeliveryScheduling';
import PerformanceAnalytics from './logistics-manager/PerformanceAnalytics';
import { Truck, MapPin, Package, BarChart3, Clock, Route } from 'lucide-react';

const LogisticsManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState('fleet');

  const logisticsTabs = [
    {
      id: 'fleet',
      label: 'Fleet Management',
      icon: Truck,
      component: <FleetManagement />
    },
    {
      id: 'routes',
      label: 'Route Optimization',
      icon: Route,
      component: <RouteOptimization />
    },
    {
      id: 'warehouse',
      label: 'Warehouse Ops',
      icon: Package,
      component: <WarehouseOperations />
    },
    {
      id: 'tracking',
      label: 'Supply Chain',
      icon: MapPin,
      component: <SupplyChainTracking />
    },
    {
      id: 'scheduling',
      label: 'Delivery Scheduling',
      icon: Clock,
      component: <DeliveryScheduling />
    },
    {
      id: 'analytics',
      label: 'Performance',
      icon: BarChart3,
      component: <PerformanceAnalytics />
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Logistics Manager Dashboard</h2>
          <p className="text-muted-foreground">
            Optimize supply chain operations, fleet management, and delivery efficiency
          </p>
        </div>
        <Truck className="h-8 w-8 text-blue-600" />
      </div>

      <LogisticsMetricsCards />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          {logisticsTabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {logisticsTabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default LogisticsManagerDashboard;
