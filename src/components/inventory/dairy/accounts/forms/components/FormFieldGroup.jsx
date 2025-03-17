
import React from 'react';
import BasicInfoFields from './BasicInfoFields';
import ExpenseDetailsFields from './ExpenseDetailsFields';

const FormFieldGroup = ({ register, errors, setValue }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-4">
        <BasicInfoFields register={register} errors={errors} />
      </div>
      <div className="space-y-4">
        <ExpenseDetailsFields register={register} errors={errors} setValue={setValue} />
      </div>
    </div>
  );
};

export default FormFieldGroup;
