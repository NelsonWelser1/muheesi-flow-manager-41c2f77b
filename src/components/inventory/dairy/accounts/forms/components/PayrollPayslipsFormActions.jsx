
import React from 'react';
import { Button } from "@/components/ui/button";
import { Users, Mail, Download, Printer } from "lucide-react";

const PayrollPayslipsFormActions = () => {
  return (
    <div className="flex flex-wrap gap-4">
      <Button type="submit" className="bg-[#0000a0] hover:bg-[#00008b]">Process Payroll</Button>
      <Button 
        type="button" 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={() => console.log("Generating bulk payroll...")}
      >
        <Users className="h-4 w-4" />
        Bulk Payroll Processing
      </Button>
      <Button 
        type="button" 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={() => console.log("Emailing payslip...")}
      >
        <Mail className="h-4 w-4" />
        Email Payslip
      </Button>
      <Button 
        type="button" 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={() => console.log("Downloading payslip PDF...")}
      >
        <Download className="h-4 w-4" />
        Download Payslip PDF
      </Button>
      <Button 
        type="button" 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={() => console.log("Printing payslip...")}
      >
        <Printer className="h-4 w-4" />
        Print Payslip
      </Button>
    </div>
  );
};

export default PayrollPayslipsFormActions;
