import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from "@/hooks/use-toast";

export const useCattleInventory = (farmId = 'kashari') => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all cattle inventory for a farm
  const {
    data: cattleList,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['cattle-inventory', farmId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cattle_inventory')
        .select('*')
        .eq('farm_id', farmId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Add a new cattle record
  const addCattle = useMutation({
    mutationFn: async (cattleData) => {
      // Log what we're submitting to help with debugging
      console.log("Submitting cattle data:", cattleData);
      
      // Ensure required fields are present
      if (!cattleData.tag_number || !cattleData.type || !cattleData.breed) {
        const missingFields = [];
        if (!cattleData.tag_number) missingFields.push('Tag Number');
        if (!cattleData.type) missingFields.push('Type');
        if (!cattleData.breed) missingFields.push('Breed');
        
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }
      
      const payload = {
        ...cattleData,
        farm_id: farmId
      };
      
      const { data, error } = await supabase
        .from('cattle_inventory')
        .insert([payload])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Cattle registered successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['cattle-inventory', farmId] });
    },
    onError: (error) => {
      console.error("Error registering cattle:", error);
      toast({
        title: "Error",
        description: "Failed to register cattle: " + (error.message || "Unknown error"),
        variant: "destructive",
      });
    },
  });

  // Get a specific cattle record by ID
  const getCattleById = async (id) => {
    const { data, error } = await supabase
      .from('cattle_inventory')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch cattle record: " + error.message,
        variant: "destructive",
      });
      return null;
    }
    
    return data;
  };

  // Update a cattle record
  const updateCattle = useMutation({
    mutationFn: async ({ id, ...updateData }) => {
      const { data, error } = await supabase
        .from('cattle_inventory')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Cattle record updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['cattle-inventory', farmId] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update cattle record: " + error.message,
        variant: "destructive",
      });
    },
  });

  // Delete a cattle record
  const deleteCattle = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('cattle_inventory')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Cattle record deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['cattle-inventory', farmId] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete cattle record: " + error.message,
        variant: "destructive",
      });
    },
  });

  return {
    cattleList,
    isLoading,
    error,
    addCattle,
    getCattleById,
    updateCattle,
    deleteCattle,
    refetch
  };
};
