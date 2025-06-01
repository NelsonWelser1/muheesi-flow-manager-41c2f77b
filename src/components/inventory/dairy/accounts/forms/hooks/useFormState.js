
import { useState } from 'react';
import { useForm } from "react-hook-form";

export const useFormState = () => {
  const [isRecurring, setIsRecurring] = useState(false);
  const [isSubmissionCooldown, setIsSubmissionCooldown] = useState(false);
  
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      billDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'pending',
      paymentMethod: 'bank_transfer',
      currency: 'UGX',
      isRecurring: false,
      recurringFrequency: '',
      recurringEndDate: '',
      billNumber: '',
      vendorName: '',
      expenseType: '',
      amount: '',
      description: '',
      notes: ''
    }
  });

  const handleRecurringToggle = (checked) => {
    setIsRecurring(checked);
    setValue("isRecurring", checked);
    if (!checked) {
      setValue("recurringFrequency", "");
      setValue("recurringEndDate", "");
    }
  };

  const startSubmissionCooldown = () => {
    setIsSubmissionCooldown(true);
    setTimeout(() => {
      setIsSubmissionCooldown(false);
    }, 5000);
  };

  return {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    errors,
    isRecurring,
    isSubmissionCooldown,
    handleRecurringToggle,
    startSubmissionCooldown
  };
};
