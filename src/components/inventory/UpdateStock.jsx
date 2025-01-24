import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GrandBernaDairies from './GrandBernaDairies';
import KAJONCoffeeLimited from './KAJONCoffeeLimited';
import KyalimaFarmersLimited from './KyalimaFarmersLimited';

const UpdateStock = ({ defaultTab = 'grand-berna' }) => {
  console.log('Rendering UpdateStock with defaultTab:', defaultTab);
  
  return (
    <div>
      <Tabs defaultValue={defaultTab}>
        <TabsList className="w-full">
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