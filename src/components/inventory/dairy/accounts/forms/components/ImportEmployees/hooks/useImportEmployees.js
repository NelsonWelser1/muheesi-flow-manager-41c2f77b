
import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';

export const useImportEmployees = ({ onImport, toast }) => {
  const [sampleData, setSampleData] = useState(false);
  const [fileData, setFileData] = useState(null);
  const [errors, setErrors] = useState([]);
  
  // Generate sample data for demo purposes
  const generateSampleData = () => {
    const sampleEmployees = [
      {
        employeeName: "John Doe",
        employeeId: "EMP-001",
        department: "Production",
        basicSalary: 1500000,
        taxAmount: 150000,
        nssfAmount: 75000,
      },
      {
        employeeName: "Jane Smith",
        employeeId: "EMP-002",
        department: "Accounting",
        basicSalary: 1800000,
        taxAmount: 180000,
        nssfAmount: 90000,
      },
      {
        employeeName: "Michael Johnson",
        employeeId: "EMP-003",
        department: "Logistics",
        basicSalary: 1200000,
        taxAmount: 120000,
        nssfAmount: 60000,
      }
    ];
    
    setSampleData(true);
    setFileData(sampleEmployees);
    
    toast({
      title: "Sample Data Generated",
      description: "Sample employee data has been loaded for demonstration"
    });
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setErrors([]);
    
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Validate and normalize data
        const validationErrors = [];
        const normalizedData = jsonData.map((row, index) => {
          // Check required fields
          if (!row.employeeName) {
            validationErrors.push(`Row ${index + 1}: Missing employee name`);
          }
          if (!row.employeeId) {
            validationErrors.push(`Row ${index + 1}: Missing employee ID`);
          }
          if (!row.basicSalary) {
            validationErrors.push(`Row ${index + 1}: Missing basic salary`);
          }
          
          // Normalize field names (handle different case and spacing in column headers)
          return {
            employeeName: row.employeeName || row.EmployeeName || row['Employee Name'] || '',
            employeeId: row.employeeId || row.EmployeeId || row['Employee ID'] || '',
            department: row.department || row.Department || row['Department'] || '',
            basicSalary: parseFloat(row.basicSalary || row.BasicSalary || row['Basic Salary'] || 0),
            taxAmount: parseFloat(row.taxAmount || row.TaxAmount || row['Tax Amount'] || 0),
            nssfAmount: parseFloat(row.nssfAmount || row.NssfAmount || row['NSSF Amount'] || 0),
            loanDeduction: parseFloat(row.loanDeduction || row.LoanDeduction || row['Loan Deduction'] || 0),
            otherDeductions: parseFloat(row.otherDeductions || row.OtherDeductions || row['Other Deductions'] || 0),
            salaryPeriod: row.salaryPeriod || row.SalaryPeriod || row['Salary Period'] || 'monthly',
            currency: row.currency || row.Currency || 'UGX',
            paymentMethod: row.paymentMethod || row.PaymentMethod || row['Payment Method'] || 'bank_transfer',
          };
        });
        
        if (validationErrors.length > 0) {
          setErrors(validationErrors);
          toast({
            title: "Validation Errors",
            description: `${validationErrors.length} errors found in data. Please check the details.`,
            variant: "destructive"
          });
        } else {
          setFileData(normalizedData);
          toast({
            title: "File Imported",
            description: `Successfully imported ${normalizedData.length} employee records`
          });
        }
      } catch (error) {
        console.error("File import error:", error);
        toast({
          title: "Import Error",
          description: "Failed to parse the Excel/CSV file. Please check the file format.",
          variant: "destructive"
        });
      }
    };
    
    reader.onerror = () => {
      toast({
        title: "Import Error",
        description: "Failed to read the file",
        variant: "destructive"
      });
    };
    
    reader.readAsBinaryString(file);
  };

  // Download template file
  const downloadTemplate = () => {
    const template = [
      {
        "Employee Name": "John Doe",
        "Employee ID": "EMP-001",
        "Department": "Department Name",
        "Basic Salary": 1500000,
        "Tax Amount": 150000,
        "NSSF Amount": 75000,
        "Loan Deduction": 0,
        "Other Deductions": 0,
        "Salary Period": "monthly",
        "Currency": "UGX",
        "Payment Method": "bank_transfer"
      }
    ];
    
    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employee Template");
    XLSX.writeFile(workbook, "payroll_import_template.xlsx");
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!fileData || fileData.length === 0) {
      toast({
        title: "No Data",
        description: "Please import employee data first",
        variant: "destructive"
      });
      return;
    }
    
    if (errors.length > 0) {
      toast({
        title: "Validation Errors",
        description: "Please fix validation errors before proceeding",
        variant: "destructive"
      });
      return;
    }
    
    onImport(fileData);
  };

  return {
    sampleData,
    fileData,
    errors,
    handleFileUpload,
    generateSampleData,
    downloadTemplate,
    handleSubmit
  };
};
