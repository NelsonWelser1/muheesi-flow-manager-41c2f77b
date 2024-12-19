import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FactoryStock = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Factory Stock Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="production" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="production">Production</TabsTrigger>
            <TabsTrigger value="packaging">Packaging</TabsTrigger>
            <TabsTrigger value="storage">Storage</TabsTrigger>
          </TabsList>
          <TabsContent value="production">
            <div>
              <h3 className="text-lg font-semibold">Production Overview</h3>
              <p>Details about the production process and current status.</p>
              {/* Add production related components or information here */}
            </div>
          </TabsContent>
          <TabsContent value="packaging">
            <div>
              <h3 className="text-lg font-semibold">Packaging Overview</h3>
              <p>Details about the packaging process and current status.</p>
              {/* Add packaging related components or information here */}
            </div>
          </TabsContent>
          <TabsContent value="storage">
            <div>
              <h3 className="text-lg font-semibold">Storage Overview</h3>
              <p>Details about the storage conditions and inventory levels.</p>
              {/* Add storage related components or information here */}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FactoryStock;
