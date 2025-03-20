
import { useFetchDeliveries } from './useFetchDeliveries';
import { useDeliveryOperations } from './useDeliveryOperations';

export const useDeliveryManagement = () => {
  const { 
    deliveries, 
    setDeliveries, 
    isLoading: fetchLoading, 
    error: fetchError, 
    fetchDeliveries 
  } = useFetchDeliveries();
  
  const {
    isLoading: operationsLoading,
    error: operationsError,
    addDelivery,
    updateDelivery,
    deleteDelivery
  } = useDeliveryOperations(deliveries, setDeliveries);

  // Combine loading and error states
  const isLoading = fetchLoading || operationsLoading;
  const error = fetchError || operationsError;

  return {
    deliveries,
    isLoading,
    error,
    fetchDeliveries,
    addDelivery,
    updateDelivery,
    deleteDelivery
  };
};
