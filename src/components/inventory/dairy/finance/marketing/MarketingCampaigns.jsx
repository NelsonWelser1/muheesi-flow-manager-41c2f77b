import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import CampaignAnalytics from './components/CampaignAnalytics';
import PredictiveDemand from './components/PredictiveDemand';
import InventoryCoordination from './components/InventoryCoordination';

const MarketingCampaigns = () => {
  console.log('Rendering MarketingCampaigns component');
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting campaign form');
    toast({
      title: "Campaign Created",
      description: "Your marketing campaign has been successfully created.",
    });
  };

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
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="campaignName">Campaign Name</Label>
                    <Input id="campaignName" placeholder="Enter campaign name" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="campaignType">Campaign Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select campaign type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="discount">Discount</SelectItem>
                        <SelectItem value="bundle">Bundle Offer</SelectItem>
                        <SelectItem value="seasonal">Seasonal</SelectItem>
                        <SelectItem value="loyalty">Loyalty Program</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input id="startDate" type="date" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input id="endDate" type="date" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget (UGX)</Label>
                    <Input id="budget" type="number" placeholder="Enter budget amount" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetAudience">Target Audience</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select target audience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Customers</SelectItem>
                        <SelectItem value="new">New Customers</SelectItem>
                        <SelectItem value="loyal">Loyal Customers</SelectItem>
                        <SelectItem value="inactive">Inactive Customers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Campaign Description</Label>
                  <Input id="description" placeholder="Enter campaign description" />
                </div>

                <Button type="submit" className="w-full">Create Campaign</Button>
              </form>
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