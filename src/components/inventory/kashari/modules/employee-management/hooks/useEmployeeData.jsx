
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase';
import { useToast } from "@/components/ui/use-toast";

export const useEmployeeData = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Fetch employees data
  const { 
    data: employees = [], 
    isLoading: isLoadingEmployees 
  } = useQuery({
    queryKey: ['personnel_employee_records', searchTerm, departmentFilter, statusFilter],
    queryFn: async () => {
      let query = supabase.from('personnel_employee_records').select('*');
      if (searchTerm) {
        query = query.or(`employee_id.ilike.%${searchTerm}%,job_title.ilike.%${searchTerm}%`);
      }
      if (departmentFilter && departmentFilter !== 'all') {
        query = query.eq('department', departmentFilter);
      }
      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
  });

  // Update employee status mutation
  const updateEmployeeStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const { data, error } = await supabase
        .from('personnel_employee_records')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personnel_employee_records'] });
      toast({
        title: "Success",
        description: "Employee status updated successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update employee status: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Calculate department statistics
  const departmentStats = {};
  employees.forEach(employee => {
    if (employee.department) {
      departmentStats[employee.department] = (departmentStats[employee.department] || 0) + 1;
    }
  });

  // Calculate status statistics
  const statusStats = {
    Active: 0,
    Inactive: 0,
    'On Leave': 0
  };
  employees.forEach(employee => {
    if (employee.status) {
      statusStats[employee.status] = (statusStats[employee.status] || 0) + 1;
    }
  });

  const handleStatusUpdate = (id, status) => {
    updateEmployeeStatusMutation.mutate({ id, status });
  };

  return {
    employees,
    isLoadingEmployees,
    searchTerm,
    setSearchTerm,
    departmentFilter,
    setDepartmentFilter,
    statusFilter,
    setStatusFilter,
    departmentStats,
    statusStats,
    handleStatusUpdate
  };
};
