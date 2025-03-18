
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PaymentFormContent from './components/PaymentFormContent';
import { usePaymentReceiptForm } from './hooks/usePaymentReceiptForm';

const PaymentReceiptForm = ({ setActiveView }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    errors,
    onSubmit,
    paymentNumber
  } = usePaymentReceiptForm(setActiveView);

  return (
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
  );
};

export default PaymentReceiptForm;
