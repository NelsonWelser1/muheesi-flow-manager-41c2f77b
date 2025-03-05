
import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase";
import { toast } from "sonner";

// Define schema for form validation
const formSchema = z.object({
  plantation_area: z.string().min(1, { message: "Plantation area is required" }),
  growth_stage: z.string().min(1, { message: "Growth stage is required" }),
  last_fertilization_date: z.date().nullable(),
  fertilizer_used: z.string().optional(),
  next_fertilization_date: z.date().nullable(),
  last_pesticide_date: z.date().nullable(),
  pesticide_used: z.string().optional(),
  application_reason: z.string().optional(),
  disease_status: z.string().min(1, { message: "Disease status is required" }),
  bunches_harvested: z.string().optional(),
  notes: z.string().optional(),
});

export const useBananaPlantationData = () => {
  const [crops, setCrops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  
  // Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plantation_area: '',
      growth_stage: '',
      last_fertilization_date: null,
      fertilizer_used: '',
      next_fertilization_date: null,
      last_pesticide_date: null,
      pesticide_used: '',
      application_reason: '',
      disease_status: '',
      bunches_harvested: '0',
      notes: '',
    },
  });

  // Fetch banana plantation records from Supabase
  const fetchCrops = async () => {
    console.log('Fetching banana plantation records...');
    setIsLoading(true);
    try {
      // Check if table exists first
      const { error: checkError } = await supabase
        .from('banana_plantation')
        .select('count(*)')
        .limit(1);
      
      if (checkError && checkError.code === '42P01') {
        // Table doesn't exist, create it
        console.log('Table does not exist, creating banana_plantation table...');
        const { error: createError } = await supabase.rpc('create_banana_plantation_table');
        if (createError) throw createError;
        console.log('Banana plantation table created successfully');
      }

      // Fetch the records
      const { data, error } = await supabase
        .from('banana_plantation')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      console.log('Banana plantation records fetched:', data);
      setCrops(data || []);
    } catch (error) {
      console.error('Error fetching banana plantation records:', error);
      toast.error('Failed to load banana plantation data');
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    fetchCrops();
  }, []);

  // Handle form submission
  const handleSubmit = async (data) => {
    console.log('Submitting banana plantation data:', data);
    setIsSubmitting(true);
    try {
      // Prepare data for submission
      const submissionData = {
        plantation_area: parseFloat(data.plantation_area),
        growth_stage: data.growth_stage,
        last_fertilization_date: data.last_fertilization_date,
        fertilizer_used: data.fertilizer_used || null,
        next_fertilization_date: data.next_fertilization_date,
        last_pesticide_date: data.last_pesticide_date,
        pesticide_used: data.pesticide_used || null,
        application_reason: data.application_reason || null,
        disease_status: data.disease_status,
        bunches_harvested: data.bunches_harvested ? parseFloat(data.bunches_harvested) : 0,
        harvest_date: data.bunches_harvested && parseFloat(data.bunches_harvested) > 0 ? new Date() : null,
        notes: data.notes || null
      };

      if (editingCrop) {
        // Update existing record
        const { error } = await supabase
          .from('banana_plantation')
          .update(submissionData)
          .eq('id', editingCrop.id);
        
        if (error) throw error;
        toast.success('Banana plantation record updated successfully');
        setEditingCrop(null);
      } else {
        // Insert new record
        const { error } = await supabase
          .from('banana_plantation')
          .insert([submissionData]);
        
        if (error) throw error;
        toast.success('Banana plantation record added successfully');
      }
      
      // Reset form
      form.reset();
      
      // Refresh data
      fetchCrops();
    } catch (error) {
      console.error('Error saving banana plantation record:', error);
      toast.error('Failed to save record');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit operation
  const handleEdit = (crop) => {
    console.log('Editing crop:', crop);
    setEditingCrop(crop);
    
    form.reset({
      plantation_area: String(crop.plantation_area),
      growth_stage: crop.growth_stage,
      last_fertilization_date: crop.last_fertilization_date ? new Date(crop.last_fertilization_date) : null,
      fertilizer_used: crop.fertilizer_used || '',
      next_fertilization_date: crop.next_fertilization_date ? new Date(crop.next_fertilization_date) : null,
      last_pesticide_date: crop.last_pesticide_date ? new Date(crop.last_pesticide_date) : null,
      pesticide_used: crop.pesticide_used || '',
      application_reason: crop.application_reason || '',
      disease_status: crop.disease_status,
      bunches_harvested: String(crop.bunches_harvested || '0'),
      notes: crop.notes || '',
    });
  };

  // Handle delete operation
  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this record?')) {
      try {
        const { error } = await supabase
          .from('banana_plantation')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        toast.success('Record deleted successfully');
        fetchCrops();
      } catch (error) {
        console.error('Error deleting record:', error);
        toast.error('Failed to delete record');
      }
    }
  };

  // Debug function to log current form state
  const debugForm = () => {
    const formValues = form.getValues();
    console.log('Current form state:', formValues);
    return formValues;
  };

  return {
    crops,
    isLoading,
    isSubmitting,
    form,
    handleSubmit,
    handleEdit,
    handleDelete,
    fetchCrops,
    debugForm,
    editingCrop,
    setEditingCrop
  };
};
