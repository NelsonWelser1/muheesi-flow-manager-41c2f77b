
import React, { useState, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Upload, FileSpreadsheet, Database, AlertCircle } from "lucide-react";
import * as XLSX from 'xlsx';

const ImportEmployeesForm = ({ onImport }) => {
  const [importMethod, setImportMethod] = useState("file");
  const [sampleData, setSampleData] = useState(false);
  const [fileData, setFileData] = useState(null);
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

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

  return (
    <div className="space-y-4">
      <Tabs value={importMethod} onValueChange={setImportMethod}>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="file">Import from File</TabsTrigger>
          <TabsTrigger value="sample">Use Sample Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="file" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-md">
                <FileSpreadsheet className="h-10 w-10 text-gray-400 mb-2" />
                <p className="mb-2 text-sm text-gray-500">Upload Excel or CSV file with employee data</p>
                <Input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                />
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Select File
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={downloadTemplate}
                  >
                    Download Template
                  </Button>
                </div>
              </div>

              {fileData && (
                <div className="mt-4">
                  <p className="text-sm text-green-600 font-medium">
                    ✓ File imported with {fileData.length} employee records
                  </p>
                </div>
              )}
              
              {errors.length > 0 && (
                <div className="mt-4 p-3 bg-red-50 rounded-md border border-red-200">
                  <div className="flex items-center mb-2">
                    <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                    <span className="text-sm font-medium text-red-800">
                      Please fix the following issues:
                    </span>
                  </div>
                  <ul className="text-xs text-red-700 pl-6 list-disc">
                    {errors.slice(0, 5).map((error, idx) => (
                      <li key={idx}>{error}</li>
                    ))}
                    {errors.length > 5 && (
                      <li>...and {errors.length - 5} more errors</li>
                    )}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sample">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-md">
                <Database className="h-10 w-10 text-gray-400 mb-2" />
                <p className="mb-2 text-sm text-gray-500">Generate sample employee data for demonstration</p>
                <Button 
                  variant="outline" 
                  onClick={generateSampleData}
                  disabled={sampleData}
                >
                  Generate Sample Data
                </Button>
              </div>
              {sampleData && (
                <div className="mt-4">
                  <p className="text-sm text-green-600 font-medium">
                    ✓ Sample data generated with {fileData?.length || 0} employee records
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button 
          className="bg-[#0000a0] hover:bg-[#00008b]"
          onClick={handleSubmit}
          disabled={!fileData || fileData.length === 0 || errors.length > 0}
        >
          Continue to Review
        </Button>
      </div>
    </div>
  );
};

export default ImportEmployeesForm;
