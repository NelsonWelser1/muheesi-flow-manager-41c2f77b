import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Overview from './dashboard/Overview';
import MilkProduction from './dashboard/MilkProduction';
import CattleManagement from './dashboard/CattleManagement';
import FinancialRecords from './dashboard/FinancialRecords';
import ReportsAnalytics from './dashboard/ReportsAnalytics';

const BukomeroDairyDashboard = () => {
  return (
    <div className="space-y-6 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4 text-sm">
        <p className="font-medium text-yellow-800">
          Data Entry Terminal: All information entered here will be shared with Kyalima Farmers Limited Executive Management for strategic decision-making.
        </p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="flex flex-wrap gap-1 bg-green-50 p-1 overflow-x-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="milkProduction">Milk Production</TabsTrigger>
          <TabsTrigger value="cattleManagement">Cattle Management</TabsTrigger>
          <TabsTrigger value="financialRecords">Financial Records</TabsTrigger>
          <TabsTrigger value="reportsAnalytics">Reports & Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Overview />
        </TabsContent>

        <TabsContent value="milkProduction">
          <MilkProduction />
        </TabsContent>

        <TabsContent value="cattleManagement">
          <CattleManagement />
        </TabsContent>

        <TabsContent value="financialRecords">
          <FinancialRecords />
        </TabsContent>

        <TabsContent value="reportsAnalytics">
          <ReportsAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BukomeroDairyDashboard;
