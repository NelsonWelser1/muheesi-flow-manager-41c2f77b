
import { useToast } from "@/hooks/use-toast";
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/supabase';
import { useSupabaseAuth } from '@/integrations/supabase/auth';

export const useMilkPreparationForm = () => {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const auth = useSupabaseAuth();
  const session = auth?.session;

  const onSubmit = async (data) => {
    try {
      if (!session?.user) {
        throw new Error('You must be logged in to submit records');
      }

      const pre_standardization_fat = Number(data.pre_standardization_fat);
      const target_fat = Number(data.target_fat);

      if (pre_standardization_fat > 99.99 || target_fat > 99.99) {
        throw new Error('Fat percentage must be less than 99.99%');
      }

      const { error } = await supabase
        .from('yogurt_milk_preparation')
        .insert([{
          ...data,
          pre_standardization_fat,
          target_fat,
          milk_volume: Number(data.milk_volume),
          homogenization_duration: Number(data.homogenization_duration),
          operator_id: session.user.id,
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Milk preparation record added successfully",
      });

      reset();
    } catch (error) {
      console.error('Error submitting milk preparation data:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add milk preparation record",
        variant: "destructive",
      });
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
  };
};
