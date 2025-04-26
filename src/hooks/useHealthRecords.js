
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from "@/components/ui/use-toast";

export const useHealthRecords = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cattleList, setCattleList] = useState([]);
  const { toast } = useToast();

  const fetchCattleList = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cattle_inventory')
        .select('id, tag_number, name')
        .order('tag_number', { ascending: true });
      
      if (error) throw error;
      
      setCattleList(data || []);
    } catch (err) {
      setError(err.message);
      toast({
        title: "Error fetching cattle list",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const addHealthRecord = async (recordData) => {
    try {
      setLoading(true);
      setError(null);

      // Format the dates correctly for Supabase
      const formattedData = {
        ...recordData,
        record_date: recordData.record_date?.toISOString().split('T')[0],
        next_due_date: recordData.next_due_date?.toISOString().split('T')[0] || null
      };

      const { data, error } = await supabase
        .from('cattle_health_records')
        .insert([formattedData])
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Record added successfully",
        description: "The health record has been saved.",
      });
      
      return true;
    } catch (err) {
      setError(err.message);
      toast({
        title: "Error adding record",
        description: err.message,
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    cattleList,
    fetchCattleList,
    addHealthRecord
  };
};
