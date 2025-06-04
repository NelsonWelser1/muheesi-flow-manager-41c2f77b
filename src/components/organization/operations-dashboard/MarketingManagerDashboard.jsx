
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MarketingMetricsCards from './marketing-manager/MarketingMetricsCards';
import BrandManagement from './marketing-manager/BrandManagement';
import CampaignManagement from './marketing-manager/CampaignManagement';
import MarketResearch from './marketing-manager/MarketResearch';
import SocialMediaManagement from './marketing-manager/SocialMediaManagement';
import CustomerInsights from './marketing-manager/CustomerInsights';
import ContentStrategy from './marketing-manager/ContentStrategy';
import { Megaphone, TrendingUp, Users, Target, Share2, Lightbulb } from 'lucide-react';

const MarketingManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState('campaigns');

  const marketingTabs = [
    {
      id: 'campaigns',
      label: 'Campaign Management',
      icon: Megaphone,
      component: <CampaignManagement />
    },
    {
      id: 'brand',
      label: 'Brand Management',
      icon: Target,
      component: <BrandManagement />
    },
    {
      id: 'research',
      label: 'Market Research',
      icon: TrendingUp,
      component: <MarketResearch />
    },
    {
      id: 'social',
      label: 'Social Media',
      icon: Share2,
      component: <SocialMediaManagement />
    },
    {
      id: 'insights',
      label: 'Customer Insights',
      icon: Users,
      component: <CustomerInsights />
    },
    {
      id: 'content',
      label: 'Content Strategy',
      icon: Lightbulb,
      component: <ContentStrategy />
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Marketing Manager Dashboard</h2>
          <p className="text-muted-foreground">
            Drive brand growth through strategic marketing initiatives and customer engagement
          </p>
        </div>
        <Megaphone className="h-8 w-8 text-purple-600" />
      </div>

      <MarketingMetricsCards />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          {marketingTabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {marketingTabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default MarketingManagerDashboard;
