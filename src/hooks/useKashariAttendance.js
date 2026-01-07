import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

export const useKashariAttendance = () => {
  const { toast } = useToast();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAttendance = async (date = null) => {
    setLoading(true);
    try {
      let query = supabase
        .from('kashari_attendance')
        .select(`
          *,
          kashari_employees (
            id,
            employee_id,
            name,
            position,
            department
          )
        `)
        .order('date', { ascending: false });

      if (date) {
        query = query.eq('date', format(date, 'yyyy-MM-dd'));
      }

      const { data, error } = await query;

      if (error) throw error;
      setAttendance(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching attendance:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to load attendance records",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const recordAttendance = async (attendanceData) => {
    try {
      const { data, error } = await supabase
        .from('kashari_attendance')
        .insert([attendanceData])
        .select(`
          *,
          kashari_employees (
            id,
            employee_id,
            name,
            position,
            department
          )
        `)
        .single();

      if (error) throw error;
      
      setAttendance(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Attendance recorded successfully"
      });
      return { success: true, data };
    } catch (err) {
      console.error('Error recording attendance:', err);
      toast({
        title: "Error",
        description: "Failed to record attendance",
        variant: "destructive"
      });
      return { success: false, error: err };
    }
  };

  const updateAttendance = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('kashari_attendance')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          kashari_employees (
            id,
            employee_id,
            name,
            position,
            department
          )
        `)
        .single();

      if (error) throw error;
      
      setAttendance(prev => prev.map(att => att.id === id ? data : att));
      toast({
        title: "Success",
        description: "Attendance updated successfully"
      });
      return { success: true, data };
    } catch (err) {
      console.error('Error updating attendance:', err);
      toast({
        title: "Error",
        description: "Failed to update attendance",
        variant: "destructive"
      });
      return { success: false, error: err };
    }
  };

  const getAttendanceStats = (dateFilter = null) => {
    const filtered = dateFilter 
      ? attendance.filter(att => att.date === format(dateFilter, 'yyyy-MM-dd'))
      : attendance;
    
    return {
      total: filtered.length,
      present: filtered.filter(att => att.status === 'present').length,
      absent: filtered.filter(att => att.status === 'absent').length,
      late: filtered.filter(att => att.status === 'late').length,
      onLeave: filtered.filter(att => att.status === 'on_leave').length
    };
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  return {
    attendance,
    loading,
    error,
    fetchAttendance,
    recordAttendance,
    updateAttendance,
    getAttendanceStats
  };
};
