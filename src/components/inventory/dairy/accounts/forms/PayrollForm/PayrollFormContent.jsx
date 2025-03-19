
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { usePayrollForm } from './hooks/usePayrollForm';
import EmployeeDetailsSection from './sections/EmployeeDetailsSection';
import SalaryDetailsSection from './sections/SalaryDetailsSection';
import DeductionsSection from './sections/DeductionsSection';
import PaymentDetailsSection from './sections/PaymentDetailsSection';
import NetSalarySection from './sections/NetSalarySection';
import NotesSection from './sections/NotesSection';

const PayrollFormContent = ({ onOpenBulkModal }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    errors,
    onSubmit,
    loading,
    netSalary
  } = usePayrollForm();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payroll & Payslips Form</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EmployeeDetailsSection 
              register={register} 
              errors={errors}
              setValue={setValue}
            />

            <SalaryDetailsSection 
              register={register} 
              errors={errors}
              setValue={setValue}
              watch={watch}
            />
          </div>

          <DeductionsSection 
            register={register} 
            errors={errors}
          />

          <NetSalarySection netSalary={netSalary} />

          <PaymentDetailsSection 
            register={register} 
            setValue={setValue}
          />

          <NotesSection register={register} />

          <div className="flex flex-wrap gap-4">
            <Button type="submit" className="bg-[#0000a0] hover:bg-[#00008b]" disabled={loading}>
              {loading ? "Processing..." : "Process Payroll"}
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              className="flex items-center gap-2" 
              onClick={onOpenBulkModal}
            >
              <Users className="h-4 w-4" />
              Bulk Payroll Processing
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PayrollFormContent;
