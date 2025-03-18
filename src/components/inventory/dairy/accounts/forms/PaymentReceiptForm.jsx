
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePaymentReceiptForm } from './hooks/usePaymentReceiptForm';
import PaymentTypeField from './components/PaymentTypeField';
import PaymentNumberField from './components/PaymentNumberField';
import PartyNameField from './components/PartyNameField';
import PaymentDetailsFields from './components/PaymentDetailsFields';

const PaymentReceiptForm = ({ setActiveView }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    errors,
    onSubmit,
    paymentNumber,
    isSubmitting
  } = usePaymentReceiptForm(setActiveView);
  
  const paymentType = watch('paymentType');

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-[#f8fafc]">
        <CardTitle className="text-[#0f172a]">Payments & Receipts Form</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PaymentTypeField register={register} setValue={setValue} />
            <PaymentNumberField register={register} value={paymentNumber} />
            <PartyNameField register={register} errors={errors} paymentType={paymentType} />
          </div>
          
          <PaymentDetailsFields 
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
          />
          
          <div className="flex justify-end mt-6">
            <Button 
              type="submit" 
              className="bg-[#0000a0] hover:bg-[#00008b]"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : `Record ${paymentType === 'received' ? 'Receipt' : 'Payment'}`}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentReceiptForm;
