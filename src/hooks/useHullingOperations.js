import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useHullingOperations = () => {
  const [operations, setOperations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOperations = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('hulling_operations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOperations(data || []);
    } catch (err) {
      console.error('Error fetching hulling operations:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createOperation = async (operationData) => {
    try {
      const yieldPercentage = operationData.output_weight && operationData.input_weight
        ? ((operationData.output_weight / operationData.input_weight) * 100).toFixed(2)
        : null;

      const { data, error } = await supabase
        .from('hulling_operations')
        .insert([{ ...operationData, yield_percentage: yieldPercentage }])
        .select()
        .single();

      if (error) throw error;
      setOperations(prev => [data, ...prev]);
      toast.success('Hulling operation recorded successfully');
      return data;
    } catch (err) {
      console.error('Error creating hulling operation:', err);
      toast.error('Failed to record hulling operation');
      throw err;
    }
  };

  const updateOperation = async (id, updates) => {
    try {
      const yieldPercentage = updates.output_weight && updates.input_weight
        ? ((updates.output_weight / updates.input_weight) * 100).toFixed(2)
        : updates.yield_percentage;

      const { data, error } = await supabase
        .from('hulling_operations')
        .update({ ...updates, yield_percentage: yieldPercentage })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setOperations(prev => prev.map(op => op.id === id ? data : op));
      toast.success('Operation updated successfully');
      return data;
    } catch (err) {
      console.error('Error updating operation:', err);
      toast.error('Failed to update operation');
      throw err;
    }
  };

  const deleteOperation = async (id) => {
    try {
      const { error } = await supabase
        .from('hulling_operations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setOperations(prev => prev.filter(op => op.id !== id));
      toast.success('Operation deleted successfully');
    } catch (err) {
      console.error('Error deleting operation:', err);
      toast.error('Failed to delete operation');
      throw err;
    }
  };

  const getStats = () => {
    const completed = operations.filter(op => op.status === 'completed');
    const totalInput = completed.reduce((sum, op) => sum + (parseFloat(op.input_weight) || 0), 0);
    const totalOutput = completed.reduce((sum, op) => sum + (parseFloat(op.output_weight) || 0), 0);
    const avgYield = totalInput > 0 ? ((totalOutput / totalInput) * 100).toFixed(2) : 0;

    return {
      totalOperations: operations.length,
      completedOperations: completed.length,
      pendingOperations: operations.filter(op => op.status === 'pending').length,
      inProgressOperations: operations.filter(op => op.status === 'in_progress').length,
      totalInput,
      totalOutput,
      averageYield: avgYield
    };
  };

  useEffect(() => {
    fetchOperations();
  }, []);

  return {
    operations,
    isLoading,
    error,
    fetchOperations,
    createOperation,
    updateOperation,
    deleteOperation,
    getStats
  };
};
