import React from 'react';
import StockUpdateForm from '../StockUpdateForm';

const RecordLoss = ({ location, onSubmit, onBack }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Record Loss at {location}</h3>
      <StockUpdateForm 
        action="remove"
        onSubmit={onSubmit}
        onBack={onBack}
      />
    </div>
  );
};

export default RecordLoss;