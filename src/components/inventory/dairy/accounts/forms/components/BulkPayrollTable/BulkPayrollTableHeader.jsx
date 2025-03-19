
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calculator, RefreshCw } from 'lucide-react';

const BulkPayrollTableHeader = ({ isCalculating, calculateDeductions, recordsLength }) => {
  return (
    <div className="flex justify-between items-center mb-2">
      <h3 className="font-medium">Review Employee Payroll Data</h3>
      <Button 
        variant="outline" 
        onClick={calculateDeductions}
        disabled={isCalculating || recordsLength === 0}
      >
        {isCalculating ? (
          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Calculator className="mr-2 h-4 w-4" />
        )}
        Auto-Calculate Deductions
      </Button>
    </div>
  );
};

export default BulkPayrollTableHeader;
