
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase";

export const useDeliveryForm = () => {
  const [showRecords, setShowRecords] = useState(false);
  const [serverErrors, setServerErrors] = useState({});
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const getFieldError = (fieldName) => {
    return errors[fieldName] ? errors[fieldName].message : serverErrors[fieldName];
  };
  
  const onSubmit = async (data) => {
    try {
      // Note: Authentication check removed - temporarily disabled
      // Authentication is disabled for now since we have no active users

      // Prepare the data
      const deliveryData = {
        ...data,
        // Setting a placeholder value for operator_id since we're not authenticating
        operator_id: 'system-placeholder', 
        created_at: new Date().toISOString()
      };

      // Submit to Supabase
      const { error } = await supabase
        .from('logistics_deliveries')
        .insert([deliveryData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Delivery created successfully",
      });
      
      reset();
      setServerErrors({});
    } catch (error) {
      console.error('Error creating delivery:', error);
      toast({
        title: "Error",
        description: "Failed to create delivery",
        variant: "destructive",
      });
      setServerErrors({ submit: error.message });
    }
  };

  const handleReset = () => {
    reset();
    setServerErrors({});
  };

  return {
    register,
    setValue,
    handleSubmit,
    onSubmit,
    getFieldError,
    showRecords,
    setShowRecords,
    serverErrors,
    handleReset
  };
};
