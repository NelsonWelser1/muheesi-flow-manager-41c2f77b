
import React from 'react';

const CompanyStockInfo = ({ companyName, stockData, isLoading }) => {
  const hasStockData = stockData && Object.keys(stockData).length > 0;
  
  return (
    <div className="p-4 sm:p-6" data-select-id={`company-stock-${companyName}`}>
      <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase mb-4">Current Stock</h3>
      {isLoading ? (
        <p className="text-sm text-gray-500">Loading stock information...</p>
      ) : hasStockData ? (
        <ul className="space-y-2">
          {Object.entries(stockData).map(([product, stock]) => (
            <li key={product} className="flex justify-between text-sm sm:text-base">
              <span className="text-gray-500">{product}</span>
              <span className="font-medium text-gray-900">{stock}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-sm text-gray-500 italic">
          <p>No stock information available at the moment.</p>
          <p className="mt-1">Contact us for current availability.</p>
        </div>
      )}
    </div>
  );
};

export default CompanyStockInfo;
