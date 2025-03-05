
/**
 * Form Submission Hook for Livestock Management
 * 
 * This hook handles the form submission logic for adding and updating livestock records.
 * 
 * Features:
 * - Handles both create and update operations
 * - Provides comprehensive logging for debugging
 * - Includes a debugSubmission function to inspect form values before submission
 * 
 * Usage:
 * 1. Import this hook in your form component
 * 2. Initialize it with required dependencies:
 *    - isEditing: boolean flag indicating if editing an existing record
 *    - resetForm: function to reset the form after submission
 *    - fetchAnimals: function to refresh the livestock data after submission
 * 3. Use the handleSubmit function as your form's submit handler
 * 
 * Example:
 * ```
 * const { handleSubmit, debugSubmission } = useFormSubmit({
 *   isEditing,
 *   resetForm,
 *   fetchAnimals
 * });
 * 
 * // For debugging before submission
 * const onSubmit = (data) => {
 *   const processedData = debugSubmission(data);
 *   handleSubmit(processedData);
 * };
 * ```
 */

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
