
import React from 'react';
import PaymentTypeField from './PaymentTypeField';
import PaymentNumberField from './PaymentNumberField';
import PartyNameField from './PartyNameField';
import PaymentDetailsFields from './PaymentDetailsFields';
import PaymentFormActions from './PaymentFormActions';

const PaymentFormContent = ({ register, errors, setValue, watch, paymentNumber }) => {
  const paymentType = watch('paymentType');
  
  return (
    <form className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PaymentTypeField register={register} setValue={setValue} />
        <PaymentNumberField register={register} value={paymentNumber} />
        <PartyNameField register={register} errors={errors} paymentType={paymentType} />
        <PaymentDetailsFields register={register} errors={errors} setValue={setValue} />
      </div>
      <PaymentFormActions paymentType={paymentType} />
    </form>
  );
};

export default PaymentFormContent;
