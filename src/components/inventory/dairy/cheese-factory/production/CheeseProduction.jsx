
import React from 'react';
import ProductionLineForm from './ProductionLineForm';
import ProductionLineDataDisplay from './ProductionLineDataDisplay';

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
  console.log('Rendering CheeseProduction component');

  return (
    <div className="space-y-6">
      {productionLines.map((line) => (
        <div key={line.id} className="space-y-4">
          <ProductionLineForm productionLine={line} />
          <ProductionLineDataDisplay productionLine={line} />
        </div>
      ))}
    </div>
  );
};

export default CheeseProduction;
