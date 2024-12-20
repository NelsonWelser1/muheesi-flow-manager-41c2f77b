import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CheeseProductionForm from './forms/CheeseProductionForm';
import YogurtProductionForm from './forms/YogurtProductionForm';
import ProcessedMilkForm from './forms/ProcessedMilkForm';

const ProductionForms = () => {
  return (
    <Tabs defaultValue="cheese" className="w-full">
      <TabsList>
        <TabsTrigger value="cheese">Cheese Production</TabsTrigger>
        <TabsTrigger value="yogurt">Yogurt Production</TabsTrigger>
        <TabsTrigger value="milk">Processed Milk</TabsTrigger>
      </TabsList>

      <TabsContent value="cheese">
        <CheeseProductionForm />
      </TabsContent>

      <TabsContent value="yogurt">
        <YogurtProductionForm />
      </TabsContent>

      <TabsContent value="milk">
        <ProcessedMilkForm />
      </TabsContent>
    </Tabs>
  );
};

export default ProductionForms;