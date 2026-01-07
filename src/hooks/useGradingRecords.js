import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useGradingRecords = () => {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecords = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('grading_records')
        .select('*, hulling_operations(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (err) {
      console.error('Error fetching grading records:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createRecord = async (recordData) => {
    try {
      const { data, error } = await supabase
        .from('grading_records')
        .insert([recordData])
        .select()
        .single();

      if (error) throw error;
      setRecords(prev => [data, ...prev]);
      toast.success('Grading record saved successfully');
      return data;
    } catch (err) {
      console.error('Error creating grading record:', err);
      toast.error('Failed to save grading record');
      throw err;
    }
  };

  const updateRecord = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('grading_records')
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
        .from('grading_records')
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

  const getGradeDistribution = () => {
    const distribution = {};
    records.forEach(record => {
      const grade = record.final_grade || 'Ungraded';
      distribution[grade] = (distribution[grade] || 0) + 1;
    });
    return Object.entries(distribution).map(([grade, count]) => ({ grade, count }));
  };

  const getAverageScores = () => {
    if (records.length === 0) return { avgCupping: 0, avgDefects: 0 };
    
    const totals = records.reduce((acc, record) => ({
      cupping: acc.cupping + (parseFloat(record.cupping_score) || 0),
      defects: acc.defects + (parseFloat(record.defect_percentage) || 0),
      count: acc.count + 1
    }), { cupping: 0, defects: 0, count: 0 });

    return {
      avgCupping: (totals.cupping / totals.count).toFixed(2),
      avgDefects: (totals.defects / totals.count).toFixed(2)
    };
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
    deleteRecord,
    getGradeDistribution,
    getAverageScores
  };
};
