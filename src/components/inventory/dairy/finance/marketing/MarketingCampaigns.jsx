import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CampaignForm from './components/CampaignForm';
import CampaignAnalytics from './components/CampaignAnalytics';
import PredictiveDemand from './components/PredictiveDemand';
import InventoryCoordination from './components/InventoryCoordination';

const MarketingCampaigns = () => {
  console.log('Rendering MarketingCampaigns component');

  return (
    <div className="space-y-6">
      <Tabs defaultValue="campaigns" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle>Create Campaign</CardTitle>
            </CardHeader>
            <CardContent>
              <CampaignForm />
            </CardContent>
          </Card>
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
    </div>
  );
};

export default MarketingCampaigns;