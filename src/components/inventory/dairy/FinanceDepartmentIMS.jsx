import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import FinancialMetrics from './finance/dashboard/FinancialMetrics';
import SalesAnalytics from './finance/sales/SalesAnalytics';
import MarketingCampaigns from './finance/marketing/MarketingCampaigns';
import BudgetManagement from './finance/budgeting/BudgetManagement';

const FinanceDepartmentIMS = () => {
  return (
    <div className="space-y-6">
      <FinancialMetrics />

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="budgeting">Budgeting</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SalesAnalytics />
            <BudgetManagement />
          </div>
        </TabsContent>

        <TabsContent value="sales">
          <Card>
            <CardContent className="pt-6">
              <SalesAnalytics />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketing">
          <MarketingCampaigns />
        </TabsContent>

        <TabsContent value="budgeting">
          <BudgetManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinanceDepartmentIMS;