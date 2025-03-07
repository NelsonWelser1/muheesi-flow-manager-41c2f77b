
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import PaymentsReceiptsFormFields from './components/PaymentsReceiptsFormFields';
import PaymentsReceiptsFormActions from './components/PaymentsReceiptsFormActions';
import { usePaymentsReceiptsForm } from './hooks/usePaymentsReceiptsForm';

const PaymentsReceiptsForm = ({ onBack }) => {
  const { 
    register, 
    handleSubmit, 
    setValue, 
    watch, 
    errors, 
    paymentType,
    onSubmit, 
    generatePaymentNumber 
  } = usePaymentsReceiptsForm();

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
          <CardTitle>Payments & Receipts Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <PaymentsReceiptsFormFields 
              register={register}
              errors={errors}
              setValue={setValue}
              watch={watch}
              generatePaymentNumber={generatePaymentNumber}
            />
            <PaymentsReceiptsFormActions paymentType={paymentType} />
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsReceiptsForm;
