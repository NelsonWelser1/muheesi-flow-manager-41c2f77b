
import { useEffect } from 'react';
import { useFetchDeliveries } from './useFetchDeliveries';
import { useDeliveryCrud } from './useDeliveryCrud';

/**
 * Main hook for managing delivery operations
 * Combines fetching and CRUD operations
 */
export const useDeliveries = () => {
  const {
    deliveries,
    setDeliveries,
    isLoading,
    error,
    fetchDeliveries,
    getDeliveryById
  } = useFetchDeliveries();

  const {
    validationErrors,
    setValidationErrors,
    createDelivery,
    updateDelivery,
    deleteDelivery
  } = useDeliveryCrud(setDeliveries);

  // Load deliveries when component mounts
  useEffect(() => {
    console.log('useDeliveries hook mounted, fetching initial data...');
    fetchDeliveries();
    return () => console.log('useDeliveries hook unmounted');
  }, [fetchDeliveries]);

  // Wrap update delivery to include current deliveries
  const handleUpdateDelivery = async (id, updates) => {
    return updateDelivery(id, updates, deliveries);
  };

  return {
    deliveries,
    isLoading,
    error,
    validationErrors,
    setValidationErrors,
    fetchDeliveries,
    createDelivery,
    getDeliveryById,
    updateDelivery: handleUpdateDelivery,
    deleteDelivery,
    isAuthenticated: true // Explicitly set to true since auth is disabled
  };
};
