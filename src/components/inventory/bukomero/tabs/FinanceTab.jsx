
import React from 'react';
import DairyLedger from '../finance/DairyLedger';

const FinanceTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Financial Management</h3>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <DairyLedger />
      </div>
    </div>
  );
};

export default FinanceTab;
