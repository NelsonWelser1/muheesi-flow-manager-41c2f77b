import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GrandBernaDairies from './GrandBernaDairies';
import KAJONCoffeeLimited from './KAJONCoffeeLimited';
import KyalimaFarmersLimited from './KyalimaFarmersLimited';

const UpdateStock = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Update Stock</h2>
      <Tabs defaultValue="grand-berna">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="grand-berna">Grand Berna Dairies</TabsTrigger>
          <TabsTrigger value="kajon-coffee">KAJON Coffee Limited</TabsTrigger>
          <TabsTrigger value="kyalima-farmers">Kyalima Farmers Limited</TabsTrigger>
        </TabsList>
        <TabsContent value="grand-berna">
          <GrandBernaDairies />
        </TabsContent>
        <TabsContent value="kajon-coffee">
          <KAJONCoffeeLimited />
        </TabsContent>
        <TabsContent value="kyalima-farmers">
          <KyalimaFarmersLimited />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UpdateStock;