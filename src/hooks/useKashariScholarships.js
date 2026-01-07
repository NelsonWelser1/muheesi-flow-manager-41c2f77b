import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from '@/components/ui/use-toast';
import { format, addYears } from 'date-fns';

export const useKashariScholarships = () => {
  const { toast } = useToast();
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchScholarships = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('kashari_scholarships')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setScholarships(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching scholarships:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to load scholarships",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addScholarship = async (scholarshipData) => {
    try {
      // Generate scholarship_id
      const { count } = await supabase
        .from('kashari_scholarships')
        .select('*', { count: 'exact', head: true });
      
      const newScholarshipId = `SCH-${String((count || 0) + 1).padStart(3, '0')}`;
      const startDate = format(new Date(), 'yyyy-MM-dd');
      const endDate = format(addYears(new Date(), 1), 'yyyy-MM-dd');

      const { data, error } = await supabase
        .from('kashari_scholarships')
        .insert([{ 
          ...scholarshipData,
          scholarship_id: newScholarshipId,
          start_date: startDate,
          end_date: endDate,
          status: 'pending',
          performance_rating: 'N/A'
        }])
        .select()
        .single();

      if (error) throw error;
      
      setScholarships(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Scholarship application submitted successfully"
      });
      return { success: true, data };
    } catch (err) {
      console.error('Error adding scholarship:', err);
      toast({
        title: "Error",
        description: "Failed to submit scholarship application",
        variant: "destructive"
      });
      return { success: false, error: err };
    }
  };

  const updateScholarship = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('kashari_scholarships')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setScholarships(prev => prev.map(s => s.id === id ? data : s));
      toast({
        title: "Success",
        description: "Scholarship updated successfully"
      });
      return { success: true, data };
    } catch (err) {
      console.error('Error updating scholarship:', err);
      toast({
        title: "Error",
        description: "Failed to update scholarship",
        variant: "destructive"
      });
      return { success: false, error: err };
    }
  };

  const deleteScholarship = async (id) => {
    try {
      const { error } = await supabase
        .from('kashari_scholarships')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setScholarships(prev => prev.filter(s => s.id !== id));
      toast({
        title: "Success",
        description: "Scholarship deleted successfully"
      });
      return { success: true };
    } catch (err) {
      console.error('Error deleting scholarship:', err);
      toast({
        title: "Error",
        description: "Failed to delete scholarship",
        variant: "destructive"
      });
      return { success: false, error: err };
    }
  };

  const getScholarshipStats = () => {
    const totalAmount = scholarships.reduce((sum, s) => sum + (s.amount || 0), 0);
    return {
      total: scholarships.length,
      active: scholarships.filter(s => s.status === 'active').length,
      pending: scholarships.filter(s => s.status === 'pending').length,
      onHold: scholarships.filter(s => s.status === 'on-hold').length,
      completed: scholarships.filter(s => s.status === 'completed').length,
      totalAmount
    };
  };

  useEffect(() => {
    fetchScholarships();
  }, []);

  return {
    scholarships,
    loading,
    error,
    fetchScholarships,
    addScholarship,
    updateScholarship,
    deleteScholarship,
    getScholarshipStats
  };
};
