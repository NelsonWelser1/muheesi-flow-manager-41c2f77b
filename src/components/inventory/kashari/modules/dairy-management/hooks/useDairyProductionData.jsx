
import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase";
import { toast } from "sonner";

export const useDairyProductionData = () => {
  const [productions, setProductions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form
  const form = useForm({
    defaultValues: {
      quantity: '',
      fat_content: '',
      notes: ''
    },
  });

  // Fetch dairy production records from Supabase
  const fetchProductions = async () => {
    console.log('Fetching dairy production records...');
    setIsLoading(true);
    try {
      // Check if table exists first
      const { error: checkError } = await supabase
        .from('dairy_production')
        .select('count(*)')
        .limit(1);
      
      if (checkError && checkError.code === '42P01') {
        // Table doesn't exist, create it
        console.log('Table does not exist, creating dairy_production table...');
        const { error: createError } = await supabase.rpc('create_dairy_production_table');
        if (createError) throw createError;
        console.log('Dairy production table created successfully');
      }

      // Fetch the records
      const { data, error } = await supabase
        .from('dairy_production')
        .select('*')
        .order('production_date', { ascending: false });
      
      if (error) throw error;
      console.log('Dairy production records fetched:', data);
      setProductions(data || []);
    } catch (error) {
      console.error('Error fetching dairy production records:', error);
      toast.error('Failed to load dairy production data');
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    fetchProductions();
  }, []);

  // Handle form submission
  const handleSubmit = async (data) => {
    console.log('Submitting dairy production data:', data);
    setIsSubmitting(true);
    try {
      // Prepare data for submission
      const submissionData = {
        quantity: parseFloat(data.quantity),
        fat_content: data.fat_content ? parseFloat(data.fat_content) : null,
        notes: data.notes || null
      };

      // Insert the record
      const { error } = await supabase
        .from('dairy_production')
        .insert([submissionData]);
      
      if (error) throw error;
      
      toast.success('Dairy production record added successfully');
      
      // Reset form
      form.reset();
      
      // Refresh data
      fetchProductions();
    } catch (error) {
      console.error('Error adding dairy production record:', error);
      toast.error('Failed to add production record');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Debug function to log current form state
  const debugForm = () => {
    const formValues = form.getValues();
    console.log('Current form state:', formValues);
    return formValues;
  };

  return {
    productions,
    isLoading,
    isSubmitting,
    form,
    handleSubmit,
    fetchProductions,
    debugForm
  };
};
