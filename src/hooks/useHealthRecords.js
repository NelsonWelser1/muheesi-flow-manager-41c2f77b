
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from "@/components/ui/use-toast";

export const useHealthRecords = (cattleId = null) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch health records
  const {
    data: healthRecords,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['health-records', cattleId],
    queryFn: async () => {
      console.log("Fetching health records, cattleId:", cattleId);
      let query = supabase
        .from('cattle_health_records')
        .select('*, cattle_inventory(tag_number, name)')
        .order('record_date', { ascending: false });

      if (cattleId) {
        query = query.eq('cattle_id', cattleId);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching health records:", error);
        throw error;
      }
      
      console.log("Health records fetched:", data?.length || 0);
      return data || [];
    },
  });

  // Add health record
  const addHealthRecord = useMutation({
    mutationFn: async (recordData) => {
      console.log("Submitting health record data:", recordData);
      
      // Validate required fields
      if (!recordData.cattle_id) throw new Error('Cattle ID is required');
      if (!recordData.record_date) throw new Error('Record date is required');
      if (!recordData.record_type) throw new Error('Record type is required');
      if (!recordData.description) throw new Error('Description is required');

      // Convert empty strings to nulls for optional fields
      const dataToInsert = {
        ...recordData,
        treatment: recordData.treatment || null,
        administered_by: recordData.administered_by || null,
        next_due_date: recordData.next_due_date || null,
        notes: recordData.notes || null
      };

      const { data, error } = await supabase
        .from('cattle_health_records')
        .insert([dataToInsert])
        .select()
        .single();

      if (error) {
        console.error("Supabase insertion error:", error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-records'] });
    },
    onError: (error) => {
      console.error('Error adding health record:', error);
    },
  });

  // Update health record
  const updateHealthRecord = useMutation({
    mutationFn: async ({ id, ...updateData }) => {
      if (!id) throw new Error('Record ID is required for updates');

      const { data, error } = await supabase
        .from('cattle_health_records')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-records'] });
    },
    onError: (error) => {
      console.error('Error updating health record:', error);
    },
  });

  // Delete health record
  const deleteHealthRecord = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('cattle_health_records')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-records'] });
    },
    onError: (error) => {
      console.error('Error deleting health record:', error);
    },
  });

  return {
    healthRecords,
    isLoading,
    error,
    addHealthRecord,
    updateHealthRecord,
    deleteHealthRecord,
    refetch
  };
};
