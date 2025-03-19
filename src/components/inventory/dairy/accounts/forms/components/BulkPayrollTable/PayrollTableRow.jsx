
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const PayrollTableRow = ({ index, record, handleInputChange, formatCurrency }) => {
  return (
    <TableRow>
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
  );
};

export default PayrollTableRow;
