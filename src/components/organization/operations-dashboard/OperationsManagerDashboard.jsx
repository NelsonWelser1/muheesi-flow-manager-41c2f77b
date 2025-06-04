
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OperationsMetricsCards from './OperationsMetricsCards';
import ProductionOverview from './ProductionOverview';
import InventoryOverview from './InventoryOverview';
import ProcessOptimization from './ProcessOptimization';
import QualityManagement from './QualityManagement';
import ResourceAllocation from './ResourceAllocation';
import OperationsReports from './OperationsReports';
import { Factory, Package, TrendingUp, Users, Settings, BarChart3 } from 'lucide-react';

const OperationsManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const operationsTabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: BarChart3,
      component: <ProductionOverview />
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: Package,
      component: <InventoryOverview />
    },
    {
      id: 'quality',
      label: 'Quality',
      icon: TrendingUp,
      component: <QualityManagement />
    },
    {
      id: 'optimization',
      label: 'Process Optimization',
      icon: Settings,
      component: <ProcessOptimization />
    },
    {
      id: 'resources',
      label: 'Resources',
      icon: Users,
      component: <ResourceAllocation />
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: BarChart3,
      component: <OperationsReports />
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Operations Manager Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor and optimize production, inventory, and operational processes
          </p>
        </div>
        <Factory className="h-8 w-8 text-blue-600" />
      </div>

      <OperationsMetricsCards />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          {operationsTabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {operationsTabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default OperationsManagerDashboard;
