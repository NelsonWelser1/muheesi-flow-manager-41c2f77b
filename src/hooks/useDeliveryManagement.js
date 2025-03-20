
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/supabase";
import { useToast } from "@/components/ui/use-toast";

export const useDeliveryManagement = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Fetch all deliveries from the database
  const fetchDeliveries = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('delivery_management')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setDeliveries(data || []);
    } catch (err) {
      console.error('Error fetching deliveries:', err);
      setError(err.message);
      toast({
        title: "Error fetching deliveries",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new delivery to the database
  const addDelivery = async (deliveryData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Log form data for debugging purposes
      console.log('Submitting delivery data:', deliveryData);

      const { data, error } = await supabase
        .from('delivery_management')
        .insert([deliveryData])
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

      const { data, error } = await supabase
        .from('delivery_management')
        .update(updatedData)
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
        .from('delivery_management')
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

  // Load deliveries when the component mounts
  useEffect(() => {
    fetchDeliveries();
  }, []);

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

export default useDeliveryManagement;
