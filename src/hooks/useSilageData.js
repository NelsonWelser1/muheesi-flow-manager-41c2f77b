
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from '@/components/ui/use-toast';
import { useQueryClient } from '@tanstack/react-query';

export const useSilageData = (farmId) => {
  const [silageData, setSilageData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const fetchSilageData = async () => {
    setIsLoading(true);
    try {
      // Query the silage data table
      const { data, error } = await supabase
        .from('silage_inventory')
        .select('*')
        .eq('farm_id', farmId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Format and process the data
      const formattedData = (data || []).map(item => ({
        id: item.id,
        type: item.type || 'unknown',
        amount: item.amount || 0,
        unit: item.unit || 'tons',
        productionDate: item.production_date,
        expiryDate: item.expiry_date,
        storageLocation: item.storage_location || 'Main Silo',
        quality: item.quality || 'average',
        notes: item.notes,
        farm_id: item.farm_id,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      setSilageData(formattedData);
    } catch (err) {
      console.error('Error fetching silage data:', err);
      setError(err);
      toast({
        title: "Error fetching silage data",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addSilageRecord = async (newRecord) => {
    try {
      // Prepare data for insertion
      const recordToInsert = {
        type: newRecord.type,
        amount: parseFloat(newRecord.amount),
        unit: newRecord.unit,
        production_date: newRecord.productionDate,
        expiry_date: newRecord.expiryDate,
        storage_location: newRecord.storageLocation,
        quality: newRecord.quality,
        notes: newRecord.notes,
        farm_id: farmId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('silage_inventory')
        .insert([recordToInsert])
        .select();

      if (error) throw error;

      // Invalidate Kyalima's cache to ensure it sees the new data
      if (farmId === 'bukomero') {
        queryClient.invalidateQueries('silage-kyalima');
      }
      
      toast({
        title: "Silage Record Added",
        description: "New silage record has been successfully added.",
        variant: "success"
      });

      return data;
    } catch (err) {
      console.error('Error adding silage record:', err);
      toast({
        title: "Error Adding Record",
        description: err.message,
        variant: "destructive"
      });
      throw err;
    }
  };

  const updateSilageRecord = async (id, updatedRecord) => {
    try {
      // Prepare data for update
      const recordToUpdate = {
        type: updatedRecord.type,
        amount: parseFloat(updatedRecord.amount),
        unit: updatedRecord.unit,
        production_date: updatedRecord.productionDate,
        expiry_date: updatedRecord.expiryDate,
        storage_location: updatedRecord.storageLocation,
        quality: updatedRecord.quality,
        notes: updatedRecord.notes,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('silage_inventory')
        .update(recordToUpdate)
        .eq('id', id)
        .eq('farm_id', farmId)
        .select();

      if (error) throw error;

      // Invalidate Kyalima's cache to ensure it sees the updated data
      if (farmId === 'bukomero') {
        queryClient.invalidateQueries('silage-kyalima');
      }
      
      toast({
        title: "Silage Record Updated",
        description: "The silage record has been successfully updated.",
        variant: "success"
      });

      return data;
    } catch (err) {
      console.error('Error updating silage record:', err);
      toast({
        title: "Error Updating Record",
        description: err.message,
        variant: "destructive"
      });
      throw err;
    }
  };

  const deleteSilageRecord = async (id) => {
    try {
      const { error } = await supabase
        .from('silage_inventory')
        .delete()
        .eq('id', id)
        .eq('farm_id', farmId);

      if (error) throw error;
      
      // Invalidate Kyalima's cache to ensure it sees the deletion
      if (farmId === 'bukomero') {
        queryClient.invalidateQueries('silage-kyalima');
      }
      
      toast({
        title: "Silage Record Deleted",
        description: "The silage record has been successfully removed.",
        variant: "success"
      });
      
      return true;
    } catch (err) {
      console.error('Error deleting silage record:', err);
      toast({
        title: "Error Deleting Record",
        description: err.message,
        variant: "destructive"
      });
      throw err;
    }
  };

  useEffect(() => {
    if (farmId) {
      fetchSilageData();
    }
    
    // Set up real-time subscription for silage data changes
    const subscription = supabase
      .channel('silage-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'silage_inventory',
        filter: `farm_id=eq.${farmId}`
      }, () => {
        fetchSilageData();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [farmId]);

  return {
    silageData,
    isLoading,
    error,
    fetchSilageData,
    addSilageRecord,
    updateSilageRecord,
    deleteSilageRecord
  };
};
