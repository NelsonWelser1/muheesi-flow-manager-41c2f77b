
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

/**
 * Hook to fetch cattle data from Supabase
 */
export const useFetchCattle = () => {
  return useQuery({
    queryKey: ['cattle'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cattle_inventory')
        .select('*')
        .order('tag_number');
        
      if (error) throw error;
      return data || [];
    },
  });
};

/**
 * Hook to add a new cattle to the database
 */
export const useAddCattle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (cattleData) => {
      const { data, error } = await supabase
        .from('cattle_inventory')
        .insert([cattleData])
        .select();
        
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cattle'] });
    },
  });
};

/**
 * Hook to update an existing cattle record
 */
export const useUpdateCattle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data, error } = await supabase
        .from('cattle_inventory')
        .update(updates)
        .eq('id', id)
        .select();
        
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cattle'] });
    },
  });
};

/**
 * Hook to delete a cattle record
 */
export const useDeleteCattle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('cattle_inventory')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cattle'] });
    },
  });
};
