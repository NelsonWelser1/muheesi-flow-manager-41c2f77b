
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/supabase";
import { useToast } from "@/components/ui/use-toast";
import { showSuccessToast, showErrorToast } from "@/components/ui/notifications";

export const useEmployeeDossiers = (searchQuery = '') => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all employee dossiers
  const { 
    data: dossiers = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['employeeDossiers'],
    queryFn: async () => {
      console.log('Fetching employee dossiers...');
      
      const { data, error } = await supabase
        .from('employee_dossiers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching dossiers:', error);
        throw error;
      }
      
      console.log('Fetched dossiers:', data);
      return data || [];
    }
  });

  // Filter dossiers based on search query
  const filteredDossiers = searchQuery 
    ? dossiers.filter(dossier => 
        dossier.employee_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (dossier.job_title && dossier.job_title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (dossier.department && dossier.department.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : dossiers;

  // Create new dossier mutation
  const createDossierMutation = useMutation({
    mutationFn: async (formData) => {
      console.log('Creating new dossier with data:', formData);
      
      const { data, error } = await supabase
        .from('employee_dossiers')
        .insert([formData])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating dossier:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employeeDossiers'] });
      showSuccessToast(toast, 'Dossier created successfully');
    },
    onError: (error) => {
      showErrorToast(toast, `Failed to create dossier: ${error.message}`);
    }
  });

  // Update existing dossier mutation
  const updateDossierMutation = useMutation({
    mutationFn: async ({ id, formData }) => {
      console.log('Updating dossier with ID:', id, 'Data:', formData);
      
      const { data, error } = await supabase
        .from('employee_dossiers')
        .update(formData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating dossier:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employeeDossiers'] });
      showSuccessToast(toast, 'Dossier updated successfully');
    },
    onError: (error) => {
      showErrorToast(toast, `Failed to update dossier: ${error.message}`);
    }
  });

  // Delete dossier mutation
  const deleteDossierMutation = useMutation({
    mutationFn: async (id) => {
      console.log('Deleting dossier with ID:', id);
      
      const { error } = await supabase
        .from('employee_dossiers')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting dossier:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employeeDossiers'] });
      showSuccessToast(toast, 'Dossier deleted successfully');
    },
    onError: (error) => {
      showErrorToast(toast, `Failed to delete dossier: ${error.message}`);
    }
  });

  // Function to create or update a dossier
  const saveDossier = (formData, id = null) => {
    // Debug logging
    console.log('Saving dossier with data:', formData, 'ID:', id);
    
    // Validate required fields
    if (!formData.employee_id) {
      showErrorToast(toast, 'Employee ID is required');
      return;
    }
    
    // Add timestamp for updated_at
    const dataWithTimestamp = {
      ...formData,
      updated_at: new Date().toISOString()
    };
    
    if (id) {
      updateDossierMutation.mutate({ id, formData: dataWithTimestamp });
    } else {
      createDossierMutation.mutate(dataWithTimestamp);
    }
  };

  // Function to handle form submission with debug logging
  const handleSubmit = (formData, id = null) => {
    // Debug log of form data before saving
    console.log('Form submission data:', formData);
    
    // Transform date-only strings to ISO format if needed
    const transformedData = {
      ...formData,
      shift_start: formData.shift_start ? new Date(formData.shift_start).toISOString() : null,
      shift_end: formData.shift_end ? new Date(formData.shift_end).toISOString() : null,
      review_date_time: formData.review_date_time ? new Date(formData.review_date_time).toISOString() : null,
    };
    
    saveDossier(transformedData, id);
  };

  return {
    dossiers: filteredDossiers,
    isLoading,
    error,
    saveDossier: handleSubmit,
    deleteDossier: deleteDossierMutation.mutate,
    isSaving: createDossierMutation.isPending || updateDossierMutation.isPending,
    isDeleting: deleteDossierMutation.isPending,
  };
};
