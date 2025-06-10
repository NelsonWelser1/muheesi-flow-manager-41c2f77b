
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from '@/hooks/use-toast';
import { fromSupabase } from '@/integrations/supabase/utils/supabaseUtils';

/**
 * Hook for working with milk production records for Kashari Farm
 */
export const useMilkProduction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [milkRecords, setMilkRecords] = useState([]);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Fetch milk production records
  const fetchMilkProduction = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching milk production records from Supabase...');
      const data = await fromSupabase(
        supabase
          .from('kashari_milk_production')
          .select('*')
          .order('date', { ascending: false })
          .order('created_at', { ascending: false })
      );
        
      console.log('Successfully fetched milk production records:', data);
      setMilkRecords(data || []);
      return data;
    } catch (error) {
      console.error('Exception fetching milk production:', error.message);
      toast({
        title: "Error",
        description: `Error fetching milk production records: ${error.message}`,
        variant: "destructive"
      });
      setError(error.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Add a new milk production record
  const addMilkProduction = async (milkData) => {
    if (!milkData) {
      toast({
        title: "Error", 
        description: "No milk production data provided",
        variant: "destructive"
      });
      return null;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      // Show loading toast
      toast({
        title: "Submitting...", 
        description: "Saving milk production data"
      });
      
      console.log("Submitting milk production data:", milkData);

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
        location: milkData.location || null,
        notes: milkData.notes || null
      };

      console.log("Formatted milk production data for Supabase:", formattedRecord);

      // Insert into the kashari_milk_production table
      const data = await fromSupabase(
        supabase
          .from('kashari_milk_production')
          .insert([formattedRecord])
          .select()
      );

      console.log("Milk production record added successfully:", data);
      
      // Show success message
      toast({
        title: "Success",
        description: "Milk production record successfully added to Kashari Farm"
      });
      
      // Refresh the records
      fetchMilkProduction();
      
      return data[0];
    } catch (error) {
      console.error('Exception adding milk production record:', error.message);
      
      // Show error message
      toast({
        title: "Error",
        description: error.message || "Failed to add milk production record",
        variant: "destructive"
      });
      
      setError(error.message);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Initialize - fetch records on hook mount
  useEffect(() => {
    fetchMilkProduction();
  }, [fetchMilkProduction]);

  return {
    milkRecords,
    isLoading,
    isSubmitting,
    error,
    addMilkProduction,
    fetchMilkProduction
  };
};
