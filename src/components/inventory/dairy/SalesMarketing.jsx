
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, DollarSign, Megaphone, FileText } from "lucide-react";
import SalesMarketingLayout from './sales/SalesMarketingLayout';
import SalesDistributionForm from './sales/SalesDistributionForm';
import MarketingCampaignForm from './marketing/MarketingCampaignForm';
import SalesMarketingDashboard from './sales/SalesMarketingDashboard';

const SalesMarketing = ({ onBackToDashboard }) => {
  const [activeComponent, setActiveComponent] = useState(null);

  const handleBack = () => {
    setActiveComponent(null);
  };

  // Render the selected component or the menu
  const renderContent = () => {
    switch (activeComponent) {
      case 'layout':
        return <SalesMarketingLayout onBack={handleBack} />;
      case 'sales':
        return <SalesDistributionForm onBack={handleBack} />;
      case 'marketing':
        return <MarketingCampaignForm onBack={handleBack} />;
      case 'forms':
        return <SalesMarketingDashboard onBack={handleBack} />;
      default:
        return (
          <>
            <Button 
              variant="outline" 
              onClick={onBackToDashboard}
              className="flex items-center gap-2 mb-4"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Button>

            <Card>
              <CardHeader>
                <CardTitle>Sales & Marketing Dashboard</CardTitle>
                <CardDescription>
                  Manage sales records, marketing campaigns, and customer relationships
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card 
                    className="cursor-pointer hover:bg-slate-50 transition-colors" 
                    onClick={() => setActiveComponent('sales')}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-orange-500" />
                        Sales Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Record and track sales transactions and distribution
                      </p>
                    </CardContent>
                  </Card>

                  <Card 
                    className="cursor-pointer hover:bg-slate-50 transition-colors" 
                    onClick={() => setActiveComponent('marketing')}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Megaphone className="h-5 w-5 text-purple-500" />
                        Marketing Campaigns
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Create and manage marketing initiatives and campaigns
                      </p>
                    </CardContent>
                  </Card>

                  <Card 
                    className="cursor-pointer hover:bg-slate-50 transition-colors" 
                    onClick={() => setActiveComponent('forms')}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-500" />
                        Reports & Forms
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Generate sales proposals, contracts, and marketing reports
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </>
        );
    }
  };

  return (
    <div className="space-y-4">
      {renderContent()}
    </div>
  );
};

export default SalesMarketing;
