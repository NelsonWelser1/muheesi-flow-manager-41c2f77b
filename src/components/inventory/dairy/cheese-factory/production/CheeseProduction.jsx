import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProductionLineForm from './ProductionLineForm';

const CheeseProduction = () => {
  console.log('Rendering CheeseProduction component');

  const productionLines = [
    {
      id: 1,
      name: "International Certified Standards",
      manager: "Didier Albatini"
    },
    {
      id: 2,
      name: "Local Market Standards",
      manager: "Dr.Orimwesiga Benard"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cheese Production Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="line-1" className="w-full">
          <TabsList className="w-full">
            {productionLines.map((line) => (
              <TabsTrigger key={line.id} value={`line-${line.id}`}>
                Production Line {line.id}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {productionLines.map((line) => (
            <TabsContent key={line.id} value={`line-${line.id}`}>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{line.name}</h3>
                    <p className="text-sm text-muted-foreground">Manager: {line.manager}</p>
                  </div>
                </div>
                <ProductionLineForm productionLine={line} />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CheeseProduction;