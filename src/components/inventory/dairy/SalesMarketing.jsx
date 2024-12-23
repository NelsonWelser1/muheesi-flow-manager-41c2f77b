import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MarketingCampaigns from './sales/MarketingCampaigns';
import SalesAnalytics from './sales/SalesAnalytics';
import CustomerManagement from './sales/CustomerManagement';

const SalesMarketing = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sales & Marketing Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="campaigns" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="campaigns">Marketing Campaigns</TabsTrigger>
            <TabsTrigger value="analytics">Sales Analytics</TabsTrigger>
            <TabsTrigger value="customers">Customer Management</TabsTrigger>
          </TabsList>
          <TabsContent value="campaigns">
            <MarketingCampaigns />
          </TabsContent>
          <TabsContent value="analytics">
            <SalesAnalytics />
          </TabsContent>
          <TabsContent value="customers">
            <CustomerManagement />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SalesMarketing;