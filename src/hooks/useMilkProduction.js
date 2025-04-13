
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from '@/components/ui/use-toast';
import { showSuccessToast, showErrorToast, showLoadingToast, dismissToast } from '@/components/ui/notifications';

export const useMilkProduction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [milkRecords, setMilkRecords] = useState([]);
  const { toast } = useToast();

  // Fetch milk production records
  const fetchMilkProduction = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('milk_production')
        .select('*')
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching milk production records:', error.message);
        showErrorToast(toast, `Failed to fetch milk production records: ${error.message}`);
        return [];
      }
      
      console.log('Successfully fetched milk production records:', data);
      setMilkRecords(data || []);
      return data || [];
    } catch (error) {
      console.error('Exception fetching milk production:', error.message);
      showErrorToast(toast, `Error: ${error.message}`);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new milk production record
  const addMilkProduction = async (milkData) => {
    if (!milkData) {
      showErrorToast(toast, "No milk production data provided");
      return null;
    }

    setIsSubmitting(true);
    const loadingToastId = showLoadingToast(toast, "Submitting milk production data...");
    console.log("Submitting milk production data:", milkData);

    try {
      // Validate required fields
      if (!milkData.date) {
        throw new Error("Date is required");
      }
      if (!milkData.session) {
        throw new Error("Milking session is required");
      }
      if (!milkData.volume || isNaN(Number(milkData.volume)) || Number(milkData.volume) <= 0) {
        throw new Error("Valid milk volume is required");
      }
      if (!milkData.milkingCows || isNaN(Number(milkData.milkingCows)) || Number(milkData.milkingCows) <= 0) {
        throw new Error("Valid number of milking cows is required");
      }

      // Format the data for Supabase
      const formattedRecord = {
        date: milkData.date,
        session: milkData.session,
        volume: Number(milkData.volume),
        milking_cows: Number(milkData.milkingCows),
        fat_content: milkData.fatContent ? Number(milkData.fatContent) : null,
        protein_content: milkData.proteinContent ? Number(milkData.proteinContent) : null,
        location: milkData.location || 'Main Farm',
        notes: milkData.notes || null,
        created_at: new Date().toISOString()
      };

      console.log("Formatted milk production data for Supabase:", formattedRecord);

      // Insert into the milk_production table
      const { data, error } = await supabase
        .from('milk_production')
        .insert([formattedRecord])
        .select();

      if (error) {
        console.error('Error adding milk production record:', error.message);
        throw new Error(`Failed to add milk production record: ${error.message}`);
      }

      console.log("Milk production record added successfully:", data);
      
      // Dismiss loading toast
      dismissToast(loadingToastId);
      
      // Show success message
      showSuccessToast(toast, "Milk production record successfully added");
      
      // Refresh the records
      fetchMilkProduction();
      
      return data[0];
    } catch (error) {
      console.error('Exception adding milk production record:', error.message);
      
      // Dismiss loading toast
      dismissToast(loadingToastId);
      
      // Show error message
      showErrorToast(toast, error.message || "Failed to add milk production record");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Initialize - fetch records on hook mount
  useEffect(() => {
    fetchMilkProduction();
  }, []);

  return {
    milkRecords,
    isLoading,
    isSubmitting,
    addMilkProduction,
    fetchMilkProduction
  };
};
