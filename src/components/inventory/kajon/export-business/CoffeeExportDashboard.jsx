import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import MetricsCards from './dashboard/MetricsCards';
import Charts from './dashboard/Charts';
import SourcingProcurement from './SourcingProcurement';
import HullingGrading from './HullingGrading';
import LogisticsShipping from './LogisticsShipping';
import FinancialManagement from './FinancialManagement';
import OrderManagement from './OrderManagement';

const mockData = {
  sourcing: [
    { month: 'Jan', arabica: 4000, robusta: 2400 },
    { month: 'Feb', arabica: 3000, robusta: 1398 },
    { month: 'Mar', arabica: 2000, robusta: 9800 },
    { month: 'Apr', arabica: 2780, robusta: 3908 },
  ],
  financial: [
    { month: 'Jan', revenue: 4000, expenses: 2400 },
    { month: 'Feb', revenue: 3000, expenses: 1398 },
    { month: 'Mar', revenue: 2000, expenses: 9800 },
    { month: 'Apr', revenue: 2780, expenses: 3908 },
  ]
};

const Dashboard = () => {
  const { data: dashboardData } = useQuery({
    queryKey: ['exportDashboard'],
    queryFn: () => Promise.resolve(mockData),
  });

  return (
    <div className="space-y-6">
      <MetricsCards />
      <Charts data={dashboardData} />
    </div>
  );
};

const CoffeeExportDashboard = () => {
  return (
    <Tabs defaultValue="dashboard" className="w-full">
      <TabsList className="w-full justify-start overflow-x-auto">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="sourcing">Sourcing & Procurement</TabsTrigger>
        <TabsTrigger value="hulling">Hulling & Grading</TabsTrigger>
        <TabsTrigger value="logistics">Logistics & Shipping</TabsTrigger>
        <TabsTrigger value="financial">Financial Management</TabsTrigger>
        <TabsTrigger value="orders">Order Management</TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard">
        <Dashboard />
      </TabsContent>

      <TabsContent value="sourcing">
        <SourcingProcurement />
      </TabsContent>

      <TabsContent value="hulling">
        <HullingGrading />
      </TabsContent>

      <TabsContent value="logistics">
        <LogisticsShipping />
      </TabsContent>

      <TabsContent value="financial">
        <FinancialManagement />
      </TabsContent>

      <TabsContent value="orders">
        <OrderManagement />
      </TabsContent>
    </Tabs>
  );
};

export default CoffeeExportDashboard;