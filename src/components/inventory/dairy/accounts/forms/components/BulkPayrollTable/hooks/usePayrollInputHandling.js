
import { useCallback } from 'react';

export const usePayrollInputHandling = ({ 
  localRecords, 
  setLocalRecords, 
  onUpdateRecords 
}) => {
  // Handle change in input fields
  const handleInputChange = useCallback((index, field, value) => {
    const updatedRecords = [...localRecords];
    updatedRecords[index][field] = value;
    
    // If changing salary or deductions, recalculate net salary
    if (['basicSalary', 'taxAmount', 'nssfAmount', 'loanDeduction', 'otherDeductions'].includes(field)) {
      const record = updatedRecords[index];
      const basicSalary = parseFloat(record.basicSalary) || 0;
      const taxAmount = parseFloat(record.taxAmount) || 0;
      const nssfAmount = parseFloat(record.nssfAmount) || 0;
      const loanDeduction = parseFloat(record.loanDeduction) || 0;
      const otherDeductions = parseFloat(record.otherDeductions) || 0;
      
      const totalDeductions = taxAmount + nssfAmount + loanDeduction + otherDeductions;
      updatedRecords[index].netSalary = basicSalary - totalDeductions;
    }
    
    setLocalRecords(updatedRecords);
    onUpdateRecords(updatedRecords);
  }, [localRecords, onUpdateRecords, setLocalRecords]);

  return { handleInputChange };
};
