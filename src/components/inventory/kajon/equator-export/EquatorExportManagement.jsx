
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Ship, Globe, FileText, TrendingUp, Users, Briefcase, 
  Package, Truck, AlertCircle, ClipboardCheck, DollarSign,
  BarChart3, Scale, Files, Calendar, Map, CheckSquare, 
  CreditCard, BarChart, ShoppingCart, ClipboardList
} from 'lucide-react';
import ExportDashboard from './dashboard/ExportDashboard';
import ContractManagement from './contracts/ContractManagement';
import ShipmentTracking from './shipments/ShipmentTracking';
import GlobalMarketInsights from './market/GlobalMarketInsights';
import ComplianceDocuments from './compliance/ComplianceDocuments';
import QualityCertification from './quality/QualityCertification';
import FinanceManagement from './finance/FinanceManagement';
import SalesMarketing from './sales/SalesMarketing';
import OrderManagement from './order/OrderManagement';

const EquatorExportManagement = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const exportMetrics = {
    pendingShipments: 5,
    activeContracts: 12,
    revenue: '$1.2M',
    newBuyers: 3
  };
  
  return (
    <div className="space-y-6">
      {/* Export Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-blue-700">Pending Shipments</p>
                <p className="text-2xl font-bold text-blue-900">{exportMetrics.pendingShipments}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <Ship className="h-5 w-5 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-emerald-50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-emerald-700">Active Contracts</p>
                <p className="text-2xl font-bold text-emerald-900">{exportMetrics.activeContracts}</p>
              </div>
              <div className="bg-emerald-100 p-2 rounded-full">
                <FileText className="h-5 w-5 text-emerald-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-amber-700">Total Revenue</p>
                <p className="text-2xl font-bold text-amber-900">{exportMetrics.revenue}</p>
              </div>
              <div className="bg-amber-100 p-2 rounded-full">
                <DollarSign className="h-5 w-5 text-amber-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-purple-700">New Buyers</p>
                <p className="text-2xl font-bold text-purple-900">{exportMetrics.newBuyers}</p>
              </div>
              <div className="bg-purple-100 p-2 rounded-full">
                <Users className="h-5 w-5 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Alert Notifications */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-6 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-orange-600" />
          <span className="text-orange-800">
            Shipment EQ-2453 requires urgent documentation - Due in 48 hours
          </span>
          <Button size="sm" variant="outline" className="ml-auto border-orange-300 text-orange-700 hover:bg-orange-100">
            View Details
          </Button>
        </CardContent>
      </Card>
      
      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-9 h-auto">
          <TabsTrigger value="dashboard" className="flex flex-col py-2 gap-1">
            <BarChart3 className="h-4 w-4" />
            <span>Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="contracts" className="flex flex-col py-2 gap-1">
            <Briefcase className="h-4 w-4" />
            <span>Contracts</span>
          </TabsTrigger>
          <TabsTrigger value="shipments" className="flex flex-col py-2 gap-1">
            <Truck className="h-4 w-4" />
            <span>Shipments</span>
          </TabsTrigger>
          <TabsTrigger value="market" className="flex flex-col py-2 gap-1">
            <Globe className="h-4 w-4" />
            <span>Market</span>
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex flex-col py-2 gap-1">
            <Files className="h-4 w-4" />
            <span>Compliance</span>
          </TabsTrigger>
          <TabsTrigger value="quality" className="flex flex-col py-2 gap-1">
            <CheckSquare className="h-4 w-4" />
            <span>Quality</span>
          </TabsTrigger>
          <TabsTrigger value="finance" className="flex flex-col py-2 gap-1">
            <CreditCard className="h-4 w-4" />
            <span>Finance</span>
          </TabsTrigger>
          <TabsTrigger value="sales" className="flex flex-col py-2 gap-1">
            <ShoppingCart className="h-4 w-4" />
            <span>Sales</span>
          </TabsTrigger>
          <TabsTrigger value="order" className="flex flex-col py-2 gap-1">
            <ClipboardList className="h-4 w-4" />
            <span>Order</span>
          </TabsTrigger>
        </TabsList>
        
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
      </Tabs>
    </div>
  );
};

export default EquatorExportManagement;
