
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCatalogForm from './forms/ProductCatalogForm';
import PricingSheetsForm from './forms/PricingSheetsForm';
import SalesProposalForm from './forms/SalesProposalForm';
import CustomerFeedbackForm from './forms/customer-feedback';
import CRMReportsForm from './forms/CRMReportsForm';
import AdvertisingPromotionForm from './forms/AdvertisingPromotionForm';
import SalesContractsForm from './forms/SalesContractsForm';
import ProductCataloguesDisplay from './forms/displays/ProductCataloguesDisplay';
import MarketingCampaignsDisplay from './forms/displays/MarketingCampaignsDisplay';
import SalesContractsDisplay from './forms/displays/SalesContractsDisplay';
import PricingSheetsDisplay from './forms/displays/PricingSheetsDisplay';
import SalesProposalsDisplay from './forms/displays/SalesProposalsDisplay';
import CustomerFeedbackDisplay from './forms/displays/CustomerFeedbackDisplay';
import CRMReportsDisplay from './forms/displays/CRMReportsDisplay';

const SalesMarketingLayout = ({
  onBack
}) => {
  const [activeView, setActiveView] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('forms');
  
  const handleBackToMenu = () => {
    setActiveView('dashboard');
  };

  const renderContent = () => {
    switch (activeView) {
      case 'product-catalog':
        return (
          <div className="space-y-4">
            <Button variant="outline" onClick={handleBackToMenu} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <ProductCatalogForm 
              onBack={handleBackToMenu} 
              onViewReports={() => setActiveView('view-product-catalogues')}
            />
          </div>
        );
      case 'pricing-sheets':
        return (
          <div className="space-y-4">
            <Button variant="outline" onClick={handleBackToMenu} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <PricingSheetsForm 
              onBack={handleBackToMenu} 
              onViewReports={() => setActiveView('view-pricing-sheets')}
            />
          </div>
        );
      case 'sales-proposal':
        return (
          <div className="space-y-4">
            <Button variant="outline" onClick={handleBackToMenu} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <SalesProposalForm 
              onBack={handleBackToMenu}
              onViewReports={() => setActiveView('view-sales-proposals')}
            />
          </div>
        );
      case 'customer-feedback':
        return (
          <div className="space-y-4">
            <Button variant="outline" onClick={handleBackToMenu} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <CustomerFeedbackForm 
              onBack={handleBackToMenu}
              onViewReports={() => setActiveView('view-customer-feedback')}
            />
          </div>
        );
      case 'crm-reports':
        return (
          <div className="space-y-4">
            <Button variant="outline" onClick={handleBackToMenu} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <CRMReportsForm 
              onBack={handleBackToMenu}
              onViewReports={() => setActiveView('view-crm-reports')}
            />
          </div>
        );
      case 'advertising-promotion':
        return (
          <div className="space-y-4">
            <Button variant="outline" onClick={handleBackToMenu} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <AdvertisingPromotionForm 
              onBack={handleBackToMenu}
              onViewReports={() => setActiveView('view-marketing-campaigns')}
            />
          </div>
        );
      case 'sales-contracts':
        return (
          <div className="space-y-4">
            <Button variant="outline" onClick={handleBackToMenu} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <SalesContractsForm 
              onBack={handleBackToMenu}
              onViewReports={() => setActiveView('view-sales-contracts')}
            />
          </div>
        );
      case 'view-product-catalogues':
        return <ProductCataloguesDisplay onBack={handleBackToMenu} />;
      case 'view-marketing-campaigns':
        return <MarketingCampaignsDisplay onBack={handleBackToMenu} />;
      case 'view-sales-contracts':
        return <SalesContractsDisplay onBack={handleBackToMenu} />;
      case 'view-pricing-sheets':
        return <PricingSheetsDisplay onBack={handleBackToMenu} />;
      case 'view-sales-proposals':
        return <SalesProposalsDisplay onBack={handleBackToMenu} />;
      case 'view-customer-feedback':
        return <CustomerFeedbackDisplay onBack={handleBackToMenu} />;
      case 'view-crm-reports':
        return <CRMReportsDisplay onBack={handleBackToMenu} />;
      case 'dashboard':
      default:
        return (
          <div className="grid gap-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-1">
                <TabsTrigger value="forms">Create Forms & View Reports</TabsTrigger>
              </TabsList>

              <TabsContent value="forms" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <MenuCard 
                    title="Product Catalogues" 
                    description="Create detailed product catalogues to showcase your dairy products" 
                    onClick={() => setActiveView('product-catalog')} 
                  />
                  <MenuCard 
                    title="Pricing Sheets" 
                    description="Create and manage pricing sheets for different products and customers" 
                    onClick={() => setActiveView('pricing-sheets')} 
                  />
                  <MenuCard 
                    title="Sales Proposals" 
                    description="Generate customized sales proposals for potential customers" 
                    onClick={() => setActiveView('sales-proposal')} 
                  />
                  <MenuCard 
                    title="Customer Feedback" 
                    description="Record and track customer feedback and satisfaction ratings" 
                    onClick={() => setActiveView('customer-feedback')} 
                  />
                  <MenuCard 
                    title="CRM Reports" 
                    description="Create and manage customer relationship reports and interactions" 
                    onClick={() => setActiveView('crm-reports')} 
                  />
                  <MenuCard 
                    title="Advertising & Promotion" 
                    description="Manage advertising assets and promotional campaigns" 
                    onClick={() => setActiveView('advertising-promotion')} 
                  />
                  <MenuCard 
                    title="Sales Contracts" 
                    description="Create and manage sales contracts and agreements" 
                    onClick={() => setActiveView('sales-contracts')} 
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        );
    }
  };

  return <div className="space-y-4">
      {renderContent()}
    </div>;
};

// Enhanced MenuCard component without the View Reports button (now moved inside forms)
const MenuCard = ({
  title,
  description,
  onClick,
}) => {
  return (
    <div className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-white flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="mt-4">
        <Button className="w-full" onClick={onClick}>Open Form</Button>
      </div>
    </div>
  );
};

export default SalesMarketingLayout;
