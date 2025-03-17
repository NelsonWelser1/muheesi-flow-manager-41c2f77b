
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { usePaymentReceiptForm } from "./hooks/usePaymentReceiptForm";
import PaymentFormContent from './components/PaymentFormContent';

const PaymentsReceiptsForm = ({ onBack }) => {
  const { 
    register, 
    handleSubmit, 
    setValue, 
    watch, 
    errors, 
    onSubmit,
    paymentNumber
  } = usePaymentReceiptForm();

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
          <form onSubmit={handleSubmit(onSubmit)}>
            <PaymentFormContent 
              register={register}
              errors={errors}
              setValue={setValue}
              watch={watch}
              paymentNumber={paymentNumber}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsReceiptsForm;
