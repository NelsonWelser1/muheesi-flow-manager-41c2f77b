import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MarketingCampaigns from './MarketingCampaigns';
import CampaignAnalytics from './CampaignAnalytics';
import PredictiveDemand from './PredictiveDemand';
import InventoryCoordination from './InventoryCoordination';
import { useToast } from "@/components/ui/use-toast";

const MarketingDashboard = () => {
  console.log('Rendering MarketingDashboard');
  const { toast } = useToast();

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Marketing Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="campaigns" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="predictions">Predictions</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
            </TabsList>

            <TabsContent value="campaigns">
              <MarketingCampaigns />
            </TabsContent>

            <TabsContent value="analytics">
              <CampaignAnalytics />
            </TabsContent>

            <TabsContent value="predictions">
              <PredictiveDemand />
            </TabsContent>

            <TabsContent value="inventory">
              <InventoryCoordination />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketingDashboard;