
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

const ExportActions = ({ filteredRecords }) => {
  const { toast } = useToast();

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredRecords.map(record => ({
        'Payslip Number': record.payslip_number,
        'Employee Name': record.employee_name,
        'Employee ID': record.employee_id,
        'Department': record.department,
        'Salary Period': record.salary_period,
        'Payment Date': record.payment_date ? format(new Date(record.payment_date), 'yyyy-MM-dd') : '',
        'Basic Salary': record.basic_salary,
        'Tax Amount': record.tax_amount,
        'NSSF Amount': record.nssf_amount,
        'Loan Deduction': record.loan_deduction,
        'Other Deductions': record.other_deductions,
        'Net Salary': record.net_salary,
        'Currency': record.currency,
        'Payment Status': record.payment_status,
        'Payment Method': record.payment_method,
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
        'Payslip Number': record.payslip_number,
        'Employee Name': record.employee_name,
        'Employee ID': record.employee_id,
        'Department': record.department,
        'Salary Period': record.salary_period,
        'Payment Date': record.payment_date ? format(new Date(record.payment_date), 'yyyy-MM-dd') : '',
        'Basic Salary': record.basic_salary,
        'Tax Amount': record.tax_amount,
        'NSSF Amount': record.nssf_amount,
        'Loan Deduction': record.loan_deduction,
        'Other Deductions': record.other_deductions,
        'Net Salary': record.net_salary,
        'Currency': record.currency,
        'Payment Status': record.payment_status,
        'Payment Method': record.payment_method,
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
    try {
      // Create a new PDF document
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(16);
      doc.text('Payroll & Payslips Report', 14, 15);
      doc.setFontSize(10);
      doc.text(`Generated on: ${format(new Date(), 'dd MMM yyyy, HH:mm')}`, 14, 20);
      
      // Add table with data
      doc.autoTable({
        head: [['Payslip #', 'Employee', 'Department', 'Date', 'Gross Salary', 'Net Salary', 'Status']],
        body: filteredRecords.map(record => [
          record.payslip_number,
          `${record.employee_name} (${record.employee_id})`,
          record.department || 'N/A',
          record.payment_date ? format(new Date(record.payment_date), 'yyyy-MM-dd') : '',
          `${record.currency} ${record.basic_salary}`,
          `${record.currency} ${record.net_salary}`,
          record.payment_status
        ]),
        startY: 25,
        theme: 'grid',
        styles: {
          fontSize: 8,
          cellPadding: 2
        },
        headStyles: {
          fillColor: [71, 85, 105],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240]
        }
      });
      
      // Add page footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, {
          align: 'center'
        });
      }
      
      // Save the PDF
      doc.save('payroll-payslips.pdf');
      
      toast({
        title: "Export Successful",
        description: "PDF file has been downloaded successfully."
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "Export Failed",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive"
      });
    }
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
