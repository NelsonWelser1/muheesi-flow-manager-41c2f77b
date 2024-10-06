import React from 'react';
import GrandBernaDairies from '../components/inventory/GrandBernaDairies';
import KAJONCoffeeLimited from '../components/inventory/KAJONCoffeeLimited';
import KyalimaFarmersLimited from '../components/inventory/KyalimaFarmersLimited';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ManageInventory = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manage Inventory</h1>
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

export default ManageInventory;