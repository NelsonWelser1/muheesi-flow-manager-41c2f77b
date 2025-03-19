
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { Calculator, RefreshCw } from 'lucide-react';

const BulkPayrollTable = ({ records, onUpdateRecords }) => {
  const [localRecords, setLocalRecords] = useState([]);
  const [isCalculating, setIsCalculating] = useState(false);
  
  // Initialize local records from props
  useEffect(() => {
    setLocalRecords(records);
  }, [records]);
  
  // Handle change in input fields
  const handleInputChange = (index, field, value) => {
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
  };
  
  // Automatic calculation of tax and NSSF based on basic salary
  const calculateDeductions = () => {
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
  };
  
  // Format currency values
  const formatCurrency = (amount, currency = 'UGX') => {
    if (!amount && amount !== 0) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'UGX',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">Review Employee Payroll Data</h3>
        <Button 
          variant="outline" 
          onClick={calculateDeductions}
          disabled={isCalculating || localRecords.length === 0}
        >
          {isCalculating ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Calculator className="mr-2 h-4 w-4" />
          )}
          Auto-Calculate Deductions
        </Button>
      </div>
      
      <div className="rounded-md border overflow-hidden">
        <div className="max-h-[400px] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-white">
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Basic Salary</TableHead>
                <TableHead>Tax</TableHead>
                <TableHead>NSSF</TableHead>
                <TableHead>Other Ded.</TableHead>
                <TableHead>Net Salary</TableHead>
                <TableHead>Payment Method</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {localRecords.length > 0 ? (
                localRecords.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <div className="font-medium">{record.employeeName}</div>
                      <div className="text-xs text-gray-500">ID: {record.employeeId}</div>
                    </TableCell>
                    <TableCell>
                      <Input 
                        className="h-8"
                        value={record.department || ''} 
                        onChange={(e) => handleInputChange(index, 'department', e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        className="h-8"
                        type="number" 
                        value={record.basicSalary || ''} 
                        onChange={(e) => handleInputChange(index, 'basicSalary', e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        className="h-8"
                        type="number" 
                        value={record.taxAmount || ''} 
                        onChange={(e) => handleInputChange(index, 'taxAmount', e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        className="h-8"
                        type="number" 
                        value={record.nssfAmount || ''} 
                        onChange={(e) => handleInputChange(index, 'nssfAmount', e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        className="h-8"
                        type="number" 
                        value={record.otherDeductions || ''} 
                        onChange={(e) => handleInputChange(index, 'otherDeductions', e.target.value)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(record.netSalary, record.currency)}
                    </TableCell>
                    <TableCell>
                      <Select
                        defaultValue={record.paymentMethod || 'bank_transfer'}
                        onValueChange={(value) => handleInputChange(index, 'paymentMethod', value)}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          <SelectItem value="mobile_money">Mobile Money</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    No employee records loaded
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {localRecords.length > 0 && (
        <div className="text-sm text-gray-500">
          Total: {localRecords.length} employee records | 
          Total net salary: {formatCurrency(
            localRecords.reduce((sum, record) => sum + (parseFloat(record.netSalary) || 0), 0),
            localRecords[0]?.currency || 'UGX'
          )}
        </div>
      )}
    </div>
  );
};

export default BulkPayrollTable;
