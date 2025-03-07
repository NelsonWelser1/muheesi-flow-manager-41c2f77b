
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import BillsExpensesFormFields from './components/BillsExpensesFormFields';
import BillsExpensesFormActions from './components/BillsExpensesFormActions';
import { useBillsExpensesForm } from './hooks/useBillsExpensesForm';

const BillsExpensesForm = ({ onBack }) => {
  const { 
    register, 
    handleSubmit, 
    setValue, 
    errors, 
    onSubmit, 
    generateBillNumber 
  } = useBillsExpensesForm();
  
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
          <CardTitle>Bills & Expenses Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <BillsExpensesFormFields 
              register={register}
              errors={errors}
              setValue={setValue}
              generateBillNumber={generateBillNumber}
            />
            <BillsExpensesFormActions />
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillsExpensesForm;
