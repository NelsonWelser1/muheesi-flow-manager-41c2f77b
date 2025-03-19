
import React, { useState, useEffect } from 'react';
import BulkPayrollTableHeader from './BulkPayrollTableHeader';
import BulkPayrollTableContent from './BulkPayrollTableContent';
import BulkPayrollTableFooter from './BulkPayrollTableFooter';
import { useBulkPayrollCalculations } from './hooks/useBulkPayrollCalculations';

const BulkPayrollTableContainer = ({ records, onUpdateRecords }) => {
  const [localRecords, setLocalRecords] = useState([]);
  const [isCalculating, setIsCalculating] = useState(false);
  
  const { handleInputChange, calculateDeductions, formatCurrency } = useBulkPayrollCalculations({
    localRecords,
    setLocalRecords,
    onUpdateRecords,
    setIsCalculating
  });
  
  // Initialize local records from props
  useEffect(() => {
    setLocalRecords(records);
  }, [records]);
  
  return (
    <div className="space-y-4">
      <BulkPayrollTableHeader 
        isCalculating={isCalculating}
        calculateDeductions={calculateDeductions}
        recordsLength={localRecords.length}
      />
      
      <BulkPayrollTableContent 
        localRecords={localRecords}
        handleInputChange={handleInputChange}
        formatCurrency={formatCurrency}
      />
      
      {localRecords.length > 0 && (
        <BulkPayrollTableFooter 
          localRecords={localRecords} 
          formatCurrency={formatCurrency} 
        />
      )}
    </div>
  );
};

export default BulkPayrollTableContainer;
