import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DairyCoolers from './dairy/DairyCoolers';
import FactoryStock from './dairy/FactoryStock';
import ColdRoomStock from './dairy/ColdRoomStock';

const GrandBernaDairies = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Grand Berna Dairies Stock Update</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="dairyCoolers">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="dairyCoolers">Dairy Coolers</TabsTrigger>
              <TabsTrigger value="factory">Factory</TabsTrigger>
              <TabsTrigger value="coldRoom">Cold Room</TabsTrigger>
            </TabsList>
            <TabsContent value="dairyCoolers">
              <DairyCoolers />
            </TabsContent>
            <TabsContent value="factory">
              <FactoryStock />
            </TabsContent>
            <TabsContent value="coldRoom">
              <ColdRoomStock />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default GrandBernaDairies;