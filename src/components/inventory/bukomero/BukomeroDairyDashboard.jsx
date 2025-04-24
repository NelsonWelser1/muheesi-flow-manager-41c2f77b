import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OverviewDashboardContent from "./dashboard/OverviewDashboardContent";
import CattleDashboardContent from "./dashboard/CattleDashboardContent";
import MilkProductionDashboardContent from "./dashboard/MilkProductionDashboardContent";
import AnalyticsDashboardContent from "./dashboard/AnalyticsDashboardContent";
import PersonnelDashboardContent from "./dashboard/PersonnelDashboardContent";
import LogisticsDashboardContent from "./dashboard/LogisticsDashboardContent";
import FinanceDashboardContent from "./dashboard/FinanceDashboardContent";

const BukomeroDairyDashboard = () => {
  return (
    <div className="space-y-6 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <Tabs defaultValue="overview">
        <TabsList className="flex flex-wrap gap-1 bg-green-50 p-1 overflow-x-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cattle">Cattle</TabsTrigger>
          <TabsTrigger value="milk">Milk</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="personnel">Personnel</TabsTrigger>
          <TabsTrigger value="logistics">Logistics</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewDashboardContent />
        </TabsContent>

        <TabsContent value="cattle">
          <CattleDashboardContent />
        </TabsContent>

        <TabsContent value="milk">
          <MilkProductionDashboardContent />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsDashboardContent />
        </TabsContent>

        <TabsContent value="personnel">
          <PersonnelDashboardContent />
        </TabsContent>

        <TabsContent value="logistics">
          <LogisticsDashboardContent />
        </TabsContent>

        <TabsContent value="finance">
          <FinanceDashboardContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BukomeroDairyDashboard;
