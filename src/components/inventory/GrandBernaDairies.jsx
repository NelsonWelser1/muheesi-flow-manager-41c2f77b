import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DairyCoolers from './dairy/DairyCoolers';
import FactoryStock from './dairy/FactoryStock';
import ColdRoomStock from './dairy/ColdRoomStock';
import SlaughterhouseStock from './dairy/SlaughterhouseStock';

const GrandBernaDairies = () => {
  return (
    <div className="max-w-[1200px] mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 border-b pb-4">Grand Berna Dairies Management</h1>
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle>Grand Berna Dairies</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="coolers" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="coolers">Dairy Coolers</TabsTrigger>
              <TabsTrigger value="factory">Factory Stock</TabsTrigger>
              <TabsTrigger value="coldroom">Cold Room Stock</TabsTrigger>
              <TabsTrigger value="slaughterhouse">Slaughterhouse Stock</TabsTrigger>
            </TabsList>

            <TabsContent value="coolers">
              <DairyCoolers />
            </TabsContent>
            <TabsContent value="factory">
              <FactoryStock />
            </TabsContent>
            <TabsContent value="coldroom">
              <ColdRoomStock />
            </TabsContent>
            <TabsContent value="slaughterhouse">
              <SlaughterhouseStock />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default GrandBernaDairies;