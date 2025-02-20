
import React from 'react';
import ProductionLineForm from './production/ProductionLineForm';
import ProductionLineDataDisplay from './production/ProductionLineDataDisplay';
import { productionLines } from './production/config/productionLines';

const CheeseProduction = () => {
  return (
    <div className="space-y-8">
      <div>
        <ProductionLineForm productionLine={productionLines.international} />
        <ProductionLineDataDisplay productionLine={productionLines.international} />
      </div>
      
      <div>
        <ProductionLineForm productionLine={productionLines.local} />
        <ProductionLineDataDisplay productionLine={productionLines.local} />
      </div>
    </div>
  );
};

export default CheeseProduction;
