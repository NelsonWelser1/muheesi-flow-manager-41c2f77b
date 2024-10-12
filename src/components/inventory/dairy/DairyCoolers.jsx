import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReceiveMilkForm from './ReceiveMilkForm';
import OffloadMilkForm from './OffloadMilkForm';

const DairyCoolers = () => {
  return (
    <Tabs defaultValue="receiveMilk">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="receiveMilk">RECEIVE MILK</TabsTrigger>
        <TabsTrigger value="offloadMilk">OFF-LOAD MILK</TabsTrigger>
      </TabsList>
      <TabsContent value="receiveMilk">
        <ReceiveMilkForm />
      </TabsContent>
      <TabsContent value="offloadMilk">
        <OffloadMilkForm />
      </TabsContent>
    </Tabs>
  );
};

export default DairyCoolers;