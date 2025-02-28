
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  BookOpen, 
  Target, 
  Users, 
  TrendingUp, 
  DollarSign, 
  FileContract, 
  ClipboardList,
  Menu
} from 'lucide-react';
import SalesProposalsForm from './forms/SalesProposalsForm';
import ProductCataloguesForm from './forms/ProductCataloguesForm';
import MarketingCampaignForm from './forms/MarketingCampaignForm';
import CRMReportsForm from './forms/CRMReportsForm';
import AdvertisingPromotionForm from './forms/AdvertisingPromotionForm';
import PricingSheetsForm from './forms/PricingSheetsForm';
import SalesContractsForm from './forms/SalesContractsForm';
import CustomerFeedbackForm from './forms/CustomerFeedbackForm';
import SalesDistributionForm from './SalesDistributionForm';

const SalesMarketingLayout = ({ onBack }) => {
  const [activeForm, setActiveForm] = useState('sales-distribution');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const forms = [
    { 
      id: 'sales-distribution', 
      name: 'Sales & Distribution',
      icon: <TrendingUp className="w-4 h-4 mr-2" />
    },
    { 
      id: 'sales-proposals', 
      name: 'Sales Proposals/Quotations',
      icon: <FileText className="w-4 h-4 mr-2" />
    },
    { 
      id: 'product-catalogues', 
      name: 'Product Catalogues',
      icon: <BookOpen className="w-4 h-4 mr-2" />
    },
    { 
      id: 'marketing-campaigns', 
      name: 'Marketing Campaigns',
      icon: <Target className="w-4 h-4 mr-2" />
    },
    { 
      id: 'crm-reports', 
      name: 'CRM Reports',
      icon: <Users className="w-4 h-4 mr-2" />
    },
    { 
      id: 'advertising-promotion', 
      name: 'Advertising & Promotion',
      icon: <TrendingUp className="w-4 h-4 mr-2" />
    },
    { 
      id: 'pricing-sheets', 
      name: 'Pricing Sheets',
      icon: <DollarSign className="w-4 h-4 mr-2" />
    },
    { 
      id: 'sales-contracts', 
      name: 'Sales Contracts',
      icon: <FileContract className="w-4 h-4 mr-2" />
    },
    { 
      id: 'customer-feedback', 
      name: 'Customer Feedback',
      icon: <ClipboardList className="w-4 h-4 mr-2" />
    }
  ];

  const renderActiveForm = () => {
    switch (activeForm) {
      case 'sales-distribution':
        return <SalesDistributionForm onBack={onBack} />;
      case 'sales-proposals':
        return <SalesProposalsForm onBack={() => setActiveForm('sales-distribution')} />;
      case 'product-catalogues':
        return <ProductCataloguesForm onBack={() => setActiveForm('sales-distribution')} />;
      case 'marketing-campaigns':
        return <MarketingCampaignForm onBack={() => setActiveForm('sales-distribution')} />;
      case 'crm-reports':
        return <CRMReportsForm onBack={() => setActiveForm('sales-distribution')} />;
      case 'advertising-promotion':
        return <AdvertisingPromotionForm onBack={() => setActiveForm('sales-distribution')} />;
      case 'pricing-sheets':
        return <PricingSheetsForm onBack={() => setActiveForm('sales-distribution')} />;
      case 'sales-contracts':
        return <SalesContractsForm onBack={() => setActiveForm('sales-distribution')} />;
      case 'customer-feedback':
        return <CustomerFeedbackForm onBack={() => setActiveForm('sales-distribution')} />;
      default:
        return <SalesDistributionForm onBack={onBack} />;
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar toggle for mobile */}
      <div className="absolute top-4 left-4 md:hidden z-10">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Sidebar */}
      <div className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        transition-transform duration-300 ease-in-out
        fixed md:static top-0 left-0 h-full w-64 bg-white border-r shadow-sm z-20 md:translate-x-0
      `}>
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Sales & Marketing</h2>
        </div>
        <div className="p-2 overflow-y-auto h-[calc(100%-60px)]">
          {forms.map((form) => (
            <Button
              key={form.id}
              variant={activeForm === form.id ? "secondary" : "ghost"}
              className="w-full justify-start mb-1"
              onClick={() => {
                setActiveForm(form.id);
                // Close sidebar on mobile after selection
                if (window.innerWidth < 768) {
                  setSidebarOpen(false);
                }
              }}
            >
              {form.icon}
              {form.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 w-full">
        {renderActiveForm()}
      </div>
    </div>
  );
};

export default SalesMarketingLayout;
