
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import ExportDashboard from '../dashboard/ExportDashboard';
import ContractManagement from '../contracts/ContractManagement';
import ShipmentTracking from '../shipments/ShipmentTracking';
import GlobalMarketInsights from '../market/GlobalMarketInsights';
import ComplianceDocuments from '../compliance/ComplianceDocuments';
import QualityCertification from '../quality/QualityCertification';
import FinanceManagement from '../finance/FinanceManagement';
import SalesMarketing from '../sales/SalesMarketing';
import OrderManagement from '../order/OrderManagement';

const ContentTabs = ({ activeTab }) => {
  return (
    <>
      <TabsContent value="dashboard" className="space-y-4">
        <ExportDashboard />
      </TabsContent>
      
      <TabsContent value="contracts" className="space-y-4">
        <ContractManagement />
      </TabsContent>
      
      <TabsContent value="shipments" className="space-y-4">
        <ShipmentTracking />
      </TabsContent>
      
      <TabsContent value="market" className="space-y-4">
        <GlobalMarketInsights />
      </TabsContent>
      
      <TabsContent value="compliance" className="space-y-4">
        <ComplianceDocuments />
      </TabsContent>
      
      <TabsContent value="quality" className="space-y-4">
        <QualityCertification />
      </TabsContent>
      
      <TabsContent value="finance" className="space-y-4">
        <FinanceManagement />
      </TabsContent>
      
      <TabsContent value="sales" className="space-y-4">
        <SalesMarketing />
      </TabsContent>
      
      <TabsContent value="order" className="space-y-4">
        <OrderManagement />
      </TabsContent>
    </>
  );
};

export default ContentTabs;
