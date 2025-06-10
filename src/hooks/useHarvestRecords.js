
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/supabase';

export const useHarvestRecords = () => {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const { toast } = useToast();

  const fetchHarvestRecords = async () => {
    try {
      setIsFetching(true);
      console.log("Fetching harvest records from Supabase...");
      
      const { data, error } = await supabase
        .from('harvest_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching harvest records:', error);
        toast({
          title: "Error",
          description: `Failed to fetch records: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      const formattedRecords = (data || []).map(record => ({
        ...record,
        date: new Date(record.date)
      }));

      setRecords(formattedRecords);
      console.log("Successfully fetched harvest records:", formattedRecords);
    } catch (error) {
      console.error('Unexpected error fetching records:', error);
      toast({
        title: "Error",
        description: `Failed to fetch records: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsFetching(false);
    }
  };

  const saveHarvestRecord = async (newRecord) => {
    try {
      setIsLoading(true);
      console.log("Saving harvest record to Supabase:", newRecord);

      const { data, error } = await supabase
        .from('harvest_records')
        .insert([newRecord])
        .select();

      if (error) {
        console.error('Error inserting harvest record:', error);
        toast({
          title: "Error",
          description: `Failed to save record: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      const insertedRecord = {
        ...data[0],
        date: new Date(data[0].date)
      };

      setRecords(prevRecords => [insertedRecord, ...prevRecords]);
      
      toast({
        title: "Success",
        description: "Harvest record saved successfully.",
      });

      console.log("Successfully saved harvest record:", insertedRecord);
    } catch (error) {
      console.error('Unexpected error saving record:', error);
      toast({
        title: "Error",
        description: `Failed to save record: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    records,
    isLoading,
    isFetching,
    fetchHarvestRecords,
    saveHarvestRecord
  };
};
