
import React, { useState, useCallback } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Upload, FileSpreadsheet, CheckCircle, Save, RefreshCw, XCircle } from "lucide-react";
import BulkPayrollTable from "./components/BulkPayrollTable";
import ImportEmployeesForm from "./components/ImportEmployeesForm";
import { usePayrollPayslips } from './hooks/usePayrollPayslips';

const BulkPayrollModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("import");
  const [employeeRecords, setEmployeeRecords] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [importedCount, setImportedCount] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const { toast } = useToast();
  const { submitPayrollRecord, generatePayslipNumber } = usePayrollPayslips();

  // Handle imported employees data
  const handleEmployeesImported = (employees) => {
    // Add payslip number and default values to each employee
    const enrichedEmployees = employees.map(emp => ({
      ...emp,
      payslipNumber: generatePayslipNumber(),
      paymentDate: new Date().toISOString().split('T')[0],
      salaryPeriod: emp.salaryPeriod || 'monthly',
      paymentStatus: 'pending',
      currency: emp.currency || 'UGX',
      paymentMethod: emp.paymentMethod || 'bank_transfer',
      taxAmount: emp.taxAmount || 0,
      nssfAmount: emp.nssfAmount || 0,
      loanDeduction: emp.loanDeduction || 0,
      otherDeductions: emp.otherDeductions || 0,
      netSalary: calculateNetSalary(emp)
    }));
    
    setEmployeeRecords(enrichedEmployees);
    setImportedCount(enrichedEmployees.length);
    setActiveTab("review");
    
    toast({
      title: "Data Imported",
      description: `${enrichedEmployees.length} employee records ready for review`,
    });
  };

  // Calculate net salary based on basic salary and deductions
  const calculateNetSalary = (employee) => {
    const basicSalary = parseFloat(employee.basicSalary) || 0;
    const taxAmount = parseFloat(employee.taxAmount) || 0;
    const nssfAmount = parseFloat(employee.nssfAmount) || 0;
    const loanDeduction = parseFloat(employee.loanDeduction) || 0;
    const otherDeductions = parseFloat(employee.otherDeductions) || 0;
    
    const totalDeductions = taxAmount + nssfAmount + loanDeduction + otherDeductions;
    return basicSalary - totalDeductions;
  };

  // Handle updates to employee records in the table
  const handleUpdateEmployeeData = (updatedRecords) => {
    // Recalculate net salary for all records
    const recalculatedRecords = updatedRecords.map(emp => ({
      ...emp,
      netSalary: calculateNetSalary(emp)
    }));
    
    setEmployeeRecords(recalculatedRecords);
  };

  // Process all payroll records
  const handleProcessPayroll = async () => {
    if (employeeRecords.length === 0) {
      toast({
        title: "No Records",
        description: "There are no employee records to process",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    let successfulSubmissions = 0;
    
    try {
      // Process records one by one
      for (const record of employeeRecords) {
        const result = await submitPayrollRecord(record);
        if (result.success) {
          successfulSubmissions++;
        }
      }
      
      setSuccessCount(successfulSubmissions);
      
      toast({
        title: "Payroll Processing Complete",
        description: `Successfully processed ${successfulSubmissions} of ${employeeRecords.length} payroll records`,
      });
      
      if (successfulSubmissions === employeeRecords.length) {
        setActiveTab("complete");
      } else {
        toast({
          title: "Warning",
          description: `${employeeRecords.length - successfulSubmissions} records failed to process`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Bulk payroll processing error:", error);
      toast({
        title: "Processing Error",
        description: "An error occurred during payroll processing",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  // Handle dialog close and reset state
  const handleClose = useCallback(() => {
    setEmployeeRecords([]);
    setActiveTab("import");
    setImportedCount(0);
    setSuccessCount(0);
    onClose();
  }, [onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Payroll Processing</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="import" disabled={activeTab === "complete"}>
              1. Import Employees
            </TabsTrigger>
            <TabsTrigger value="review" disabled={employeeRecords.length === 0 || activeTab === "complete"}>
              2. Review & Calculate
            </TabsTrigger>
            <TabsTrigger value="complete" disabled={successCount === 0}>
              3. Complete
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="import" className="space-y-4">
            <ImportEmployeesForm onImport={handleEmployeesImported} />
          </TabsContent>
          
          <TabsContent value="review" className="space-y-4">
            <BulkPayrollTable 
              records={employeeRecords} 
              onUpdateRecords={handleUpdateEmployeeData} 
            />
            
            <div className="mt-4 flex justify-end">
              <Button
                className="bg-[#0000a0] hover:bg-[#00008b]"
                onClick={handleProcessPayroll}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Process Payroll ({employeeRecords.length} employees)
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="complete" className="space-y-4">
            <div className="flex flex-col items-center justify-center py-8">
              <CheckCircle className="text-green-500 h-16 w-16 mb-4" />
              <h3 className="text-xl font-bold">Processing Complete!</h3>
              <p className="text-center my-2">
                Successfully processed {successCount} of {importedCount} payroll records.
              </p>
              <div className="flex gap-4 mt-6">
                <Button variant="outline" onClick={handleClose}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Close
                </Button>
                <Button 
                  className="bg-[#0000a0] hover:bg-[#00008b]"
                  onClick={() => {
                    setActiveTab("import");
                    setEmployeeRecords([]);
                    setSuccessCount(0);
                    setImportedCount(0);
                  }}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Process Another Batch
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default BulkPayrollModal;
