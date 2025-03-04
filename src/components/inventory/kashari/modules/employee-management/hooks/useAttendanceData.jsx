
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase';
import { useToast } from "@/components/ui/use-toast";

export const useAttendanceData = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [clockInfo, setClockInfo] = useState({
    employeeId: '',
    isClockingIn: true
  });

  // Fetch employees data
  const { data: employees = [] } = useQuery({
    queryKey: ['personnel_employee_records'],
    queryFn: async () => {
      const { data, error } = await supabase.from('personnel_employee_records').select('*');
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch attendance records
  const { data: attendanceRecords = [], isLoading: isLoadingAttendance } = useQuery({
    queryKey: ['personnel_attendance'],
    queryFn: async () => {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();
      const { data, error } = await supabase
        .from('personnel_attendance')
        .select('*')
        .gte('timestamp', startOfDay)
        .lte('timestamp', endOfDay);
      if (error) throw error;
      return data || [];
    }
  });

  // Clock in/out mutation
  const clockInOutMutation = useMutation({
    mutationFn: async ({ employeeId, type }) => {
      const { data, error } = await supabase
        .from('personnel_attendance')
        .insert([{
          employee_id: employeeId,
          type,
          timestamp: new Date().toISOString()
        }]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personnel_attendance'] });
      toast({
        title: "Success",
        description: `${clockInfo.isClockingIn ? 'Clock-in' : 'Clock-out'} recorded successfully`
      });
      setClockInfo({
        employeeId: '',
        isClockingIn: true
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to record attendance: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Handle clock in/out
  const handleClockInOut = () => {
    if (!clockInfo.employeeId) {
      toast({
        title: "Error",
        description: "Please select an employee",
        variant: "destructive"
      });
      return;
    }
    clockInOutMutation.mutate({
      employeeId: clockInfo.employeeId,
      type: clockInfo.isClockingIn ? 'clock_in' : 'clock_out'
    });
  };

  return {
    employees,
    attendanceRecords,
    isLoadingAttendance,
    clockInfo,
    setClockInfo,
    handleClockInOut
  };
};
