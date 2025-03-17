
import React from 'react';
import ExpenseTypeField from './ExpenseTypeField';
import ExpenseDetailsField from './ExpenseDetailsField';
import AmountField from './AmountField';
import CurrencyField from './CurrencyField';
import PaymentMethodField from './PaymentMethodField';
import StatusField from './StatusField';

const ExpenseDetailsFields = ({ register, errors, setValue }) => {
  return (
    <>
      <ExpenseTypeField register={register} errors={errors} setValue={setValue} />
      <ExpenseDetailsField register={register} errors={errors} />
      <div className="flex gap-2">
        <div className="flex-1">
          <AmountField register={register} errors={errors} />
        </div>
        <div className="w-24">
          <CurrencyField register={register} errors={errors} setValue={setValue} />
        </div>
      </div>
      <PaymentMethodField register={register} errors={errors} setValue={setValue} />
      <StatusField register={register} errors={errors} setValue={setValue} />
    </>
  );
};

export default ExpenseDetailsFields;
