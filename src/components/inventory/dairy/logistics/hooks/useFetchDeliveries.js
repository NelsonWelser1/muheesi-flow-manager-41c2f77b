
import { useState, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { deliveryService } from '../services/deliveryService';
import { deliveryToasts } from '../utils/deliveryToasts';

/**
 * Custom hook for fetching deliveries
 */
export const useFetchDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

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
      
      // Determine the type of error for appropriate toast
      if (error.message?.includes('network') || error.message?.includes('connection')) {
        deliveryToasts.networkError(toast, error.message);
      } else {
        deliveryToasts.error(toast, `Failed to fetch deliveries: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setIsLoading(false);
      console.log('Fetch operation completed');
    }
  }, [toast]);

  // Get a delivery by ID
  const getDeliveryById = async (id) => {
    try {
      const delivery = await deliveryService.getById(id);
      return { success: true, data: delivery };
    } catch (error) {
      if (error.message?.includes('network') || error.message?.includes('connection')) {
        deliveryToasts.networkError(toast, error.message);
      } else {
        deliveryToasts.error(toast, `Failed to fetch delivery: ${error.message || 'Unknown error'}`);
      }
      return { success: false, error: error.message || 'Failed to fetch delivery' };
    }
  };

  return {
    deliveries,
    setDeliveries,
    isLoading,
    error,
    fetchDeliveries,
    getDeliveryById
  };
};
