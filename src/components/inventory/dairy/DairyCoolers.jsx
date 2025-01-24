import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MilkReception from './cheese-factory/milk-reception/MilkReception';

const DairyCoolers = () => {
  return (
    <div className="container mx-auto p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Dairy Coolers Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="reception" className="w-full">
            <TabsList className="w-full justify-start mb-6 bg-gray-100 p-1 rounded-lg border border-gray-200">
              <TabsTrigger value="reception">Milk Reception</TabsTrigger>
              <TabsTrigger value="storage">Storage Management</TabsTrigger>
              <TabsTrigger value="monitoring">Temperature Monitoring</TabsTrigger>
            </TabsList>

            <TabsContent value="reception">
              <MilkReception />
            </TabsContent>

            <TabsContent value="storage">
              <div className="text-center p-4">
                Storage management interface coming soon
              </div>
            </TabsContent>

            <TabsContent value="monitoring">
              <div className="text-center p-4">
                Temperature monitoring interface coming soon
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DairyCoolers;