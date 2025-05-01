
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { format } from 'date-fns';
import { useToast } from "@/components/ui/use-toast";
import { showSuccessToast, showErrorToast, showInfoToast } from "@/components/ui/notifications";

export const useHarvestRecords = () => {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const { toast } = useToast();

  const fetchHarvestRecords = async () => {
    try {
      setIsFetching(true);
      const { data, error } = await supabase
        .from('harvest_records')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching harvest records:', error);
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

  const saveHarvestRecord = async (recordData) => {
    try {
      setIsLoading(true);
      
      // Validate required fields
      if (!recordData.date || !recordData.cropType || !recordData.variety || !recordData.plotId || !recordData.quantity) {
        showErrorToast(toast, "Please fill in all required fields.");
        return { success: false };
      }

      // Validate quantity is a number
      const quantityNumber = parseFloat(recordData.quantity);
      if (isNaN(quantityNumber) || quantityNumber <= 0) {
        showErrorToast(toast, "Quantity must be a positive number.");
        return { success: false };
      }
      
      // Prepare data for insertion
      const newRecord = {
        date: format(recordData.date, 'yyyy-MM-dd'),
        crop_type: recordData.cropType,
        variety: recordData.variety,
        plot_id: recordData.plotId,
        quantity: quantityNumber,
        unit: recordData.unit,
        quality: recordData.quality,
        workers: recordData.workers || null,
        notes: recordData.notes || null
      };
      
      // Insert into Supabase
      const { data, error } = await supabase
        .from('harvest_records')
        .insert([newRecord])
        .select();
      
      if (error) {
        console.error('Error inserting harvest record:', error);
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
      
      showSuccessToast(toast, "Harvest record saved successfully!");
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
    fetchHarvestRecords,
    saveHarvestRecord,
    setRecords
  };
};
