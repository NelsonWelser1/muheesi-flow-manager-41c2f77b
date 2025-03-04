
import { supabase } from "@/integrations/supabase";
import { toast } from "sonner";

export const useFormSubmit = ({ isEditing, resetForm, fetchAnimals }) => {
  const handleSubmit = async (values) => {
    try {
      if (isEditing) {
        const { error } = await supabase
          .from('livestock')
          .update(values)
          .eq('id', values.id);
        
        if (error) throw error;
        toast.success('Livestock record updated successfully');
      } else {
        const { error } = await supabase
          .from('livestock')
          .insert([values]);
        
        if (error) throw error;
        toast.success('Livestock record added successfully');
      }
      
      resetForm();
      fetchAnimals();
    } catch (error) {
      console.error('Error saving livestock:', error);
      toast.error(isEditing ? 'Failed to update record' : 'Failed to add record');
    }
  };

  return { handleSubmit };
};
