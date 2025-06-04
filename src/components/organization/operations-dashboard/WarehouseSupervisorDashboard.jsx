
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WarehouseMetricsCards from './warehouse-supervisor/WarehouseMetricsCards';
import InventoryManagement from './warehouse-supervisor/InventoryManagement';
import StockOperations from './warehouse-supervisor/StockOperations';
import WarehouseLayout from './warehouse-supervisor/WarehouseLayout';
import QualityControl from './warehouse-supervisor/QualityControl';
import StaffManagement from './warehouse-supervisor/StaffManagement';
import ReportsAnalytics from './warehouse-supervisor/ReportsAnalytics';
import { Warehouse, Package, Users, BarChart3, CheckCircle, MapPin } from 'lucide-react';

const WarehouseSupervisorDashboard = () => {
  const [activeTab, setActiveTab] = useState('inventory');

  const warehouseTabs = [
    {
      id: 'inventory',
      label: 'Inventory Management',
      icon: Package,
      component: <InventoryManagement />
    },
    {
      id: 'operations',
      label: 'Stock Operations',
      icon: Warehouse,
      component: <StockOperations />
    },
    {
      id: 'layout',
      label: 'Warehouse Layout',
      icon: MapPin,
      component: <WarehouseLayout />
    },
    {
      id: 'quality',
      label: 'Quality Control',
      icon: CheckCircle,
      component: <QualityControl />
    },
    {
      id: 'staff',
      label: 'Staff Management',
      icon: Users,
      component: <StaffManagement />
    },
    {
      id: 'reports',
      label: 'Reports & Analytics',
      icon: BarChart3,
      component: <ReportsAnalytics />
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Warehouse Supervisor Dashboard</h2>
          <p className="text-muted-foreground">
            Manage warehouse operations, inventory control, and staff coordination
          </p>
        </div>
        <Warehouse className="h-8 w-8 text-blue-600" />
      </div>

      <WarehouseMetricsCards />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          {warehouseTabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {warehouseTabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default WarehouseSupervisorDashboard;
