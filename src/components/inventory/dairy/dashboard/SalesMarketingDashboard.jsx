
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useSalesDashboardData from './hooks/useSalesDashboardData';
import SalesDashboardContent from './components/SalesDashboardContent';
import { Skeleton } from "@/components/ui/skeleton";

const SalesMarketingDashboard = () => {
  const { salesData, campaignData, isLoading, error } = useSalesDashboardData();

  if (error) {
    return <div className="text-center py-8 text-red-500">Error loading dashboard: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sales">Sales Dashboard</TabsTrigger>
          <TabsTrigger value="marketing">Marketing Campaigns</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-[300px] w-full" />
              <Skeleton className="h-[200px] w-full" />
            </div>
          ) : (
            <SalesDashboardContent salesData={salesData} />
          )}
        </TabsContent>
        
        <TabsContent value="marketing" className="space-y-4">
          {isLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : campaignData.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Active Marketing Campaigns</h3>
              <div className="grid gap-4">
                {campaignData.map(campaign => (
                  <div key={campaign.id} className="p-4 border rounded-md">
                    <h4 className="font-bold">{campaign.campaign_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(campaign.start_date).toLocaleDateString()} - 
                      {new Date(campaign.end_date).toLocaleDateString()}
                    </p>
                    <p>Platform: {campaign.platform}</p>
                    <p>Budget: ${campaign.budget}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p>No active marketing campaigns found.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesMarketingDashboard;
