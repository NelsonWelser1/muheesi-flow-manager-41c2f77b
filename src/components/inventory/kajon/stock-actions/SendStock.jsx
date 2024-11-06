import React from 'react';
import StockUpdateForm from '../StockUpdateForm';

const SendStock = ({ location, onSubmit, onBack }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Send Stock from {location}</h3>
      <StockUpdateForm 
        action="transfer"
        onSubmit={onSubmit}
        onBack={onBack}
      />
    </div>
  );
};

export default SendStock;