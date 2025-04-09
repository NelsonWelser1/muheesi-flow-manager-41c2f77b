
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, Briefcase, Truck, Globe, Files, CheckSquare, 
  CreditCard, ShoppingCart, ClipboardList
} from 'lucide-react';

const NavigationTabs = ({ activeTab, setActiveTab }) => {
  return (
    <TabsList className="grid grid-cols-2 md:grid-cols-9 h-auto">
      <TabsTrigger value="dashboard" className="flex flex-col py-2 gap-1" onClick={() => setActiveTab('dashboard')}>
        <BarChart3 className="h-4 w-4" />
        <span>Dashboard</span>
      </TabsTrigger>
      <TabsTrigger value="contracts" className="flex flex-col py-2 gap-1" onClick={() => setActiveTab('contracts')}>
        <Briefcase className="h-4 w-4" />
        <span>Contracts</span>
      </TabsTrigger>
      <TabsTrigger value="shipments" className="flex flex-col py-2 gap-1" onClick={() => setActiveTab('shipments')}>
        <Truck className="h-4 w-4" />
        <span>Shipments</span>
      </TabsTrigger>
      <TabsTrigger value="market" className="flex flex-col py-2 gap-1" onClick={() => setActiveTab('market')}>
        <Globe className="h-4 w-4" />
        <span>Market</span>
      </TabsTrigger>
      <TabsTrigger value="compliance" className="flex flex-col py-2 gap-1" onClick={() => setActiveTab('compliance')}>
        <Files className="h-4 w-4" />
        <span>Compliance</span>
      </TabsTrigger>
      <TabsTrigger value="quality" className="flex flex-col py-2 gap-1" onClick={() => setActiveTab('quality')}>
        <CheckSquare className="h-4 w-4" />
        <span>Quality</span>
      </TabsTrigger>
      <TabsTrigger value="finance" className="flex flex-col py-2 gap-1" onClick={() => setActiveTab('finance')}>
        <CreditCard className="h-4 w-4" />
        <span>Finance</span>
      </TabsTrigger>
      <TabsTrigger value="sales" className="flex flex-col py-2 gap-1" onClick={() => setActiveTab('sales')}>
        <ShoppingCart className="h-4 w-4" />
        <span>Sales</span>
      </TabsTrigger>
      <TabsTrigger value="order" className="flex flex-col py-2 gap-1" onClick={() => setActiveTab('order')}>
        <ClipboardList className="h-4 w-4" />
        <span>Order</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default NavigationTabs;
