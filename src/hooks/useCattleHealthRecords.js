
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from "@/components/ui/use-toast";

export const useCattleHealthRecords = (cattleId = null) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch health records with optional filtering by cattle ID
  const {
    data: records,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['cattle-health-records', cattleId],
    queryFn: async () => {
      console.log("Fetching health records, cattleId:", cattleId);
      let query = supabase
        .from('cattle_health_records')
        .select(`
          *,
          cattle_inventory:cattle_id (
            id,
            tag_number,
            name
          )
        `)
        .order('record_date', { ascending: false });

      if (cattleId) {
        query = query.eq('cattle_id', cattleId);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching health records:", error);
        throw error;
      }
      
      return data || [];
    },
  });

  // Add a new health record
  const addHealthRecord = useMutation({
    mutationFn: async (recordData) => {
      // Validate the required fields
      if (!recordData.cattle_id) throw new Error('Cattle ID is required');
      if (!recordData.record_date) throw new Error('Record date is required');
      if (!recordData.record_type) throw new Error('Record type is required');
      if (!recordData.description) throw new Error('Description is required');

      // Format the data for insertion
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
        .select();

      if (error) {
        console.error("Error adding health record:", error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cattle-health-records'] });
      toast({
        title: "Success",
        description: "Health record added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add health record",
        variant: "destructive",
      });
    },
  });

  // Delete a health record
  const deleteHealthRecord = useMutation({
    mutationFn: async (recordId) => {
      if (!recordId) throw new Error('Record ID is required');

      const { error } = await supabase
        .from('cattle_health_records')
        .delete()
        .eq('id', recordId);

      if (error) {
        console.error("Error deleting health record:", error);
        throw error;
      }
      
      return recordId;
    },
    onSuccess: (deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['cattle-health-records'] });
      toast({
        title: "Success",
        description: "Health record deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete health record",
        variant: "destructive",
      });
    },
  });

  // Update an existing health record
  const updateHealthRecord = useMutation({
    mutationFn: async ({ id, ...updateData }) => {
      if (!id) throw new Error('Record ID is required');

      const { data, error } = await supabase
        .from('cattle_health_records')
        .update(updateData)
        .eq('id', id)
        .select();

      if (error) {
        console.error("Error updating health record:", error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cattle-health-records'] });
      toast({
        title: "Success",
        description: "Health record updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update health record",
        variant: "destructive",
      });
    },
  });

  return {
    records,
    isLoading,
    error,
    addHealthRecord,
    deleteHealthRecord,
    updateHealthRecord,
    refetch
  };
};
