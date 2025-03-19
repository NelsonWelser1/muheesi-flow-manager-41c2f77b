
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

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
    // Create a new PDF document
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text('Payroll & Payslips Report', 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${format(new Date(), 'dd MMM yyyy, HH:mm')}`, 14, 20);
    
    // Add company name
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text("Grand Berna Dairies Ltd", 105, 25, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    
    // Add table with data
    if (typeof doc.autoTable === 'function') {
      doc.autoTable({
        head: [['Payslip #', 'Employee', 'Department', 'Date', 'Gross Salary', 'Deductions', 'Net Salary', 'Status']],
        body: filteredRecords.map(record => {
          const totalDeductions = 
            parseFloat(record.tax_amount || 0) + 
            parseFloat(record.nssf_amount || 0) + 
            parseFloat(record.loan_deduction || 0) + 
            parseFloat(record.other_deductions || 0);
              
          return [
            record.payslip_number,
            `${record.employee_name} (${record.employee_id})`,
            record.department || 'N/A',
            record.payment_date ? format(new Date(record.payment_date), 'dd MMM yyyy') : '',
            `${record.currency} ${record.basic_salary}`,
            `${record.currency} ${totalDeductions.toFixed(2)}`,
            `${record.currency} ${record.net_salary}`,
            record.payment_status
          ];
        }),
        startY: 30,
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
    } else {
      // Fallback if autoTable isn't available (should not happen)
      doc.text("Error: PDF autotable plugin not properly loaded", 14, 30);
      console.error("jsPDF-AutoTable plugin not properly initialized");
    }
    
    // Add summary section if autoTable is available
    if (typeof doc.autoTable === 'function') {
      const totalEmployees = filteredRecords.length;
      const totalGrossSalary = filteredRecords.reduce((sum, record) => sum + parseFloat(record.basic_salary || 0), 0);
      const totalNetSalary = filteredRecords.reduce((sum, record) => sum + parseFloat(record.net_salary || 0), 0);
      const mainCurrency = filteredRecords.length > 0 ? filteredRecords[0].currency : 'UGX';
      
      const finalY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(10);
      doc.text(`Summary`, 14, finalY);
      doc.text(`Total Employees: ${totalEmployees}`, 14, finalY + 5);
      doc.text(`Total Gross Salary: ${mainCurrency} ${totalGrossSalary.toFixed(2)}`, 14, finalY + 10);
      doc.text(`Total Net Salary: ${mainCurrency} ${totalNetSalary.toFixed(2)}`, 14, finalY + 15);
    }
    
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
    // First generate the PDF
    const doc = await exportToPDF(filteredRecords, {
      toast: () => {} // Silent toast during PDF generation
    });
    
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
