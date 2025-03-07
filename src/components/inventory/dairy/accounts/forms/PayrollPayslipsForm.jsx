
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import PayrollPayslipsFormFields from './components/PayrollPayslipsFormFields';
import PayrollPayslipsFormActions from './components/PayrollPayslipsFormActions';
import { usePayrollPayslipsForm } from './hooks/usePayrollPayslipsForm';

const PayrollPayslipsForm = ({ onBack }) => {
  const { 
    register, 
    handleSubmit, 
    setValue, 
    watch,
    errors, 
    onSubmit,
    generatePayslipNumber 
  } = usePayrollPayslipsForm();

  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Payroll & Payslips Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <PayrollPayslipsFormFields 
              register={register}
              errors={errors}
              setValue={setValue}
              watch={watch}
              generatePayslipNumber={generatePayslipNumber}
            />
            <PayrollPayslipsFormActions />
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayrollPayslipsForm;
