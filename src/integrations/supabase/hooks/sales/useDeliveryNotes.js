import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for managing delivery notes in Supabase
 */
export const useDeliveryNotes = () => {
  const [deliveryNotes, setDeliveryNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Fetch all delivery notes
  const fetchDeliveryNotes = async () => {
    try {
      setLoading(true);
      console.log('Fetching delivery notes from Supabase...');
      
      const { data, error } = await supabase
        .from('delivery_notes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching delivery notes:', error);
        setError(error.message);
        toast({
          title: "Error fetching delivery notes",
          description: error.message,
          variant: "destructive"
        });
        return [];
      }
      
      console.log('Delivery notes fetched successfully:', data);
      setDeliveryNotes(data || []);
      return data || [];
    } catch (err) {
      console.error('Unexpected error fetching delivery notes:', err);
      setError(err.message);
      toast({
        title: "Unexpected error",
        description: err.message,
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Create a new delivery note
  const createDeliveryNote = async (deliveryData) => {
    try {
      setLoading(true);
      console.log('Creating new delivery note with data:', deliveryData);
      
      // Ensure proper data structure before saving
      const formattedData = {
        order_reference: deliveryData.orderReference || '',
        delivery_date: deliveryData.deliveryDate || new Date().toISOString().split('T')[0],
        receiver_name: deliveryData.receiverName || '',
        receiver_contact: deliveryData.receiverContact || '',
        delivery_location: deliveryData.deliveryLocation || '',
        delivery_person: deliveryData.deliveryPerson || null,
        delivery_status: deliveryData.deliveryStatus || 'pending',
        delivered_items: deliveryData.deliveredItems || []
      };
      
      const { data, error } = await supabase
        .from('delivery_notes')
        .insert([formattedData])
        .select();
      
      if (error) {
        console.error('Error creating delivery note:', error);
        setError(error.message);
        toast({
          title: "Error creating delivery note",
          description: error.message,
          variant: "destructive"
        });
        return { success: false, error, data: null };
      }
      
      console.log('Delivery note created successfully:', data);
      toast({
        title: "Success",
        description: "Delivery note created successfully",
      });
      
      // Refresh the delivery notes list
      await fetchDeliveryNotes();
      
      return { success: true, data: data[0], error: null };
    } catch (err) {
      console.error('Unexpected error creating delivery note:', err);
      setError(err.message);
      toast({
        title: "Unexpected error",
        description: err.message || "An unexpected error occurred",
        variant: "destructive"
      });
      return { success: false, error: err, data: null };
    } finally {
      setLoading(false);
    }
  };

  // Get a delivery note by ID
  const getDeliveryNoteById = async (id) => {
    try {
      console.log('Fetching delivery note with ID:', id);
      
      const { data, error } = await supabase
        .from('delivery_notes')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching delivery note:', error);
        return { success: false, error, data: null };
      }
      
      console.log('Delivery note fetched successfully:', data);
      return { success: true, data, error: null };
    } catch (err) {
      console.error('Unexpected error fetching delivery note:', err);
      return { success: false, error: err, data: null };
    }
  };

  // Update a delivery note
  const updateDeliveryNote = async (id, updateData) => {
    try {
      console.log('Updating delivery note with ID:', id);
      
      // Format data to match database schema
      const formattedData = {};
      if (updateData.orderReference) formattedData.order_reference = updateData.orderReference;
      if (updateData.deliveryDate) formattedData.delivery_date = updateData.deliveryDate;
      if (updateData.receiverName) formattedData.receiver_name = updateData.receiverName;
      if (updateData.receiverContact) formattedData.receiver_contact = updateData.receiverContact;
      if (updateData.deliveryLocation) formattedData.delivery_location = updateData.deliveryLocation;
      if (updateData.deliveryPerson) formattedData.delivery_person = updateData.deliveryPerson;
      if (updateData.deliveryStatus) formattedData.delivery_status = updateData.deliveryStatus;
      if (updateData.deliveredItems) formattedData.delivered_items = updateData.deliveredItems;
      
      const { data, error } = await supabase
        .from('delivery_notes')
        .update(formattedData)
        .eq('id', id)
        .select();
      
      if (error) {
        console.error('Error updating delivery note:', error);
        return { success: false, error, data: null };
      }
      
      console.log('Delivery note updated successfully:', data);
      
      // Refresh delivery notes list
      await fetchDeliveryNotes();
      
      return { success: true, data: data[0], error: null };
    } catch (err) {
      console.error('Unexpected error updating delivery note:', err);
      return { success: false, error: err, data: null };
    }
  };

  // Delete a delivery note
  const deleteDeliveryNote = async (id) => {
    try {
      console.log('Deleting delivery note with ID:', id);
      
      const { error } = await supabase
        .from('delivery_notes')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting delivery note:', error);
        return { success: false, error };
      }
      
      console.log('Delivery note deleted successfully');
      
      // Refresh delivery notes list
      await fetchDeliveryNotes();
      
      return { success: true, error: null };
    } catch (err) {
      console.error('Unexpected error deleting delivery note:', err);
      return { success: false, error: err };
    }
  };

  // Initialize by fetching delivery notes on component mount
  useEffect(() => {
    fetchDeliveryNotes();
  }, []);

  return {
    deliveryNotes,
    loading,
    error,
    fetchDeliveryNotes,
    createDeliveryNote,
    getDeliveryNoteById,
    updateDeliveryNote,
    deleteDeliveryNote
  };
};
