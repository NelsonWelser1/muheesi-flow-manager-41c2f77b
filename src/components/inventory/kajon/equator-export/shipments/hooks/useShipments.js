
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from "@/components/ui/use-toast";

export const useShipments = () => {
  const [shipments, setShipments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Fetch all shipments
  const fetchShipments = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setShipments(data || []);
      console.log('Fetched shipments:', data);
    } catch (err) {
      console.error('Error fetching shipments:', err);
      setError(err);
      toast({
        title: "Error fetching shipments",
        description: err.message || "Failed to load shipment records",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new shipment
  const createShipment = async (shipmentData) => {
    setIsLoading(true);
    
    try {
      // Validate required fields
      const requiredFields = ['shipment_id', 'status', 'container', 'departure_date', 'eta'];
      const missingFields = requiredFields.filter(field => !shipmentData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }
      
      const { data, error } = await supabase
        .from('shipments')
        .insert([shipmentData])
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Shipment Created",
        description: `Shipment ${shipmentData.shipment_id} has been created successfully.`,
      });
      
      console.log('Created shipment:', data);
      await fetchShipments(); // Refresh the list
      return { success: true, data };
    } catch (err) {
      console.error('Error creating shipment:', err);
      toast({
        title: "Error creating shipment",
        description: err.message || "Failed to create shipment",
        variant: "destructive",
      });
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a shipment
  const deleteShipment = async (id) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('shipments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Shipment Deleted",
        description: "The shipment has been deleted successfully.",
      });
      
      await fetchShipments(); // Refresh the list
      return { success: true };
    } catch (err) {
      console.error('Error deleting shipment:', err);
      toast({
        title: "Error deleting shipment",
        description: err.message || "Failed to delete shipment",
        variant: "destructive",
      });
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  // Update a shipment
  const updateShipment = async (id, updatedData) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('shipments')
        .update(updatedData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      // Update the local state to reflect the change immediately
      setShipments(prevShipments => 
        prevShipments.map(shipment => 
          shipment.id === id ? { ...shipment, ...updatedData } : shipment
        )
      );
      
      toast({
        title: "Shipment Updated",
        description: "Shipment has been updated successfully.",
      });
      
      console.log('Updated shipment:', data);
      return { success: true, data };
    } catch (err) {
      console.error('Error updating shipment:', err);
      toast({
        title: "Error updating shipment",
        description: err.message || "Failed to update shipment",
        variant: "destructive",
      });
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  // Update shipment status
  const updateShipmentStatus = async (id, newStatus) => {
    try {
      const result = await updateShipment(id, { 
        status: newStatus, 
        last_update: new Date().toISOString().split('T')[0]  // Update the last_update date
      });
      
      if (result.success) {
        toast({
          title: "Status Updated",
          description: `Shipment status changed to ${newStatus}`,
        });
      }
      
      return result;
    } catch (err) {
      console.error('Error updating status:', err);
      return { success: false, error: err };
    }
  };

  // Load shipments on component mount
  useEffect(() => {
    fetchShipments();
  }, []);

  return {
    shipments,
    isLoading,
    error,
    fetchShipments,
    createShipment,
    deleteShipment,
    updateShipment,
    updateShipmentStatus
  };
};
