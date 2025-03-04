import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCatalogForm from './forms/ProductCatalogForm';
import PricingSheetsForm from './forms/PricingSheetsForm';
import SalesProposalForm from './forms/SalesProposalForm';
import CustomerFeedbackForm from './forms/CustomerFeedbackForm';
import CRMReportsForm from './forms/CRMReportsForm';
import AdvertisingPromotionForm from './forms/AdvertisingPromotionForm';
import SalesContractsForm from './forms/SalesContractsForm';
import ProductCataloguesDisplay from './forms/displays/ProductCataloguesDisplay';
import MarketingCampaignsDisplay from './forms/displays/MarketingCampaignsDisplay';
import SalesContractsDisplay from './forms/displays/SalesContractsDisplay';
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
        return <ProductCatalogForm onBack={handleBackToMenu} />;
      case 'pricing-sheets':
        return <PricingSheetsForm onBack={handleBackToMenu} />;
      case 'sales-proposal':
        return <SalesProposalForm onBack={handleBackToMenu} />;
      case 'customer-feedback':
        return <CustomerFeedbackForm onBack={handleBackToMenu} />;
      case 'crm-reports':
        return <CRMReportsForm onBack={handleBackToMenu} />;
      case 'advertising-promotion':
        return <AdvertisingPromotionForm onBack={handleBackToMenu} />;
      case 'sales-contracts':
        return <SalesContractsForm onBack={handleBackToMenu} />;
      case 'view-product-catalogues':
        return <ProductCataloguesDisplay onBack={handleBackToMenu} />;
      case 'view-marketing-campaigns':
        return <MarketingCampaignsDisplay onBack={handleBackToMenu} />;
      case 'view-sales-contracts':
        return <SalesContractsDisplay onBack={handleBackToMenu} />;
      case 'dashboard':
      default:
        return <div className="grid gap-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="forms">Create Forms</TabsTrigger>
                <TabsTrigger value="reports">View Reports</TabsTrigger>
              </TabsList>

              <TabsContent value="forms" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <MenuCard title="Product Catalogues" description="Create detailed product catalogues to showcase your dairy products" onClick={() => setActiveView('product-catalog')} />
                  <MenuCard title="Pricing Sheets" description="Create and manage pricing sheets for different products and customers" onClick={() => setActiveView('pricing-sheets')} />
                  <MenuCard title="Sales Proposals" description="Generate customized sales proposals for potential customers" onClick={() => setActiveView('sales-proposal')} />
                  <MenuCard title="Customer Feedback" description="Record and track customer feedback and satisfaction ratings" onClick={() => setActiveView('customer-feedback')} />
                  <MenuCard title="CRM Reports" description="Create and manage customer relationship reports and interactions" onClick={() => setActiveView('crm-reports')} />
                  <MenuCard title="Advertising & Promotion" description="Manage advertising assets and promotional campaigns" onClick={() => setActiveView('advertising-promotion')} />
                  <MenuCard title="Sales Contracts" description="Create and manage sales contracts and agreements" onClick={() => setActiveView('sales-contracts')} />
                </div>
              </TabsContent>

              <TabsContent value="reports" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <MenuCard title="View Product Catalogues" description="Browse and search through all product catalogues" onClick={() => setActiveView('view-product-catalogues')} />
                  <MenuCard title="View Marketing Campaigns" description="Browse and analyze all marketing campaigns and their performance" onClick={() => setActiveView('view-marketing-campaigns')} />
                  <MenuCard title="View Sales Contracts" description="Browse and manage all sales contracts and their status" onClick={() => setActiveView('view-sales-contracts')} />
                </div>
              </TabsContent>
            </Tabs>
          </div>;
    }
  };
  return <div className="space-y-4">
      {activeView === 'dashboard'}

      {renderContent()}
    </div>;
};

// Helper component for menu cards
const MenuCard = ({
  title,
  description,
  onClick
}) => {
  return <div className="border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer bg-white flex flex-col justify-between" onClick={onClick}>
      <div>
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Button className="mt-4 w-full">Open</Button>
    </div>;
};
export default SalesMarketingLayout;