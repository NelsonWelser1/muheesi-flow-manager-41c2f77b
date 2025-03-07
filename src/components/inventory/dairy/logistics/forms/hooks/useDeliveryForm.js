
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { useDeliveries } from "../../hooks/useDeliveries";

export const useDeliveryForm = () => {
  const { register, handleSubmit, reset, setValue, formState: { errors: formErrors } } = useForm();
  const { toast } = useToast();
  const [showRecords, setShowRecords] = useState(false);
  const { createDelivery, validationErrors, setValidationErrors } = useDeliveries();
  const [serverErrors, setServerErrors] = useState({});

  const onSubmit = async (data) => {
    console.log('Form data before submission:', data);
    setServerErrors({});
    
    try {
      const { success, validationErrors: serverValidationErrors } = await createDelivery({
        ...data,
      });

      if (serverValidationErrors) {
        setServerErrors(serverValidationErrors);
      }

      if (success) {
        toast({
          title: "Success",
          description: "Delivery record saved successfully",
        });
        reset();
        setValidationErrors({});
        setServerErrors({});
      }
    } catch (error) {
      console.error('Error saving delivery record:', error);
      toast({
        title: "Error",
        description: "Failed to save delivery record",
        variant: "destructive",
      });
    }
  };

  // Combine client-side and server-side validation errors
  const getFieldError = (fieldName) => {
    return formErrors[fieldName]?.message || serverErrors[fieldName] || validationErrors[fieldName];
  };

  const handleReset = () => {
    reset();
    setValidationErrors({});
    setServerErrors({});
  };

  return {
    register,
    handleSubmit,
    setValue,
    formErrors,
    onSubmit,
    getFieldError,
    showRecords,
    setShowRecords,
    serverErrors,
    handleReset
  };
};
