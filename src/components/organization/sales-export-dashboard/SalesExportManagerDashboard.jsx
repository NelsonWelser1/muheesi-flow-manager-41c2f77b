
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SalesExportMetricsCards from './sales-export-manager/SalesExportMetricsCards';
import SalesManagement from './sales-export-manager/SalesManagement';
import ExportOperations from './sales-export-manager/ExportOperations';
import CustomerRelationship from './sales-export-manager/CustomerRelationship';
import MarketAnalysis from './sales-export-manager/MarketAnalysis';
import DocumentationCompliance from './sales-export-manager/DocumentationCompliance';
import PerformanceTracking from './sales-export-manager/PerformanceTracking';
import { Globe, TrendingUp, Users, FileText, BarChart3, Shield, Target } from 'lucide-react';

const SalesExportManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState('sales');

  const salesExportTabs = [
    {
      id: 'sales',
      label: 'Sales Management',
      icon: TrendingUp,
      component: <SalesManagement />
    },
    {
      id: 'export',
      label: 'Export Operations',
      icon: Globe,
      component: <ExportOperations />
    },
    {
      id: 'customers',
      label: 'Customer Relations',
      icon: Users,
      component: <CustomerRelationship />
    },
    {
      id: 'market',
      label: 'Market Analysis',
      icon: BarChart3,
      component: <MarketAnalysis />
    },
    {
      id: 'documentation',
      label: 'Documentation',
      icon: FileText,
      component: <DocumentationCompliance />
    },
    {
      id: 'performance',
      label: 'Performance',
      icon: Target,
      component: <PerformanceTracking />
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Sales & Export Manager Dashboard</h2>
          <p className="text-muted-foreground">
            Manage sales operations, export processes, and international market development
          </p>
        </div>
        <Globe className="h-8 w-8 text-blue-600" />
      </div>

      <SalesExportMetricsCards />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          {salesExportTabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {salesExportTabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default SalesExportManagerDashboard;
