
import React from 'react';

const BulkPayrollTableFooter = ({ localRecords, formatCurrency }) => {
  const totalNetSalary = localRecords.reduce(
    (sum, record) => sum + (parseFloat(record.netSalary) || 0), 
    0
  );
  
  const currency = localRecords[0]?.currency || 'UGX';
  
  return (
    <div className="text-sm text-gray-500">
      Total: {localRecords.length} employee records | 
      Total net salary: {formatCurrency(totalNetSalary, currency)}
    </div>
  );
};

export default BulkPayrollTableFooter;
