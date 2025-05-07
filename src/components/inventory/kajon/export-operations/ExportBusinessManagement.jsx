
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Briefcase, Package, Ship, Settings, Globe } from 'lucide-react';
import ExportOrders from './ExportOrders';
import ContractManagement from './ContractManagement';
import ShipmentManagement from './ShipmentManagement';
import CustomsManagement from './CustomsManagement';
import ExportAnalytics from './ExportAnalytics';

const ExportBusinessManagement = () => {
  const [activeTab, setActiveTab] = useState("orders");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Active Orders</CardTitle>
            <CardDescription>Orders in process</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700">12</div>
            <p className="text-sm text-muted-foreground">3 awaiting shipment</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Export Volume</CardTitle>
            <CardDescription>Current quarter</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">175 MT</div>
            <p className="text-sm text-muted-foreground">+15% from previous quarter</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Revenue</CardTitle>
            <CardDescription>Current quarter</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-700">$892,450</div>
            <p className="text-sm text-muted-foreground">+8.2% from previous quarter</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Orders</span>
          </TabsTrigger>
          <TabsTrigger value="contracts" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            <span className="hidden sm:inline">Contracts</span>
          </TabsTrigger>
          <TabsTrigger value="shipments" className="flex items-center gap-2">
            <Ship className="h-4 w-4" />
            <span className="hidden sm:inline">Shipments</span>
          </TabsTrigger>
          <TabsTrigger value="customs" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Customs</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="orders" className="mt-6">
          <ExportOrders />
        </TabsContent>
        
        <TabsContent value="contracts" className="mt-6">
          <ContractManagement />
        </TabsContent>
        
        <TabsContent value="shipments" className="mt-6">
          <ShipmentManagement />
        </TabsContent>
        
        <TabsContent value="customs" className="mt-6">
          <CustomsManagement />
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          <ExportAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExportBusinessManagement;
