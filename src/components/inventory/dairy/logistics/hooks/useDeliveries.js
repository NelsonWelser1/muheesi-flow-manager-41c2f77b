
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase';
import { useToast } from "@/components/ui/use-toast";

export const useDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Fetch all deliveries
  const fetchDeliveries = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('Fetching deliveries from Supabase...');
      const { data, error } = await supabase
        .from('logistics_deliveries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log('Fetched deliveries:', data);
      setDeliveries(data || []);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      setError(error.message);
      toast({
        title: 'Error',
        description: `Failed to fetch deliveries: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Create a new delivery
  const createDelivery = async (deliveryData) => {
    try {
      console.log('Creating new delivery with data:', deliveryData);
      
      const { data, error } = await supabase
        .from('logistics_deliveries')
        .insert([deliveryData])
        .select();

      if (error) throw error;
      
      console.log('Delivery created successfully:', data);
      toast({
        title: 'Success',
        description: 'Delivery record created successfully',
      });
      
      // Update the local state with the new delivery
      setDeliveries(prevDeliveries => [data[0], ...prevDeliveries]);
      
      return { success: true, data };
    } catch (error) {
      console.error('Error creating delivery:', error);
      toast({
        title: 'Error',
        description: `Failed to create delivery: ${error.message}`,
        variant: 'destructive',
      });
      return { success: false, error: error.message };
    }
  };

  // Get a delivery by ID
  const getDeliveryById = async (id) => {
    try {
      console.log('Fetching delivery by ID:', id);
      const { data, error } = await supabase
        .from('logistics_deliveries')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      console.log('Delivery details:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching delivery:', error);
      return { success: false, error: error.message };
    }
  };

  // Update a delivery
  const updateDelivery = async (id, updates) => {
    try {
      console.log('Updating delivery:', id, 'with data:', updates);
      
      const { data, error } = await supabase
        .from('logistics_deliveries')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;
      
      console.log('Delivery updated successfully:', data);
      toast({
        title: 'Success',
        description: 'Delivery record updated successfully',
      });
      
      // Update the local state with the updated delivery
      setDeliveries(prevDeliveries => 
        prevDeliveries.map(delivery => 
          delivery.id === id ? data[0] : delivery
        )
      );
      
      return { success: true, data };
    } catch (error) {
      console.error('Error updating delivery:', error);
      toast({
        title: 'Error',
        description: `Failed to update delivery: ${error.message}`,
        variant: 'destructive',
      });
      return { success: false, error: error.message };
    }
  };

  // Delete a delivery
  const deleteDelivery = async (id) => {
    try {
      console.log('Deleting delivery:', id);
      const { error } = await supabase
        .from('logistics_deliveries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      console.log('Delivery deleted successfully');
      toast({
        title: 'Success',
        description: 'Delivery record deleted successfully',
      });
      
      // Update the local state by removing the deleted delivery
      setDeliveries(prevDeliveries => 
        prevDeliveries.filter(delivery => delivery.id !== id)
      );
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting delivery:', error);
      toast({
        title: 'Error',
        description: `Failed to delete delivery: ${error.message}`,
        variant: 'destructive',
      });
      return { success: false, error: error.message };
    }
  };

  // Load deliveries when component mounts
  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  return {
    deliveries,
    isLoading,
    error,
    fetchDeliveries,
    createDelivery,
    getDeliveryById,
    updateDelivery,
    deleteDelivery
  };
};
