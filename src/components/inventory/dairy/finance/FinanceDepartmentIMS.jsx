import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import FinancialMetrics from './dashboard/FinancialMetrics';
import SalesAnalytics from './sales/SalesAnalytics';
import MarketingCampaigns from './marketing/MarketingCampaigns';
import BudgetManagement from './budgeting/BudgetManagement';

const FinanceDepartmentIMS = () => {
  console.log('Rendering FinanceDepartmentIMS component');

  return (
    <Card>
      <CardContent className="p-6">
        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="sales">Sales Analytics</TabsTrigger>
            <TabsTrigger value="marketing">Marketing</TabsTrigger>
            <TabsTrigger value="budgeting">Budgeting</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <FinancialMetrics />
          </TabsContent>

          <TabsContent value="sales">
            <SalesAnalytics />
          </TabsContent>

          <TabsContent value="marketing">
            <MarketingCampaigns />
          </TabsContent>

          <TabsContent value="budgeting">
            <BudgetManagement />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FinanceDepartmentIMS;