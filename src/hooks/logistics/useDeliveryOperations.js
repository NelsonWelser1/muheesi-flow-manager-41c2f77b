
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/supabase";
import { useToast } from "@/components/ui/use-toast";

export const useDeliveryOperations = (deliveries, setDeliveries) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Add a new delivery to the database
  const addDelivery = async (deliveryData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Log form data for debugging purposes
      console.log('Submitting delivery data:', deliveryData);

      // Add status if not provided (to meet the check constraint)
      if (!deliveryData.status) {
        deliveryData.status = 'Pending';
      }

      // Set operator_id to null to bypass RLS policy temporarily
      const formattedData = {
        ...deliveryData,
        operator_id: null, // Set to null to work with our temporary RLS policy
        scheduled_pickup_time: deliveryData.scheduled_pickup_time ? new Date(deliveryData.scheduled_pickup_time).toISOString() : null,
        scheduled_delivery_time: deliveryData.scheduled_delivery_time ? new Date(deliveryData.scheduled_delivery_time).toISOString() : null,
        actual_pickup_time: deliveryData.actual_pickup_time ? new Date(deliveryData.actual_pickup_time).toISOString() : null,
        actual_delivery_time: deliveryData.actual_delivery_time ? new Date(deliveryData.actual_delivery_time).toISOString() : null,
      };

      const { data, error } = await supabase
        .from('logistics_delivery_management')
        .insert([formattedData])
        .select();

      if (error) throw error;
      
      setDeliveries(prevDeliveries => [data[0], ...prevDeliveries]);
      
      toast({
        title: "Delivery record created",
        description: `Delivery ID: ${deliveryData.delivery_id} has been saved.`,
      });
      
      return data[0];
    } catch (err) {
      console.error('Error adding delivery:', err);
      setError(err.message);
      toast({
        title: "Error creating delivery record",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing delivery
  const updateDelivery = async (id, updatedData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Log update data for debugging purposes
      console.log('Updating delivery data:', { id, updatedData });

      // Format date fields to ISO strings if they exist
      const formattedData = {
        ...updatedData,
        operator_id: null, // Set to null to work with our temporary RLS policy
        scheduled_pickup_time: updatedData.scheduled_pickup_time ? new Date(updatedData.scheduled_pickup_time).toISOString() : null,
        scheduled_delivery_time: updatedData.scheduled_delivery_time ? new Date(updatedData.scheduled_delivery_time).toISOString() : null,
        actual_pickup_time: updatedData.actual_pickup_time ? new Date(updatedData.actual_pickup_time).toISOString() : null,
        actual_delivery_time: updatedData.actual_delivery_time ? new Date(updatedData.actual_delivery_time).toISOString() : null,
      };

      const { data, error } = await supabase
        .from('logistics_delivery_management')
        .update(formattedData)
        .eq('id', id)
        .select();

      if (error) throw error;
      
      setDeliveries(prevDeliveries => 
        prevDeliveries.map(delivery => 
          delivery.id === id ? data[0] : delivery
        )
      );
      
      toast({
        title: "Delivery record updated",
        description: `Delivery ID: ${updatedData.delivery_id || id} has been updated.`,
      });
      
      return data[0];
    } catch (err) {
      console.error('Error updating delivery:', err);
      setError(err.message);
      toast({
        title: "Error updating delivery record",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a delivery
  const deleteDelivery = async (id) => {
    try {
      setIsLoading(true);
      setError(null);

      // Log deletion for debugging purposes
      console.log('Deleting delivery:', id);

      const { error } = await supabase
        .from('logistics_delivery_management')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setDeliveries(prevDeliveries => 
        prevDeliveries.filter(delivery => delivery.id !== id)
      );
      
      toast({
        title: "Delivery record deleted",
        description: "The delivery record has been removed.",
      });
    } catch (err) {
      console.error('Error deleting delivery:', err);
      setError(err.message);
      toast({
        title: "Error deleting delivery record",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    addDelivery,
    updateDelivery,
    deleteDelivery
  };
};
