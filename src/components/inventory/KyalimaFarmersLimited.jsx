import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TZUGRiceBusiness from './kyalima/TZUGRiceBusiness';
import KakyingaCoffeeFarming from './kyalima/KakyingaCoffeeFarming';
import DwanilloBullFattening from './kyalima/DwanilloBullFattening';

const KyalimaFarmersLimited = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Kyalima Farmers Limited</h2>
      <Tabs defaultValue="tz-ug-rice">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tz-ug-rice">TZ-UG Rice Business</TabsTrigger>
          <TabsTrigger value="kakyinga-coffee">Kakyinga Coffee Farming</TabsTrigger>
          <TabsTrigger value="dwanillo-bull">Dwanillo Bull Fattening & Milk Cows</TabsTrigger>
        </TabsList>
        <TabsContent value="tz-ug-rice">
          <TZUGRiceBusiness />
        </TabsContent>
        <TabsContent value="kakyinga-coffee">
          <KakyingaCoffeeFarming />
        </TabsContent>
        <TabsContent value="dwanillo-bull">
          <DwanilloBullFattening />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KyalimaFarmersLimited;