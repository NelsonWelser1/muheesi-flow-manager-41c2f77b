
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

/**
 * Exports payroll records to CSV format
 * @param {Array} filteredRecords - Array of payroll records
 * @param {Function} toast - Toast notification function
 */
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
