import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DairyCoolers from './dairy/DairyCoolers';
import DairyFactoryDashboard from './dairy/DairyFactoryDashboard';
import ColdRoomStock from './dairy/ColdRoomStock';
import SlaughterhouseStock from './dairy/SlaughterhouseStock';

const GrandBernaDairies = () => {
  return (
    <Tabs defaultValue="factory" className="w-full">
      <TabsList className="w-full justify-start overflow-x-auto">
        <TabsTrigger value="coolers">Milk Coolers</TabsTrigger>
        <TabsTrigger value="factory">Dairy Factory</TabsTrigger>
        <TabsTrigger value="coldroom">Cold Room</TabsTrigger>
        <TabsTrigger value="slaughterhouse">Slaughterhouse</TabsTrigger>
      </TabsList>

      <TabsContent value="coolers">
        <DairyCoolers />
      </TabsContent>

      <TabsContent value="factory">
        <DairyFactoryDashboard />
      </TabsContent>

      <TabsContent value="coldroom">
        <ColdRoomStock />
      </TabsContent>

      <TabsContent value="slaughterhouse">
        <SlaughterhouseStock />
      </TabsContent>
    </Tabs>
  );
};

export default GrandBernaDairies;