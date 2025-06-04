
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar, TrendingUp, Target } from 'lucide-react';

const CampaignManagement = () => {
  const [campaigns] = useState([
    {
      id: 1,
      name: "Summer Product Launch",
      status: "active",
      budget: "$45,000",
      spent: "$32,000",
      startDate: "2024-05-01",
      endDate: "2024-07-31",
      performance: "85%",
      channels: ["Digital", "Print", "Social Media"]
    },
    {
      id: 2,
      name: "Back to School Campaign",
      status: "planning",
      budget: "$28,000",
      spent: "$0",
      startDate: "2024-08-01",
      endDate: "2024-09-15",
      performance: "N/A",
      channels: ["Social Media", "Email", "Influencer"]
    },
    {
      id: 3,
      name: "Holiday Season Push",
      status: "completed",
      budget: "$65,000",
      spent: "$62,000",
      startDate: "2023-11-01",
      endDate: "2023-12-31",
      performance: "142%",
      channels: ["Digital", "TV", "Radio", "Social Media"]
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'planning': return 'bg-blue-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Campaign Management</h3>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Campaign
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{campaign.name}</CardTitle>
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium">Budget</p>
                      <p className="text-2xl font-bold">{campaign.budget}</p>
                      <p className="text-xs text-muted-foreground">Spent: {campaign.spent}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Duration</p>
                      <p className="text-sm">{campaign.startDate}</p>
                      <p className="text-sm">to {campaign.endDate}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Performance</p>
                      <p className="text-2xl font-bold">{campaign.performance}</p>
                      <p className="text-xs text-muted-foreground">vs target</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Channels</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {campaign.channels.map((channel, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {channel}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Campaign Performance Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">142%</p>
                  <p className="text-sm text-muted-foreground">Average ROI</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">78%</p>
                  <p className="text-sm text-muted-foreground">Conversion Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">2.4M</p>
                  <p className="text-sm text-muted-foreground">Total Reach</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Campaign Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Interactive campaign calendar would be implemented here, showing campaign schedules, 
                milestones, and key dates across all active and planned campaigns.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampaignManagement;
