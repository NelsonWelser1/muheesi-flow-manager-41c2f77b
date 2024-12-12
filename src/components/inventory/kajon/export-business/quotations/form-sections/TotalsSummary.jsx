import React from 'react';
import { calculateTotals } from '../utils/calculations';

const TotalsSummary = ({ products }) => {
  const totals = calculateTotals(products);

  return (
    <div className="border-t pt-4 space-y-2">
      <div className="flex justify-between">
        <span className="font-semibold">Total Net Weight:</span>
        <span>{totals.netWeightTotal} KG</span>
      </div>
      <div className="flex justify-between">
        <span className="font-semibold">Total Gross Weight:</span>
        <span>{totals.grossWeightTotal} KG</span>
      </div>
      <div className="flex justify-between">
        <span className="font-semibold">Total Measure:</span>
        <span>{totals.measureTotal} M²</span>
      </div>
    </div>
  );
};

export default TotalsSummary;