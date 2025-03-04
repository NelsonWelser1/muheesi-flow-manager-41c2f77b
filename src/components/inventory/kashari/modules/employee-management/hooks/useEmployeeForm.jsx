
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase';
import { useToast } from "@/components/ui/use-toast";

export const useEmployeeForm = (form) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Add employee mutation
  const addEmployeeMutation = useMutation({
    mutationFn: async (newEmployee) => {
      const { data, error } = await supabase
        .from('personnel_employee_records')
        .insert([newEmployee]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personnel_employee_records'] });
      toast({
        title: "Success",
        description: "Employee added successfully"
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add employee: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Handle form submission
  const onSubmit = (data) => {
    // Convert the employee data properly before submitting
    const formattedData = {
      ...data,
      base_salary: parseFloat(data.base_salary) || 0
    };
    
    addEmployeeMutation.mutate(formattedData);
  };

  return { onSubmit };
};
