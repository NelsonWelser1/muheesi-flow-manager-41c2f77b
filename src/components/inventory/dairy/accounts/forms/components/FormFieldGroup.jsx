
import React from 'react';
import BillNumberField from './BillNumberField';
import ExpenseTypeField from './ExpenseTypeField';
import AmountField from './AmountField';
import CurrencyField from './CurrencyField';
import PaymentMethodField from './PaymentMethodField';
import StatusField from './StatusField';
import ExpenseDetailsField from './ExpenseDetailsField';

const FormFieldGroup = ({ register, errors, setValue }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-4">
        <BillNumberField register={register} errors={errors} />
        <div className="space-y-2">
          <div className="space-y-2">
            <label className="block text-gray-700">Supplier Name</label>
            <input 
              className="w-full p-2 border border-gray-300 rounded"
              {...register("supplierName", { required: "Supplier name is required" })}
            />
            {errors.supplierName && (
              <p className="text-sm text-red-500">{errors.supplierName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="block text-gray-700">Bill Date</label>
            <input 
              type="date" 
              className="w-full p-2 border border-gray-300 rounded"
              {...register("billDate", { required: "Bill date is required" })}
            />
            {errors.billDate && (
              <p className="text-sm text-red-500">{errors.billDate.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="block text-gray-700">Due Date</label>
            <input 
              type="date" 
              className="w-full p-2 border border-gray-300 rounded"
              {...register("dueDate", { required: "Due date is required" })}
            />
            {errors.dueDate && (
              <p className="text-sm text-red-500">{errors.dueDate.message}</p>
            )}
          </div>
        </div>
      </div>
      <div className="space-y-4">
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
      </div>
    </div>
  );
};

export default FormFieldGroup;
