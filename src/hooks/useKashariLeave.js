import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from '@/components/ui/use-toast';
import { differenceInDays } from 'date-fns';

export const useKashariLeave = () => {
  const { toast } = useToast();
  const [leaveRecords, setLeaveRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeaveRecords = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('kashari_leave_records')
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
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeaveRecords(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching leave records:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to load leave records",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const submitLeaveRequest = async (leaveData) => {
    try {
      // Calculate duration
      const duration = differenceInDays(new Date(leaveData.end_date), new Date(leaveData.start_date)) + 1;

      const { data, error } = await supabase
        .from('kashari_leave_records')
        .insert([{ 
          ...leaveData,
          duration,
          status: 'pending'
        }])
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
      
      setLeaveRecords(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Leave request submitted successfully"
      });
      return { success: true, data };
    } catch (err) {
      console.error('Error submitting leave request:', err);
      toast({
        title: "Error",
        description: "Failed to submit leave request",
        variant: "destructive"
      });
      return { success: false, error: err };
    }
  };

  const approveLeave = async (id, approvedBy) => {
    try {
      const { data, error } = await supabase
        .from('kashari_leave_records')
        .update({ 
          status: 'approved',
          approved_by: approvedBy
        })
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
      
      setLeaveRecords(prev => prev.map(rec => rec.id === id ? data : rec));
      toast({
        title: "Success",
        description: "Leave request approved"
      });
      return { success: true, data };
    } catch (err) {
      console.error('Error approving leave:', err);
      toast({
        title: "Error",
        description: "Failed to approve leave request",
        variant: "destructive"
      });
      return { success: false, error: err };
    }
  };

  const rejectLeave = async (id) => {
    try {
      const { data, error } = await supabase
        .from('kashari_leave_records')
        .update({ status: 'rejected' })
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
      
      setLeaveRecords(prev => prev.map(rec => rec.id === id ? data : rec));
      toast({
        title: "Success",
        description: "Leave request rejected"
      });
      return { success: true, data };
    } catch (err) {
      console.error('Error rejecting leave:', err);
      toast({
        title: "Error",
        description: "Failed to reject leave request",
        variant: "destructive"
      });
      return { success: false, error: err };
    }
  };

  const getLeaveStats = () => {
    return {
      total: leaveRecords.length,
      pending: leaveRecords.filter(rec => rec.status === 'pending').length,
      approved: leaveRecords.filter(rec => rec.status === 'approved').length,
      rejected: leaveRecords.filter(rec => rec.status === 'rejected').length
    };
  };

  useEffect(() => {
    fetchLeaveRecords();
  }, []);

  return {
    leaveRecords,
    loading,
    error,
    fetchLeaveRecords,
    submitLeaveRequest,
    approveLeave,
    rejectLeave,
    getLeaveStats
  };
};
