
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FactoryMetricsCards from './factory-manager/FactoryMetricsCards';
import ProductionLineMonitoring from './factory-manager/ProductionLineMonitoring';
import QualityControlManagement from './factory-manager/QualityControlManagement';
import InventoryManagement from './factory-manager/InventoryManagement';
import MaintenanceScheduling from './factory-manager/MaintenanceScheduling';
import StaffManagement from './factory-manager/StaffManagement';
import FactoryReports from './factory-manager/FactoryReports';
import { Factory, Package, Users, Settings, BarChart3, Shield, Clock } from 'lucide-react';

const FactoryManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const factoryTabs = [
    {
      id: 'overview',
      label: 'Production Lines',
      icon: Factory,
      component: <ProductionLineMonitoring />
    },
    {
      id: 'quality',
      label: 'Quality Control',
      icon: Shield,
      component: <QualityControlManagement />
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: Package,
      component: <InventoryManagement />
    },
    {
      id: 'maintenance',
      label: 'Maintenance',
      icon: Settings,
      component: <MaintenanceScheduling />
    },
    {
      id: 'staff',
      label: 'Staff Management',
      icon: Users,
      component: <StaffManagement />
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: BarChart3,
      component: <FactoryReports />
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Factory Manager Dashboard</h2>
          <p className="text-muted-foreground">
            Oversee all factory operations, production lines, and quality standards
          </p>
        </div>
        <Factory className="h-8 w-8 text-blue-600" />
      </div>

      <FactoryMetricsCards />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          {factoryTabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {factoryTabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default FactoryManagerDashboard;
