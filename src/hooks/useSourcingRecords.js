import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useSourcingRecords = () => {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecords = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('sourcing_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (err) {
      console.error('Error fetching sourcing records:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createRecord = async (recordData) => {
    try {
      const { data, error } = await supabase
        .from('sourcing_records')
        .insert([recordData])
        .select()
        .single();

      if (error) throw error;
      setRecords(prev => [data, ...prev]);
      toast.success('Sourcing record saved successfully');
      return data;
    } catch (err) {
      console.error('Error creating sourcing record:', err);
      toast.error('Failed to save sourcing record');
      throw err;
    }
  };

  const updateRecord = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('sourcing_records')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setRecords(prev => prev.map(r => r.id === id ? data : r));
      toast.success('Record updated successfully');
      return data;
    } catch (err) {
      console.error('Error updating record:', err);
      toast.error('Failed to update record');
      throw err;
    }
  };

  const deleteRecord = async (id) => {
    try {
      const { error } = await supabase
        .from('sourcing_records')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setRecords(prev => prev.filter(r => r.id !== id));
      toast.success('Record deleted successfully');
    } catch (err) {
      console.error('Error deleting record:', err);
      toast.error('Failed to delete record');
      throw err;
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return {
    records,
    isLoading,
    error,
    fetchRecords,
    createRecord,
    updateRecord,
    deleteRecord
  };
};
