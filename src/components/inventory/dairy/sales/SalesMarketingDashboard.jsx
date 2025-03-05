
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SalesAnalytics from './SalesAnalytics';
import CustomerManagement from './CustomerManagement';
import ProductCatalogForm from './forms/ProductCatalogForm';
import PricingSheetsForm from './forms/PricingSheetsForm';
import SalesProposalForm from './forms/SalesProposalForm';
import CustomerFeedbackForm from './forms/customer-feedback';
import CRMReportsForm from './forms/CRMReportsForm';
import AdvertisingPromotionForm from './forms/AdvertisingPromotionForm';
import SalesContractForm from './forms/SalesContractForm';
import MarketingCampaignForm from './forms/MarketingCampaignForm';
import SalesDistributionForm from './SalesDistributionForm';

const SalesMarketingDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [activeForm, setActiveForm] = useState(null);

  const handleBackFromForm = () => {
    setActiveForm(null);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sales & Marketing Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          {activeForm ? (
            <>
              {activeForm === 'product-catalog' && <ProductCatalogForm onBack={handleBackFromForm} />}
              {activeForm === 'pricing-sheets' && <PricingSheetsForm onBack={handleBackFromForm} />}
              {activeForm === 'sales-proposal' && <SalesProposalForm onBack={handleBackFromForm} />}
              {activeForm === 'customer-feedback' && <CustomerFeedbackForm onBack={handleBackFromForm} />}
              {activeForm === 'crm-reports' && <CRMReportsForm onBack={handleBackFromForm} />}
              {activeForm === 'advertising-promotion' && <AdvertisingPromotionForm onBack={handleBackFromForm} />}
              {activeForm === 'sales-contract' && <SalesContractForm onBack={handleBackFromForm} />}
              {activeForm === 'marketing-campaign' && <MarketingCampaignForm onBack={handleBackFromForm} />}
              {activeForm === 'sales-distribution' && <SalesDistributionForm onBack={handleBackFromForm} />}
            </>
          ) : (
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="customers">Customer Management</TabsTrigger>
                <TabsTrigger value="forms">Forms & Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="analytics">
                <SalesAnalytics />
              </TabsContent>

              <TabsContent value="customers">
                <CustomerManagement />
              </TabsContent>

              <TabsContent value="forms">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { id: 'product-catalog', title: 'Product Catalog', description: 'Manage and update product catalogs' },
                    { id: 'pricing-sheets', title: 'Pricing Sheets', description: 'Create and update pricing information' },
                    { id: 'sales-proposal', title: 'Sales Proposals', description: 'Generate and manage sales proposals' },
                    { id: 'customer-feedback', title: 'Customer Feedback', description: 'Record and track customer feedback' },
                    { id: 'crm-reports', title: 'CRM Reports', description: 'Generate customer relationship reports' },
                    { id: 'advertising-promotion', title: 'Advertising & Promotion', description: 'Manage marketing campaigns' },
                    { id: 'sales-contract', title: 'Sales Contracts', description: 'Create and manage sales contracts' },
                    { id: 'marketing-campaign', title: 'Marketing Campaigns', description: 'Plan and track marketing initiatives' },
                    { id: 'sales-distribution', title: 'Sales Distribution', description: 'Manage sales transactions and distribution' }
                  ].map((form) => (
                    <Card key={form.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveForm(form.id)}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{form.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{form.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesMarketingDashboard;
