
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { deliveryService } from '../services/deliveryService';
import { deliveryToasts } from '../utils/deliveryToasts';

/**
 * Custom hook for delivery CRUD operations
 */
export const useDeliveryCrud = (setDeliveries) => {
  const [validationErrors, setValidationErrors] = useState({});
  const { toast } = useToast();

  // Create a new delivery
  const createDelivery = async (deliveryData) => {
    // Clear previous validation errors
    setValidationErrors({});
    
    // Validate delivery data
    const validation = deliveryService.validateDeliveryData(deliveryData);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      deliveryToasts.validationError(toast, 'Please fix the errors in the form');
      return { success: false, validationErrors: validation.errors };
    }
    
    try {
      const newDelivery = await deliveryService.create(deliveryData);
      deliveryToasts.success(toast, 'Delivery record created successfully');
      setDeliveries(prevDeliveries => [newDelivery, ...prevDeliveries]);
      return { success: true, data: newDelivery };
    } catch (error) {
      // Handle different error types
      if (error.message?.includes('Missing required fields')) {
        deliveryToasts.validationError(toast, error.message);
      } else if (error.message?.includes('network') || error.message?.includes('connection')) {
        deliveryToasts.networkError(toast, error.message);
      } else {
        deliveryToasts.error(toast, `Failed to create delivery: ${error.message || 'Unknown error'}`);
      }
      return { success: false, error: error.message || 'Failed to create delivery' };
    }
  };

  // Update a delivery
  const updateDelivery = async (id, updates, allDeliveries) => {
    // Validate delivery data for update if it contains fields that need validation
    if (Object.keys(updates).some(key => ['delivery_id', 'order_id', 'customer_name', 'status', 
                                        'pickup_location', 'delivery_location', 
                                        'scheduled_pickup_time', 'scheduled_delivery_time'].includes(key))) {
      const validation = deliveryService.validateDeliveryData({
        ...allDeliveries.find(d => d.id === id),
        ...updates
      });
      
      if (!validation.isValid) {
        setValidationErrors(validation.errors);
        deliveryToasts.validationError(toast, 'Please fix the errors in the form');
        return { success: false, validationErrors: validation.errors };
      }
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
      if (error.message?.includes('network') || error.message?.includes('connection')) {
        deliveryToasts.networkError(toast, error.message);
      } else {
        deliveryToasts.error(toast, `Failed to update delivery: ${error.message || 'Unknown error'}`);
      }
      return { success: false, error: error.message || 'Failed to update delivery' };
    }
  };

  // Delete a delivery
  const deleteDelivery = async (id) => {
    try {
      await deliveryService.delete(id);
      deliveryToasts.success(toast, 'Delivery record deleted successfully');
      setDeliveries(prevDeliveries => 
        prevDeliveries.filter(delivery => delivery.id !== id)
      );
      return { success: true };
    } catch (error) {
      if (error.message?.includes('network') || error.message?.includes('connection')) {
        deliveryToasts.networkError(toast, error.message);
      } else {
        deliveryToasts.error(toast, `Failed to delete delivery: ${error.message || 'Unknown error'}`);
      }
      return { success: false, error: error.message || 'Failed to delete delivery' };
    }
  };

  return {
    validationErrors,
    setValidationErrors,
    createDelivery,
    updateDelivery,
    deleteDelivery
  };
};
