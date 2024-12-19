import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReceiveMilkForm from './ReceiveMilkForm';
import OffloadMilkForm from './OffloadMilkForm';

const DairyCoolers = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Dairy Coolers Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="receive" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="receive">Receive Milk</TabsTrigger>
            <TabsTrigger value="offload">Offload Milk</TabsTrigger>
          </TabsList>
          <TabsContent value="receive">
            <ReceiveMilkForm />
          </TabsContent>
          <TabsContent value="offload">
            <OffloadMilkForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DairyCoolers;