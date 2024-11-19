import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import MetricsCards from './dashboard/MetricsCards';
import Charts from './dashboard/Charts';
import QuotationForm from './quotations/QuotationForm';
import QuotationsList from './quotations/QuotationsList';
import SourcingProcurement from './SourcingProcurement';
import HullingGrading from './HullingGrading';
import LogisticsShipping from './LogisticsShipping';
import FinancialManagement from './FinancialManagement';
import OrderManagement from './OrderManagement';

const CoffeeExportDashboard = () => {
  return (
    <Tabs defaultValue="dashboard" className="w-full">
      <TabsList className="w-full justify-start overflow-x-auto">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="quotations">Quotations</TabsTrigger>
        <TabsTrigger value="sourcing">Sourcing & Procurement</TabsTrigger>
        <TabsTrigger value="hulling">Hulling & Grading</TabsTrigger>
        <TabsTrigger value="logistics">Logistics & Shipping</TabsTrigger>
        <TabsTrigger value="financial">Financial Management</TabsTrigger>
        <TabsTrigger value="orders">Order Management</TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard">
        <div className="space-y-4">
          <MetricsCards />
          <Charts />
        </div>
      </TabsContent>

      <TabsContent value="quotations">
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <QuotationForm />
            </CardContent>
          </Card>
          <QuotationsList />
        </div>
      </TabsContent>

      <TabsContent value="sourcing">
        <SourcingProcurement />
      </TabsContent>

      <TabsContent value="hulling">
        <HullingGrading />
      </TabsContent>

      <TabsContent value="logistics">
        <LogisticsShipping />
      </TabsContent>

      <TabsContent value="financial">
        <FinancialManagement />
      </TabsContent>

      <TabsContent value="orders">
        <OrderManagement />
      </TabsContent>
    </Tabs>
  );
};

export default CoffeeExportDashboard;