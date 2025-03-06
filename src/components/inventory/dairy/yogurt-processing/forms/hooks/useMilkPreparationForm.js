
import { useToast } from "@/components/ui/use-toast";
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/supabase';

export const useMilkPreparationForm = () => {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      console.log('Form submitted with data:', data);
      
      // Original form validation
      const pre_standardization_fat = Number(data.pre_standardization_fat);
      const target_fat = Number(data.target_fat);

      if (pre_standardization_fat > 99.99 || target_fat > 99.99) {
        throw new Error('Fat percentage must be less than 99.99%');
      }

      // Note: The actual database insertion is now handled by useMilkPreparationData
      // This function now only handles validation and UI feedback
      
      // Reset form if needed
      // reset();
      
    } catch (error) {
      console.error('Error validating milk preparation data:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to validate milk preparation record",
        variant: "destructive",
      });
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    reset
  };
};
