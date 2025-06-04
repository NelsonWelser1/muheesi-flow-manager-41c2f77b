
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InventoryMetricsCards from './inventory-manager/InventoryMetricsCards';
import StockManagement from './inventory-manager/StockManagement';
import WarehouseControl from './inventory-manager/WarehouseControl';
import ProcurementPlanning from './inventory-manager/ProcurementPlanning';
import QualityAssurance from './inventory-manager/QualityAssurance';
import ReportingAnalytics from './inventory-manager/ReportingAnalytics';
import SupplierManagement from './inventory-manager/SupplierManagement';
import { Package, Warehouse, ShoppingCart, Shield, BarChart3, Users } from 'lucide-react';

const InventoryManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState('stock');

  const inventoryTabs = [
    {
      id: 'stock',
      label: 'Stock Management',
      icon: Package,
      component: <StockManagement />
    },
    {
      id: 'warehouse',
      label: 'Warehouse Control',
      icon: Warehouse,
      component: <WarehouseControl />
    },
    {
      id: 'procurement',
      label: 'Procurement',
      icon: ShoppingCart,
      component: <ProcurementPlanning />
    },
    {
      id: 'quality',
      label: 'Quality Assurance',
      icon: Shield,
      component: <QualityAssurance />
    },
    {
      id: 'suppliers',
      label: 'Suppliers',
      icon: Users,
      component: <SupplierManagement />
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      component: <ReportingAnalytics />
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inventory Manager Dashboard</h2>
          <p className="text-muted-foreground">
            Comprehensive inventory control, procurement, and quality management
          </p>
        </div>
        <Package className="h-8 w-8 text-green-600" />
      </div>

      <InventoryMetricsCards />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          {inventoryTabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {inventoryTabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default InventoryManagerDashboard;
