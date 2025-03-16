
import React from 'react';
import ExpenseTypeField from './ExpenseTypeField';
import ExpenseDetailsField from './ExpenseDetailsField';
import AmountField from './AmountField';
import CurrencyField from './CurrencyField';
import PaymentMethodField from './PaymentMethodField';
import StatusField from './StatusField';
import BasicInfoFields from './BasicInfoFields';

const FormFieldGroup = ({ register, errors, setValue }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <BasicInfoFields register={register} errors={errors} />
      
      <ExpenseTypeField register={register} errors={errors} setValue={setValue} />
      <ExpenseDetailsField register={register} />
      
      <AmountField register={register} errors={errors} />
      <CurrencyField register={register} setValue={setValue} />
      
      <PaymentMethodField register={register} setValue={setValue} />
      <StatusField register={register} setValue={setValue} />
    </div>
  );
};

export default FormFieldGroup;
