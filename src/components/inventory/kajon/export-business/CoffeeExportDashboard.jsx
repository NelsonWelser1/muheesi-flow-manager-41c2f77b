import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, TrendingUp, Ship, DollarSign, ClipboardList, Globe } from "lucide-react";

const CoffeeExportDashboard = () => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Globe className="h-6 w-6" />
          KAJON Coffee Export Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sourcing" className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="sourcing" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Sourcing & Procurement
            </TabsTrigger>
            <TabsTrigger value="hulling" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Hulling & Grading
            </TabsTrigger>
            <TabsTrigger value="logistics" className="flex items-center gap-2">
              <Ship className="h-4 w-4" />
              Logistics & Shipping
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Financial Management
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              Order Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sourcing">
            <div>Sourcing & Procurement Content</div>
          </TabsContent>
          <TabsContent value="hulling">
            <div>Hulling & Grading Content</div>
          </TabsContent>
          <TabsContent value="logistics">
            <div>Logistics & Shipping Content</div>
          </TabsContent>
          <TabsContent value="financial">
            <div>Financial Management Content</div>
          </TabsContent>
          <TabsContent value="orders">
            <div>Order Management Content</div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CoffeeExportDashboard;