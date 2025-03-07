
import { useFetchSalesOrders } from './sales/useFetchSalesOrders';
import { useCreateSalesOrder } from './sales/useCreateSalesOrder';
import { useSalesOrderDetails } from './sales/useSalesOrderDetails';
import { useUpdateSalesOrder } from './sales/useUpdateSalesOrder';
import { useDeleteSalesOrder } from './sales/useDeleteSalesOrder';
import { salesOrderUtils } from './sales/useSalesOrderUtils';

/**
 * Combined hook that provides all sales order functionality
 * This maintains the same API as the original hook to avoid breaking changes
 */
export const useSalesOrders = () => {
  // Fetch sales orders
  const { 
    salesOrders, 
    loading, 
    error, 
    fetchSalesOrders 
  } = useFetchSalesOrders();
  
  // Create sales order
  const { 
    createSalesOrder, 
    loading: createLoading 
  } = useCreateSalesOrder(fetchSalesOrders);
  
  // Get sales order details
  const { 
    getSalesOrderById 
  } = useSalesOrderDetails();
  
  // Update sales order
  const { 
    updateSalesOrder, 
    loading: updateLoading 
  } = useUpdateSalesOrder(fetchSalesOrders);
  
  // Delete sales order
  const { 
    deleteSalesOrder, 
    loading: deleteLoading 
  } = useDeleteSalesOrder(fetchSalesOrders);

  return {
    // Original API properties/methods
    salesOrders,
    loading: loading || createLoading || updateLoading || deleteLoading,
    error,
    fetchSalesOrders,
    createSalesOrder,
    getSalesOrderById,
    updateSalesOrder,
    deleteSalesOrder,
    
    // New utilities
    formatSalesOrder: salesOrderUtils.formatSalesOrder,
    calculateOrderStatistics: salesOrderUtils.calculateOrderStatistics
  };
};
