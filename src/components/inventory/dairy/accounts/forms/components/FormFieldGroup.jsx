
import React from 'react';
import BillNumberField from './BillNumberField';
import BasicInfoFields from './BasicInfoFields';
import ExpenseTypeField from './ExpenseTypeField';
import AmountField from './AmountField';
import CurrencyField from './CurrencyField';
import PaymentMethodField from './PaymentMethodField';
import StatusField from './StatusField';
import ExpenseDetailsField from './ExpenseDetailsField';

const FormFieldGroup = ({ register, errors, setValue }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <BillNumberField register={register} errors={errors} />
      <BasicInfoFields register={register} errors={errors} />
      <div className="space-y-4">
        <ExpenseTypeField register={register} errors={errors} />
        <ExpenseDetailsField register={register} />
      </div>
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <AmountField register={register} errors={errors} />
          </div>
          <div className="w-24">
            <CurrencyField register={register} errors={errors} />
          </div>
        </div>
        <PaymentMethodField register={register} errors={errors} />
        <StatusField register={register} errors={errors} />
      </div>
    </div>
  );
};

export default FormFieldGroup;
