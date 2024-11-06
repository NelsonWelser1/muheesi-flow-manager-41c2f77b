import React from 'react';
import StockUpdateForm from '../StockUpdateForm';

const AddStock = ({ location, onSubmit, onBack }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Add Stock to {location}</h3>
      <StockUpdateForm 
        action="add"
        onSubmit={onSubmit}
        onBack={onBack}
      />
    </div>
  );
};

export default AddStock;