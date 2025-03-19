
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

/**
 * Exports payroll records to Excel format
 * @param {Array} filteredRecords - Array of payroll records
 * @param {Function} toast - Toast notification function
 */
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
