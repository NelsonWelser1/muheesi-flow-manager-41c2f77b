
import React, { useState } from 'react';
import ProductionLineForm from './ProductionLineForm';
import ProductionLineDataDisplay from './ProductionLineDataDisplay';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Factory } from "lucide-react";

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

const CheeseProduction = () => {
  const [selectedLine, setSelectedLine] = useState(null);
  console.log('Rendering CheeseProduction component');

  if (selectedLine) {
    return (
      <div className="space-y-6">
        <Button 
          variant="ghost" 
          onClick={() => setSelectedLine(null)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Production Lines
        </Button>
        <div className="space-y-4">
          <ProductionLineForm productionLine={selectedLine} />
          <ProductionLineDataDisplay productionLine={selectedLine} />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {productionLines.map((line) => (
        <Card 
          key={line.id} 
          className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-white"
          onClick={() => setSelectedLine(line)}
        >
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center justify-between">
              <span className="text-xl font-semibold">{line.name}</span>
              <Factory className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              <p><strong>Manager:</strong> {line.manager}</p>
              <p className="mt-2">{line.description}</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Click to manage production records
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CheeseProduction;
