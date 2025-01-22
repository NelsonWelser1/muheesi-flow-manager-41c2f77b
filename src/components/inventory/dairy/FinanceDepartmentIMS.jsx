import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import FinancialMetrics from './finance/dashboard/FinancialMetrics';
import SalesAnalytics from './finance/sales/SalesAnalytics';
import MarketingCampaigns from './finance/marketing/MarketingCampaigns';
import BudgetManagement from './finance/budgeting/BudgetManagement';

const FinanceDepartmentIMS = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid grid-cols-4 gap-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="sales">Sales Analytics</TabsTrigger>
            <TabsTrigger value="marketing">Marketing</TabsTrigger>
            <TabsTrigger value="budgeting">Budgeting</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <FinancialMetrics />
          </TabsContent>

          <TabsContent value="sales" className="space-y-4">
            <SalesAnalytics />
          </TabsContent>

          <TabsContent value="marketing" className="space-y-4">
            <MarketingCampaigns />
          </TabsContent>

          <TabsContent value="budgeting" className="space-y-4">
            <BudgetManagement />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FinanceDepartmentIMS;