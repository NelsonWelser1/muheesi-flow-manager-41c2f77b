import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useKashariEmployees = () => {
  const { toast } = useToast();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('kashari_employees')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEmployees(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to load employees",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addEmployee = async (employeeData) => {
    try {
      // Generate employee_id
      const { count } = await supabase
        .from('kashari_employees')
        .select('*', { count: 'exact', head: true });
      
      const newEmployeeId = `EMP${String((count || 0) + 1).padStart(3, '0')}`;

      const { data, error } = await supabase
        .from('kashari_employees')
        .insert([{ 
          ...employeeData,
          employee_id: newEmployeeId,
          company: 'Kashari Farm'
        }])
        .select()
        .single();

      if (error) throw error;
      
      setEmployees(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Employee added successfully"
      });
      return { success: true, data };
    } catch (err) {
      console.error('Error adding employee:', err);
      toast({
        title: "Error",
        description: "Failed to add employee",
        variant: "destructive"
      });
      return { success: false, error: err };
    }
  };

  const updateEmployee = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('kashari_employees')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setEmployees(prev => prev.map(emp => emp.id === id ? data : emp));
      toast({
        title: "Success",
        description: "Employee updated successfully"
      });
      return { success: true, data };
    } catch (err) {
      console.error('Error updating employee:', err);
      toast({
        title: "Error",
        description: "Failed to update employee",
        variant: "destructive"
      });
      return { success: false, error: err };
    }
  };

  const deleteEmployee = async (id) => {
    try {
      const { error } = await supabase
        .from('kashari_employees')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setEmployees(prev => prev.filter(emp => emp.id !== id));
      toast({
        title: "Success",
        description: "Employee deleted successfully"
      });
      return { success: true };
    } catch (err) {
      console.error('Error deleting employee:', err);
      toast({
        title: "Error",
        description: "Failed to delete employee",
        variant: "destructive"
      });
      return { success: false, error: err };
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return {
    employees,
    loading,
    error,
    fetchEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee
  };
};
