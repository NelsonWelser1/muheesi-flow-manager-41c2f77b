
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MetricsCards from './dashboard/MetricsCards';
import Charts from './dashboard/Charts';
import QuoteManagement from './quotations/QuoteManagement';
import ProformaInvoice from './modules/ProformaInvoice';
import OrderManagement from './modules/OrderManagement';
import DeliveryManagement from './modules/DeliveryManagement';
import InvoiceManagement from './modules/InvoiceManagement';
import PackingList from './modules/PackingList';

const CoffeeExportDashboard = () => {
  console.log('Rendering CoffeeExportDashboard');
  
  return (
    <Tabs defaultValue="dashboard" className="w-full">
      <TabsList className="w-full justify-start overflow-x-auto">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="quotes">Quotes</TabsTrigger>
        <TabsTrigger value="proforma">Proforma Invoices</TabsTrigger>
        <TabsTrigger value="orders">Orders</TabsTrigger>
        <TabsTrigger value="delivery">Delivery Notes</TabsTrigger>
        <TabsTrigger value="invoices">Invoices</TabsTrigger>
        <TabsTrigger value="packing">Packing List</TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard" className="space-y-4">
        <MetricsCards />
        <Charts />
      </TabsContent>

      <TabsContent value="quotes">
        <QuoteManagement />
      </TabsContent>

      <TabsContent value="proforma">
        <ProformaInvoice />
      </TabsContent>

      <TabsContent value="orders">
        <OrderManagement />
      </TabsContent>

      <TabsContent value="delivery">
        <DeliveryManagement />
      </TabsContent>

      <TabsContent value="invoices">
        <InvoiceManagement />
      </TabsContent>

      <TabsContent value="packing">
        <PackingList />
      </TabsContent>
    </Tabs>
  );
};

export default CoffeeExportDashboard;
