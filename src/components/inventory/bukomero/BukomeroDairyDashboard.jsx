
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BukomeroCattle from "./sections/Cattle";
import BukomeroMilkProduction from "./sections/MilkProduction";
import BukomeroAnalytics from "./sections/Analytics";
import BukomeroPersonnel from "./sections/Personnel";
import BukomeroLogistics from "./sections/Logistics";
import BukomeroOverview from "./sections/Overview";
import BukomeroFinance from "./sections/Finance"; // Add import for the Finance section

const BukomeroDairyDashboard = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview">
        <TabsList className="grid grid-cols-7 gap-1 bg-green-50 p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger> {/* New Finance tab */}
          <TabsTrigger value="cattle">Cattle</TabsTrigger>
          <TabsTrigger value="milk">Milk Production</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="personnel">Personnel</TabsTrigger>
          <TabsTrigger value="logistics">Logistics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <BukomeroOverview />
        </TabsContent>
        
        <TabsContent value="finance">
          <BukomeroFinance />
        </TabsContent>

        <TabsContent value="cattle">
          <BukomeroCattle />
        </TabsContent>

        <TabsContent value="milk">
          <BukomeroMilkProduction />
        </TabsContent>

        <TabsContent value="analytics">
          <BukomeroAnalytics />
        </TabsContent>

        <TabsContent value="personnel">
          <BukomeroPersonnel />
        </TabsContent>

        <TabsContent value="logistics">
          <BukomeroLogistics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BukomeroDairyDashboard;
