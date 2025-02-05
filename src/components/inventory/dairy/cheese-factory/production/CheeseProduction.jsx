import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProductionLineForm from './ProductionLineForm';
import { Button } from "@/components/ui/button";
import { Factory } from "lucide-react";

const CheeseProduction = () => {
  const [selectedLine, setSelectedLine] = React.useState(null);
  console.log('Rendering CheeseProduction component');

  const productionLines = [
    {
      id: 1,
      name: "International Certified Standards",
      manager: "Didier Albatini",
      description: "Production line dedicated to international market standards and certifications"
    },
    {
      id: 2,
      name: "Local Market Standards",
      manager: "Dr.Orimwesiga Benard",
      description: "Production line optimized for local market requirements"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cheese Production Management</CardTitle>
      </CardHeader>
      <CardContent>
        {!selectedLine ? (
          <div className="grid md:grid-cols-2 gap-6">
            {productionLines.map((line) => (
              <Card 
                key={line.id}
                className="cursor-pointer hover:shadow-lg transition-all"
                onClick={() => setSelectedLine(line)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Factory className="h-5 w-5" />
                    Production Line {line.id}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h3 className="font-semibold">{line.name}</h3>
                    <p className="text-sm text-muted-foreground">Manager: {line.manager}</p>
                    <p className="text-sm text-muted-foreground">{line.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{selectedLine.name}</h3>
                <p className="text-sm text-muted-foreground">Manager: {selectedLine.manager}</p>
              </div>
              <Button variant="outline" onClick={() => setSelectedLine(null)}>
                Change Production Line
              </Button>
            </div>
            <ProductionLineForm productionLine={selectedLine} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CheeseProduction;