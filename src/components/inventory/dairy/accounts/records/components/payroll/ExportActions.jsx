
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

const ExportActions = ({ filteredRecords }) => {
  const { toast } = useToast();

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredRecords.map(record => ({
        'Payslip Number': record.payslipNumber,
        'Employee Name': record.employeeName,
        'Employee ID': record.employeeId,
        'Department': record.department,
        'Salary Period': record.salaryPeriod,
        'Payment Date': record.paymentDate ? format(new Date(record.paymentDate), 'yyyy-MM-dd') : '',
        'Basic Salary': record.basicSalary,
        'Tax Amount': record.taxAmount,
        'NSSF Amount': record.nssfAmount,
        'Loan Deduction': record.loanDeduction,
        'Other Deductions': record.otherDeductions,
        'Net Salary': record.netSalary,
        'Currency': record.currency,
        'Payment Status': record.paymentStatus,
        'Payment Method': record.paymentMethod,
        'Notes': record.notes
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Payroll & Payslips');
    XLSX.writeFile(workbook, 'payroll-payslips.xlsx');
    
    toast({
      title: "Export Successful",
      description: "Excel file has been downloaded successfully."
    });
  };

  const exportToCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredRecords.map(record => ({
        'Payslip Number': record.payslipNumber,
        'Employee Name': record.employeeName,
        'Employee ID': record.employeeId,
        'Department': record.department,
        'Salary Period': record.salaryPeriod,
        'Payment Date': record.paymentDate ? format(new Date(record.paymentDate), 'yyyy-MM-dd') : '',
        'Basic Salary': record.basicSalary,
        'Tax Amount': record.taxAmount,
        'NSSF Amount': record.nssfAmount,
        'Loan Deduction': record.loanDeduction,
        'Other Deductions': record.otherDeductions,
        'Net Salary': record.netSalary,
        'Currency': record.currency,
        'Payment Status': record.paymentStatus,
        'Payment Method': record.paymentMethod,
        'Notes': record.notes
      }))
    );
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'payroll-payslips.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Successful",
      description: "CSV file has been downloaded successfully."
    });
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Payroll & Payslips Report', 14, 16);
    
    doc.autoTable({
      head: [['Payslip #', 'Employee', 'Department', 'Date', 'Gross Salary', 'Net Salary', 'Status']],
      body: filteredRecords.map(record => [
        record.payslipNumber,
        `${record.employeeName} (${record.employeeId})`,
        record.department,
        record.paymentDate ? format(new Date(record.paymentDate), 'yyyy-MM-dd') : '',
        `${record.currency} ${record.basicSalary}`,
        `${record.currency} ${record.netSalary}`,
        record.paymentStatus
      ]),
      startY: 20,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [0, 0, 160],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      }
    });
    
    doc.save('payroll-payslips.pdf');
    
    toast({
      title: "Export Successful",
      description: "PDF file has been downloaded successfully."
    });
  };
  
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="sm"
        onClick={exportToExcel}
        className="flex items-center gap-1"
        title="Export to Excel"
      >
        <FileSpreadsheet className="h-4 w-4" />
        Excel
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={exportToCSV}
        className="flex items-center gap-1"
        title="Export to CSV"
      >
        <Download className="h-4 w-4" />
        CSV
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={exportToPDF}
        className="flex items-center gap-1"
        title="Export to PDF"
      >
        <FileText className="h-4 w-4" />
        PDF
      </Button>
    </div>
  );
};

export default ExportActions;
