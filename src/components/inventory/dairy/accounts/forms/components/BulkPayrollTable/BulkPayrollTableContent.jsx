
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import PayrollTableRow from './PayrollTableRow';
import EmptyTableRow from './EmptyTableRow';

const BulkPayrollTableContent = ({ localRecords, handleInputChange, formatCurrency }) => {
  return (
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
                <PayrollTableRow 
                  key={index} 
                  index={index} 
                  record={record} 
                  handleInputChange={handleInputChange} 
                  formatCurrency={formatCurrency} 
                />
              ))
            ) : (
              <EmptyTableRow />
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BulkPayrollTableContent;
