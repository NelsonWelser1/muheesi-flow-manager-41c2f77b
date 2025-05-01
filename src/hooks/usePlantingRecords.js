
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { format } from 'date-fns';
import { useToast } from "@/components/ui/use-toast";
import { showSuccessToast, showErrorToast } from "@/components/ui/notifications";

export const usePlantingRecords = () => {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const { toast } = useToast();

  const fetchPlantingRecords = async () => {
    try {
      setIsFetching(true);
      const { data, error } = await supabase
        .from('planting_records')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching planting records:', error);
        showErrorToast(toast, `Failed to fetch records: ${error.message}`);
        return [];
      }
      
      // Format dates for display
      const formattedRecords = data.map(record => ({
        ...record,
        date: new Date(record.date)
      }));
      
      setRecords(formattedRecords);
      return formattedRecords;
    } catch (error) {
      console.error('Unexpected error fetching records:', error);
      showErrorToast(toast, `Failed to fetch records: ${error.message}`);
      return [];
    } finally {
      setIsFetching(false);
    }
  };

  const savePlantingRecord = async (recordData) => {
    try {
      setIsLoading(true);
      
      // Validate required fields
      if (!recordData.date || !recordData.cropType || !recordData.variety || !recordData.plotId || !recordData.area) {
        showErrorToast(toast, "Please fill in all required fields.");
        return { success: false };
      }

      // Validate area is a number
      const areaNumber = parseFloat(recordData.area);
      if (isNaN(areaNumber) || areaNumber <= 0) {
        showErrorToast(toast, "Area must be a positive number.");
        return { success: false };
      }
      
      // Prepare data for insertion
      const newRecord = {
        date: format(recordData.date, 'yyyy-MM-dd'),
        crop_type: recordData.cropType,
        variety: recordData.variety,
        plot_id: recordData.plotId,
        area: areaNumber,
        seeds_quantity: recordData.seedsQuantity || null,
        fertilizer: recordData.fertilizer || null,
        workers: recordData.workers || null,
        notes: recordData.notes || null
      };
      
      // Insert into Supabase
      const { data, error } = await supabase
        .from('planting_records')
        .insert([newRecord])
        .select();
      
      if (error) {
        console.error('Error inserting planting record:', error);
        showErrorToast(toast, `Failed to save record: ${error.message}`);
        return { success: false, error };
      }
      
      // Format the returned record
      const insertedRecord = {
        ...data[0],
        date: new Date(data[0].date)
      };
      
      // Update local records state
      setRecords(prevRecords => [insertedRecord, ...prevRecords]);
      
      showSuccessToast(toast, "Planting record saved successfully.");
      return { success: true, record: insertedRecord };
    } catch (error) {
      console.error('Unexpected error saving record:', error);
      showErrorToast(toast, `Failed to save record: ${error.message}`);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    records,
    isLoading,
    isFetching,
    fetchPlantingRecords,
    savePlantingRecord,
    setRecords
  };
};
