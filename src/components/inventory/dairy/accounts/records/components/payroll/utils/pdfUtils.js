
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

/**
 * Checks if PDF auto-table functionality is available
 * @param {jsPDF} doc - The jsPDF document
 * @returns {boolean} Whether autoTable is available
 */
export const isAutoTableAvailable = (doc) => {
  return typeof doc.autoTable === 'function';
};

/**
 * Generates a company header in the PDF document
 * @param {jsPDF} doc - The jsPDF document
 * @param {string} title - The document title
 * @param {number} startY - The starting Y position
 * @returns {number} The next Y position after the header
 */
export const addDocumentHeader = (doc, title, startY = 15) => {
  // Add document title
  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.text(title, 105, startY, { align: 'center' });
  
  // Add company name
  doc.setFontSize(12);
  doc.setTextColor(80, 80, 80);
  doc.text("Grand Berna Dairies Ltd", 105, startY + 10, { align: 'center' });
  
  return startY + 20; // Return the next Y position
};

/**
 * Creates a fallback table when autoTable isn't available
 * @param {jsPDF} doc - The jsPDF document
 * @param {number} startY - The starting Y position
 * @param {Array} headers - The table headers
 * @param {Array} rows - The table rows data
 * @returns {number} The final Y position after drawing the table
 */
export const createFallbackTable = (doc, startY, headers, rows) => {
  let y = startY;
  
  // Set up headers
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  
  // Calculate column widths based on the number of columns
  const pageWidth = doc.internal.pageSize.width;
  const margin = 14;
  const tableWidth = pageWidth - (margin * 2);
  const colWidth = tableWidth / headers.length;
  
  // Draw header row
  headers.forEach((header, index) => {
    doc.text(header, margin + (index * colWidth), y);
  });
  y += 5;
  
  // Draw line under headers
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;
  
  // Draw data rows
  doc.setFontSize(9);
  rows.forEach(row => {
    row.forEach((cell, index) => {
      // Handle long text by truncating if needed
      const cellText = String(cell || '');
      const truncatedText = cellText.length > 25 ? cellText.substring(0, 22) + '...' : cellText;
      doc.text(truncatedText, margin + (index * colWidth), y);
    });
    y += 8;
  });
  
  return y;
};

/**
 * Adds a footer to the PDF document
 * @param {jsPDF} doc - The jsPDF document
 */
export const addDocumentFooter = (doc) => {
  // Add page footer with page numbers
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, {
      align: 'center'
    });
  }
  
  // Add generated date and disclaimer
  doc.setPage(1); // Back to first page for the footer
  doc.setFontSize(10);
  doc.text('This is a computer-generated document. No signature is required.', 105, 280, { align: 'center' });
};

/**
 * Generates a payslip PDF for a single employee
 * @param {Object} record - The payslip record
 * @param {Function} formatCurrency - Currency formatting function
 * @returns {jsPDF} The generated PDF document
 */
export const generatePayslipPDF = (record, formatCurrency) => {
  const doc = new jsPDF();
  
  // Add title and company header
  let currentY = addDocumentHeader(doc, "PAYSLIP", 15);
  
  // Add employee information
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text(`Payslip Number: ${record.payslip_number}`, 14, currentY);
  doc.text(`Employee: ${record.employee_name} (ID: ${record.employee_id})`, 14, currentY + 5);
  doc.text(`Department: ${record.department || 'N/A'}`, 14, currentY + 10);
  doc.text(`Payment Date: ${format(new Date(record.payment_date), 'dd MMMM yyyy')}`, 14, currentY + 15);
  doc.text(`Salary Period: ${record.salary_period || 'Monthly'}`, 14, currentY + 20);
  
  currentY += 30;
  
  // Create salary details table
  const headers = ['Description', 'Amount'];
  const rows = [
    ['Basic Salary', formatCurrency(record.basic_salary, record.currency)],
    ['Tax Deduction', formatCurrency(record.tax_amount || 0, record.currency)],
    ['NSSF Contribution', formatCurrency(record.nssf_amount || 0, record.currency)],
    ['Loan Deduction', formatCurrency(record.loan_deduction || 0, record.currency)],
    ['Other Deductions', formatCurrency(record.other_deductions || 0, record.currency)],
    ['Net Salary', formatCurrency(record.net_salary, record.currency)]
  ];
  
  if (isAutoTableAvailable(doc)) {
    doc.autoTable({
      startY: currentY,
      head: [headers],
      body: rows,
      theme: 'striped',
      headStyles: { fillColor: [71, 85, 105], textColor: 255 },
      footStyles: { fillColor: [245, 245, 245], textColor: [100, 100, 100] }
    });
    
    currentY = doc.lastAutoTable.finalY + 10;
  } else {
    currentY = createFallbackTable(doc, currentY, headers, rows) + 10;
  }
  
  // Add payment information
  doc.text(`Payment Status: ${record.payment_status === 'paid' ? 'Paid' : 'Pending'}`, 14, currentY);
  doc.text(`Payment Method: ${record.payment_method || 'N/A'}`, 14, currentY + 5);
  
  // Add document footer
  addDocumentFooter(doc);
  
  return doc;
};

/**
 * Generates a payroll report PDF for multiple employee records
 * @param {Array} records - Array of payroll records
 * @returns {jsPDF} The generated PDF document
 */
export const generatePayrollReportPDF = (records) => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Add title and company header
  let currentY = addDocumentHeader(doc, 'Payroll & Payslips Report', 15);
  
  // Add report generation timestamp
  doc.setFontSize(10);
  doc.text(`Generated on: ${format(new Date(), 'dd MMM yyyy, HH:mm')}`, 14, currentY);
  currentY += 10;
  
  // Prepare table data
  const headers = ['Payslip #', 'Employee', 'Department', 'Date', 'Gross Salary', 'Deductions', 'Net Salary', 'Status'];
  
  const rows = records.map(record => {
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
  });
  
  // Generate table
  if (isAutoTableAvailable(doc)) {
    doc.autoTable({
      startY: currentY,
      head: [headers],
      body: rows,
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
    
    currentY = doc.lastAutoTable.finalY + 10;
  } else {
    currentY = createFallbackTable(doc, currentY, headers, rows) + 10;
  }
  
  // Add summary section
  if (records.length > 0) {
    const totalEmployees = records.length;
    const totalGrossSalary = records.reduce((sum, record) => sum + parseFloat(record.basic_salary || 0), 0);
    const totalNetSalary = records.reduce((sum, record) => sum + parseFloat(record.net_salary || 0), 0);
    const mainCurrency = records.length > 0 ? records[0].currency : 'UGX';
    
    doc.setFontSize(10);
    doc.text(`Summary`, 14, currentY);
    doc.text(`Total Employees: ${totalEmployees}`, 14, currentY + 5);
    doc.text(`Total Gross Salary: ${mainCurrency} ${totalGrossSalary.toFixed(2)}`, 14, currentY + 10);
    doc.text(`Total Net Salary: ${mainCurrency} ${totalNetSalary.toFixed(2)}`, 14, currentY + 15);
  }
  
  // Add document footer
  addDocumentFooter(doc);
  
  return doc;
};
