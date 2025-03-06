
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { deliveryService } from '../services/deliveryService';
import { deliveryToasts } from '../utils/deliveryToasts';
import { useSupabaseAuth } from '@/integrations/supabase';

/**
 * Custom hook for managing delivery operations
 * Uses deliveryService for API operations and deliveryToasts for notifications
 */
export const useDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]= useState(null);
  const { toast } = useToast();
  const { isLoggedIn } = useSupabaseAuth();

  // Fetch all deliveries
  const fetchDeliveries = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await deliveryService.fetchAll();
      setDeliveries(data);
    } catch (error) {
      console.error('Error fetching deliveries:', error.message || error);
      setError(error.message || 'Failed to fetch deliveries');
      deliveryToasts.error(toast, `Failed to fetch deliveries: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
      console.log('Fetch operation completed');
    }
  }, [toast]);

  // Create a new delivery
  const createDelivery = async (deliveryData) => {
    if (!isLoggedIn) {
      deliveryToasts.error(toast, 'You must be logged in to submit delivery records');
      return { success: false, error: 'Authentication required' };
    }
    
    try {
      const newDelivery = await deliveryService.create(deliveryData);
      deliveryToasts.success(toast, 'Delivery record created successfully');
      setDeliveries(prevDeliveries => [newDelivery, ...prevDeliveries]);
      return { success: true, data: newDelivery };
    } catch (error) {
      deliveryToasts.error(toast, `Failed to create delivery: ${error.message || 'Unknown error'}`);
      return { success: false, error: error.message || 'Failed to create delivery' };
    }
  };

  // Get a delivery by ID
  const getDeliveryById = async (id) => {
    if (!isLoggedIn) {
      deliveryToasts.error(toast, 'You must be logged in to view delivery details');
      return { success: false, error: 'Authentication required' };
    }
    
    try {
      const delivery = await deliveryService.getById(id);
      return { success: true, data: delivery };
    } catch (error) {
      deliveryToasts.error(toast, `Failed to fetch delivery: ${error.message || 'Unknown error'}`);
      return { success: false, error: error.message || 'Failed to fetch delivery' };
    }
  };

  // Update a delivery
  const updateDelivery = async (id, updates) => {
    if (!isLoggedIn) {
      deliveryToasts.error(toast, 'You must be logged in to update delivery records');
      return { success: false, error: 'Authentication required' };
    }
    
    try {
      const updatedDelivery = await deliveryService.update(id, updates);
      deliveryToasts.success(toast, 'Delivery record updated successfully');
      setDeliveries(prevDeliveries => 
        prevDeliveries.map(delivery => 
          delivery.id === id ? updatedDelivery : delivery
        )
      );
      return { success: true, data: updatedDelivery };
    } catch (error) {
      deliveryToasts.error(toast, `Failed to update delivery: ${error.message || 'Unknown error'}`);
      return { success: false, error: error.message || 'Failed to update delivery' };
    }
  };

  // Delete a delivery
  const deleteDelivery = async (id) => {
    if (!isLoggedIn) {
      deliveryToasts.error(toast, 'You must be logged in to delete delivery records');
      return { success: false, error: 'Authentication required' };
    }
    
    try {
      await deliveryService.delete(id);
      deliveryToasts.success(toast, 'Delivery record deleted successfully');
      setDeliveries(prevDeliveries => 
        prevDeliveries.filter(delivery => delivery.id !== id)
      );
      return { success: true };
    } catch (error) {
      deliveryToasts.error(toast, `Failed to delete delivery: ${error.message || 'Unknown error'}`);
      return { success: false, error: error.message || 'Failed to delete delivery' };
    }
  };

  // Load deliveries when component mounts
  useEffect(() => {
    console.log('useDeliveries hook mounted, fetching initial data...');
    fetchDeliveries();
    return () => console.log('useDeliveries hook unmounted');
  }, [fetchDeliveries]);

  return {
    deliveries,
    isLoading,
    error,
    fetchDeliveries,
    createDelivery,
    getDeliveryById,
    updateDelivery,
    deleteDelivery,
    isAuthenticated: isLoggedIn
  };
};
