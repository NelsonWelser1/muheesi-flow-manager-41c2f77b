import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Coffee, Users, Package, DollarSign, ClipboardList } from 'lucide-react';
import EmployeeManagement from './kakyinga/EmployeeManagement';
import HarvestTracking from './kakyinga/HarvestTracking';
import DryStockManagement from './kakyinga/DryStockManagement';
import SalesRecords from './kakyinga/SalesRecords';
import RequisitionSystem from './kakyinga/RequisitionSystem';

const KakyingaCoffeeFarm = () => {
  const [activeTab, setActiveTab] = useState("employees");

  return (
    <div className="space-y-6">
      <Card className="border-amber-100 shadow-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-transparent border-b border-amber-100">
          <div className="flex items-center gap-3">
            <Coffee className="h-8 w-8 text-amber-700" />
            <div>
              <CardTitle className="text-2xl font-bold text-amber-900">Kakyinga Coffee Farm</CardTitle>
              <CardDescription className="text-amber-700">
                Comprehensive coffee farm operations management system
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-5 gap-0.5 bg-amber-50 p-1">
              <TabsTrigger 
                value="employees" 
                className="flex flex-col py-1.5 px-2 gap-0.5 data-[state=active]:bg-white data-[state=active]:text-amber-800"
              >
                <Users className="h-4 w-4 mx-auto" />
                <span className="text-xs">Employees</span>
              </TabsTrigger>
              <TabsTrigger 
                value="harvest" 
                className="flex flex-col py-1.5 px-2 gap-0.5 data-[state=active]:bg-white data-[state=active]:text-amber-800"
              >
                <Coffee className="h-4 w-4 mx-auto" />
                <span className="text-xs">Fresh Harvest</span>
              </TabsTrigger>
              <TabsTrigger 
                value="dry-stock" 
                className="flex flex-col py-1.5 px-2 gap-0.5 data-[state=active]:bg-white data-[state=active]:text-amber-800"
              >
                <Package className="h-4 w-4 mx-auto" />
                <span className="text-xs">Dry Stock</span>
              </TabsTrigger>
              <TabsTrigger 
                value="sales" 
                className="flex flex-col py-1.5 px-2 gap-0.5 data-[state=active]:bg-white data-[state=active]:text-amber-800"
              >
                <DollarSign className="h-4 w-4 mx-auto" />
                <span className="text-xs">Sales</span>
              </TabsTrigger>
              <TabsTrigger 
                value="requisitions" 
                className="flex flex-col py-1.5 px-2 gap-0.5 data-[state=active]:bg-white data-[state=active]:text-amber-800"
              >
                <ClipboardList className="h-4 w-4 mx-auto" />
                <span className="text-xs">Requisitions</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="employees" className="space-y-4">
              <EmployeeManagement />
            </TabsContent>

            <TabsContent value="harvest" className="space-y-4">
              <HarvestTracking />
            </TabsContent>

            <TabsContent value="dry-stock" className="space-y-4">
              <DryStockManagement />
            </TabsContent>

            <TabsContent value="sales" className="space-y-4">
              <SalesRecords />
            </TabsContent>

            <TabsContent value="requisitions" className="space-y-4">
              <RequisitionSystem />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default KakyingaCoffeeFarm;
