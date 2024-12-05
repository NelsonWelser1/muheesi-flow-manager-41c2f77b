import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import MetricsCards from './dashboard/MetricsCards';
import Charts from './dashboard/Charts';
import QuoteManagement from './quotations/QuoteManagement';
import ProformaInvoice from './quotations/ProformaInvoice';
import OrderManagement from './OrderManagement';
import LPOManagement from './LPOManagement';
import DeliveryManagement from './DeliveryManagement';
import InvoiceManagement from './modules/InvoiceManagement';

const CoffeeExportDashboard = () => {
  return (
    <Tabs defaultValue="dashboard" className="w-full">
      <TabsList className="w-full justify-start overflow-x-auto">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="quotes">Quotes</TabsTrigger>
        <TabsTrigger value="proforma">Proforma Invoices</TabsTrigger>
        <TabsTrigger value="orders">Orders</TabsTrigger>
        <TabsTrigger value="lpo">LPO</TabsTrigger>
        <TabsTrigger value="delivery">Delivery Notes</TabsTrigger>
        <TabsTrigger value="invoices">Invoices</TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard">
        <div className="space-y-4">
          <MetricsCards />
          <Charts />
        </div>
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

      <TabsContent value="lpo">
        <LPOManagement />
      </TabsContent>

      <TabsContent value="delivery">
        <DeliveryManagement />
      </TabsContent>

      <TabsContent value="invoices">
        <InvoiceManagement />
      </TabsContent>
    </Tabs>
  );
};

export default CoffeeExportDashboard;