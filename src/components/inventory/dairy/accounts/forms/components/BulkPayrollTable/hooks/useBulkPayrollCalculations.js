
import { useCallback } from 'react';

export const useBulkPayrollCalculations = ({ 
  localRecords, 
  setLocalRecords, 
  onUpdateRecords,
  setIsCalculating 
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
  
  // Format currency values
  const formatCurrency = useCallback((amount, currency = 'UGX') => {
    if (!amount && amount !== 0) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'UGX',
      minimumFractionDigits: 0
    }).format(amount);
  }, []);

  return {
    handleInputChange,
    calculateDeductions,
    formatCurrency
  };
};
