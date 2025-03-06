
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase';
import { useToast } from "@/components/ui/use-toast";

/**
 * Custom hook for managing delivery operations with Supabase
 * Handles CRUD operations for logistics_deliveries table
 * AUTHENTICATION COMPLETELY BYPASSED - All operations allowed without login
 */
export const useDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Fetch all deliveries
  const fetchDeliveries = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching deliveries from Supabase database...');
      const { data, error } = await supabase
        .from('logistics_deliveries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase fetch error:', error);
        throw error;
      }
      
      console.log(`Successfully fetched ${data?.length || 0} deliveries:`, data);
      setDeliveries(data || []);
    } catch (error) {
      console.error('Error fetching deliveries:', error.message || error);
      setError(error.message || 'Failed to fetch deliveries');
      toast({
        title: 'Data Fetch Error',
        description: `Failed to fetch deliveries: ${error.message || 'Unknown error'}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      console.log('Fetch operation completed');
    }
  }, [toast]);

  // Create a new delivery
  const createDelivery = async (deliveryData) => {
    try {
      console.log('Creating new delivery with data:', deliveryData);
      
      // AUTHENTICATION COMPLETELY BYPASSED
      // No auth check is performed - anyone can submit data
      
      const { data, error } = await supabase
        .from('logistics_deliveries')
        .insert([deliveryData])
        .select();

      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }
      
      console.log('Delivery created successfully:', data[0]);
      toast({
        title: 'Success',
        description: 'Delivery record created successfully',
      });
      
      // Update the local state with the new delivery
      setDeliveries(prevDeliveries => [data[0], ...prevDeliveries]);
      
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error creating delivery:', error.message || error);
      toast({
        title: 'Submission Error',
        description: `Failed to create delivery: ${error.message || 'Unknown error'}`,
        variant: 'destructive',
      });
      return { success: false, error: error.message || 'Failed to create delivery' };
    }
  };

  // Get a delivery by ID
  const getDeliveryById = async (id) => {
    try {
      console.log('Fetching delivery by ID:', id);
      // AUTHENTICATION BYPASSED - No auth check for fetching delivery
      const { data, error } = await supabase
        .from('logistics_deliveries')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Supabase fetch by ID error:', error);
        throw error;
      }
      
      console.log('Delivery details retrieved:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching delivery by ID:', error.message || error);
      return { success: false, error: error.message || 'Failed to fetch delivery' };
    }
  };

  // Update a delivery
  const updateDelivery = async (id, updates) => {
    try {
      console.log('Updating delivery:', id, 'with data:', updates);
      
      // AUTHENTICATION BYPASSED - No auth check for updates
      const { data, error } = await supabase
        .from('logistics_deliveries')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }
      
      console.log('Delivery updated successfully:', data[0]);
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
      
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error updating delivery:', error.message || error);
      toast({
        title: 'Update Error',
        description: `Failed to update delivery: ${error.message || 'Unknown error'}`,
        variant: 'destructive',
      });
      return { success: false, error: error.message || 'Failed to update delivery' };
    }
  };

  // Delete a delivery
  const deleteDelivery = async (id) => {
    try {
      console.log('Deleting delivery with ID:', id);
      // AUTHENTICATION BYPASSED - No auth check for deletion
      const { error } = await supabase
        .from('logistics_deliveries')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase delete error:', error);
        throw error;
      }
      
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
      console.error('Error deleting delivery:', error.message || error);
      toast({
        title: 'Deletion Error',
        description: `Failed to delete delivery: ${error.message || 'Unknown error'}`,
        variant: 'destructive',
      });
      return { success: false, error: error.message || 'Failed to delete delivery' };
    }
  };

  // Load deliveries when component mounts
  useEffect(() => {
    console.log('useDeliveries hook mounted, fetching initial data...');
    fetchDeliveries();
    
    // No cleanup needed for this effect
    return () => console.log('useDeliveries hook unmounted');
  }, [fetchDeliveries]);

  // Return all the functions and state needed by components
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
