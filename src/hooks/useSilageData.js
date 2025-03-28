
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from '@/components/ui/use-toast';

export const useSilageData = (farmId) => {
  const [silageData, setSilageData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

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

      return data;
    } catch (err) {
      console.error('Error adding silage record:', err);
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

      return data;
    } catch (err) {
      console.error('Error updating silage record:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (farmId) {
      fetchSilageData();
    }
  }, [farmId]);

  return {
    silageData,
    isLoading,
    error,
    fetchSilageData,
    addSilageRecord,
    updateSilageRecord
  };
};
