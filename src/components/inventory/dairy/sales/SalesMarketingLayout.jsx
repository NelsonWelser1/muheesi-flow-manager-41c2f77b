
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import MarketingCampaigns from './MarketingCampaigns';
import SalesAnalytics from './SalesAnalytics';
import CustomerManagement from './CustomerManagement';

const SalesMarketingLayout = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState(null);

  if (activeTab === 'marketing') {
    return <MarketingCampaigns onBack={() => setActiveTab(null)} />;
  }
  
  if (activeTab === 'analytics') {
    return <SalesAnalytics onBack={() => setActiveTab(null)} />;
  }
  
  if (activeTab === 'customers') {
    return <CustomerManagement onBack={() => setActiveTab(null)} />;
  }

  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Sales & Marketing Dashboard</CardTitle>
          <CardDescription>
            Manage marketing campaigns, analytics, and customer relationships
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card 
            className="cursor-pointer hover:bg-slate-50" 
            onClick={() => setActiveTab('marketing')}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Marketing Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create and manage marketing campaigns
              </p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:bg-slate-50" 
            onClick={() => setActiveTab('analytics')}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Sales Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View sales performance and analytics
              </p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:bg-slate-50" 
            onClick={() => setActiveTab('customers')}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Customer Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Manage customer relationships
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesMarketingLayout;
