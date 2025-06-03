
import React from 'react';

const TotalsSummary = ({ products }) => {
  const totalQuantity = products.reduce((total, product) => total + Number(product.quantity || 0), 0);
  const totalNetWeight = products.reduce((total, product) => total + Number(product.netWeight || 0), 0);
  const totalGrossWeight = products.reduce((total, product) => total + Number(product.grossWeight || 0), 0);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Totals Summary</h3>
      <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <p className="text-sm text-gray-600">Total Quantity</p>
          <p className="text-lg font-semibold">{totalQuantity}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Total Net Weight</p>
          <p className="text-lg font-semibold">{totalNetWeight} kg</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Total Gross Weight</p>
          <p className="text-lg font-semibold">{totalGrossWeight} kg</p>
        </div>
      </div>
    </div>
  );
};

export default TotalsSummary;
