
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
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

  // This function determines which report view to show based on the form type
  const handleViewReports = (formType) => {
    switch (formType) {
      case 'product-catalog':
        setActiveView('view-product-catalogues');
        break;
      case 'advertising-promotion':
        setActiveView('view-marketing-campaigns');
        break;
      case 'sales-contracts':
        setActiveView('view-sales-contracts');
        break;
      default:
        // For forms without specific reports yet, we'll just show a placeholder
        // In a real implementation, you would add the appropriate report view
        console.log(`View reports for ${formType} - not yet implemented`);
        break;
    }
  };
  
  const renderContent = () => {
    switch (activeView) {
      case 'product-catalog':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={handleBackToMenu} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleViewReports('product-catalog')}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" /> View Reports
              </Button>
            </div>
            <ProductCatalogForm onBack={handleBackToMenu} />
          </div>
        );
      case 'pricing-sheets':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={handleBackToMenu} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleViewReports('pricing-sheets')}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" /> View Reports
              </Button>
            </div>
            <PricingSheetsForm onBack={handleBackToMenu} />
          </div>
        );
      case 'sales-proposal':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={handleBackToMenu} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleViewReports('sales-proposal')}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" /> View Reports
              </Button>
            </div>
            <SalesProposalForm onBack={handleBackToMenu} />
          </div>
        );
      case 'customer-feedback':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={handleBackToMenu} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleViewReports('customer-feedback')}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" /> View Reports
              </Button>
            </div>
            <CustomerFeedbackForm onBack={handleBackToMenu} />
          </div>
        );
      case 'crm-reports':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={handleBackToMenu} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleViewReports('crm-reports')}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" /> View Reports
              </Button>
            </div>
            <CRMReportsForm onBack={handleBackToMenu} />
          </div>
        );
      case 'advertising-promotion':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={handleBackToMenu} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleViewReports('advertising-promotion')}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" /> View Reports
              </Button>
            </div>
            <AdvertisingPromotionForm onBack={handleBackToMenu} />
          </div>
        );
      case 'sales-contracts':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={handleBackToMenu} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleViewReports('sales-contracts')}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" /> View Reports
              </Button>
            </div>
            <SalesContractsForm onBack={handleBackToMenu} />
          </div>
        );
      case 'view-product-catalogues':
        return <ProductCataloguesDisplay onBack={handleBackToMenu} />;
      case 'view-marketing-campaigns':
        return <MarketingCampaignsDisplay onBack={handleBackToMenu} />;
      case 'view-sales-contracts':
        return <SalesContractsDisplay onBack={handleBackToMenu} />;
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
                    hasReport={true}
                    onViewReport={() => setActiveView('view-product-catalogues')}
                  />
                  <MenuCard 
                    title="Pricing Sheets" 
                    description="Create and manage pricing sheets for different products and customers" 
                    onClick={() => setActiveView('pricing-sheets')} 
                    hasReport={false}
                  />
                  <MenuCard 
                    title="Sales Proposals" 
                    description="Generate customized sales proposals for potential customers" 
                    onClick={() => setActiveView('sales-proposal')} 
                    hasReport={false}
                  />
                  <MenuCard 
                    title="Customer Feedback" 
                    description="Record and track customer feedback and satisfaction ratings" 
                    onClick={() => setActiveView('customer-feedback')} 
                    hasReport={false}
                  />
                  <MenuCard 
                    title="CRM Reports" 
                    description="Create and manage customer relationship reports and interactions" 
                    onClick={() => setActiveView('crm-reports')} 
                    hasReport={false}
                  />
                  <MenuCard 
                    title="Advertising & Promotion" 
                    description="Manage advertising assets and promotional campaigns" 
                    onClick={() => setActiveView('advertising-promotion')} 
                    hasReport={true}
                    onViewReport={() => setActiveView('view-marketing-campaigns')}
                  />
                  <MenuCard 
                    title="Sales Contracts" 
                    description="Create and manage sales contracts and agreements" 
                    onClick={() => setActiveView('sales-contracts')} 
                    hasReport={true}
                    onViewReport={() => setActiveView('view-sales-contracts')}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        );
    }
  };

  return <div className="space-y-4">
      {activeView === 'dashboard'}

      {renderContent()}
    </div>;
};

// Enhanced MenuCard component with optional "View Reports" button
const MenuCard = ({
  title,
  description,
  onClick,
  hasReport = false,
  onViewReport
}) => {
  return (
    <div className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-white flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="mt-4 flex flex-col space-y-2">
        <Button className="w-full" onClick={onClick}>Open Form</Button>
        {hasReport && (
          <Button variant="outline" className="w-full flex items-center justify-center gap-2" onClick={onViewReport}>
            <FileText className="h-4 w-4" /> View Reports
          </Button>
        )}
      </div>
    </div>
  );
};

export default SalesMarketingLayout;
