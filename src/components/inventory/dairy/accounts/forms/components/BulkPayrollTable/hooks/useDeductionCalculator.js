
import { useCallback } from 'react';

export const useDeductionCalculator = ({
  localRecords,
  setLocalRecords,
  onUpdateRecords,
  setIsCalculating
}) => {
  // Automatic calculation of tax and NSSF based on basic salary
  const calculateDeductions = useCallback(() => {
    setIsCalculating(true);
    
    setTimeout(() => {
      const updatedRecords = localRecords.map(record => {
        const basicSalary = parseFloat(record.basicSalary) || 0;
        
        // Simple tax calculation (10% of basic salary for demonstration)
        const taxAmount = Math.round(basicSalary * 0.10);
        
        // Simple NSSF calculation (5% of basic salary for demonstration)
        const nssfAmount = Math.round(basicSalary * 0.05);
        
        const loanDeduction = parseFloat(record.loanDeduction) || 0;
        const otherDeductions = parseFloat(record.otherDeductions) || 0;
        
        const totalDeductions = taxAmount + nssfAmount + loanDeduction + otherDeductions;
        const netSalary = basicSalary - totalDeductions;
        
        return {
          ...record,
          taxAmount,
          nssfAmount,
          netSalary
        };
      });
      
      setLocalRecords(updatedRecords);
      onUpdateRecords(updatedRecords);
      setIsCalculating(false);
    }, 800); // Small delay for visual feedback
  }, [localRecords, onUpdateRecords, setIsCalculating, setLocalRecords]);

  return { calculateDeductions };
};
