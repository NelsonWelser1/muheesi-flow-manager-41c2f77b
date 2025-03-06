
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/supabase';

export const useMilkPreparationData = () => {
  const { toast } = useToast();
  const [preparations, setPreparations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch milk preparation records from Supabase
  const fetchPreparations = async () => {
    console.log('Fetching milk preparation records...');
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('yogurt_milk_preparation')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching milk preparation records:', error);
        throw error;
      }
      
      console.log('Successfully fetched milk preparation records:', data);
      setPreparations(data || []);
    } catch (error) {
      console.error('Error in fetchPreparations:', error);
      toast({
        title: "Error",
        description: "Failed to load milk preparation data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    fetchPreparations();
  }, []);

  // Handle form submission
  const handleSubmit = async (data) => {
    console.log('Submitting milk preparation data:', data);
    setIsSubmitting(true);
    
    try {
      // Validate numeric fields
      const pre_standardization_fat = Number(data.pre_standardization_fat);
      const target_fat = Number(data.target_fat);
      const milk_volume = Number(data.milk_volume);
      
      if (isNaN(pre_standardization_fat) || isNaN(target_fat) || isNaN(milk_volume)) {
        throw new Error('Invalid numeric values in form data');
      }
      
      // Validate fat percentages (this could be expanded)
      if (pre_standardization_fat > 100 || target_fat > 100) {
        throw new Error('Fat percentage cannot exceed 100%');
      }
      
      // Prepare data for submission
      const submissionData = {
        batch_id: data.batch_id,
        milk_volume: milk_volume,
        pre_standardization_fat: pre_standardization_fat,
        target_fat: target_fat,
        homogenization_temperature: data.homogenization_temperature ? Number(data.homogenization_temperature) : null,
        homogenization_pressure: data.homogenization_pressure ? Number(data.homogenization_pressure) : null,
        homogenization_duration: data.homogenization_duration ? Number(data.homogenization_duration) : null,
        notes: data.notes || null
      };
      
      // Insert new record
      const { data: insertedData, error } = await supabase
        .from('yogurt_milk_preparation')
        .insert([submissionData])
        .select();
      
      if (error) {
        console.error('Error inserting milk preparation record:', error);
        throw error;
      }
      
      console.log('Successfully inserted milk preparation record:', insertedData);
      
      toast({
        title: "Success",
        description: "Milk preparation record added successfully",
      });
      
      // Refresh data
      fetchPreparations();
      
      return insertedData[0];
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add milk preparation record",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Debug function to log form data
  const debugFormData = (formData) => {
    console.log('DEBUG - Current form data:', formData);
    return formData;
  };

  return {
    preparations,
    isLoading,
    isSubmitting,
    handleSubmit,
    fetchPreparations,
    debugFormData
  };
};
