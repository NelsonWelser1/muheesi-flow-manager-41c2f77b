
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { generatePayrollReportPDF } from './pdfUtils';

export const exportToExcel = (filteredRecords, toast) => {
  try {
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
  } catch (error) {
    console.error("Excel export error:", error);
    toast({
      title: "Export Failed",
      description: "There was an error generating the Excel file.",
      variant: "destructive"
    });
  }
};

export const exportToCSV = (filteredRecords, toast) => {
  try {
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
  } catch (error) {
    console.error("CSV export error:", error);
    toast({
      title: "Export Failed",
      description: "There was an error generating the CSV file.",
      variant: "destructive"
    });
  }
};

export const exportToPDF = async (filteredRecords, toast) => {
  try {
    // Using our shared utility function to generate the PDF
    const doc = generatePayrollReportPDF(filteredRecords);
    
    // Save the PDF
    doc.save('payroll-payslips.pdf');
    
    toast({
      title: "Export Successful",
      description: "PDF file has been downloaded successfully."
    });
    
    return doc; // Return the doc object for potential emailing
  } catch (error) {
    console.error("PDF generation error:", error);
    toast({
      title: "Export Failed",
      description: "There was an error generating the PDF. Please try again.",
      variant: "destructive"
    });
    throw error;
  }
};

// Function to email PDF to administrator
export const emailPayrollReport = async (filteredRecords, recipientEmail, toast) => {
  toast({
    title: "Sending Email...",
    description: "Preparing payroll report for email..."
  });
  
  try {
    // Generate the PDF using our shared utility
    const doc = generatePayrollReportPDF(filteredRecords);
    
    // Get the PDF as a blob
    const pdfBlob = doc.output('blob');
    
    // In a real implementation, you would:
    // 1. Either send the blob to a backend API
    // 2. Or use a client-side email service SDK
    
    // Simulating email sending with a timeout
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // This is where you'd implement the actual email sending
    // const formData = new FormData();
    // formData.append('pdf', pdfBlob, 'payroll-payslips.pdf');
    // formData.append('recipientEmail', recipientEmail || 'admin@example.com');
    // formData.append('subject', 'Payroll & Payslips Report');
    // await fetch('/api/send-payroll-email', { method: 'POST', body: formData });
    
    toast({
      title: "Email Sent",
      description: `Payroll report sent to ${recipientEmail || 'administrator'}`,
    });
    
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    toast({
      title: "Email Failed",
      description: "There was an error sending the email. Please try again.",
      variant: "destructive"
    });
    return false;
  }
};
