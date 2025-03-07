
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useSalesDashboardData from './hooks/useSalesDashboardData';
import SalesDashboardContent from './components/SalesDashboardContent';

const SalesMarketingDashboard = () => {
  const { salesData, isLoading, error } = useSalesDashboardData();

  if (isLoading) {
    return <div className="text-center py-8">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error loading dashboard: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="sales">Sales Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <SalesDashboardContent salesData={salesData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesMarketingDashboard;
