
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

export const useDeliveryNotes = () => {
  const queryClient = useQueryClient();

  // Fetch all delivery notes
  const fetchDeliveryNotes = async () => {
    console.log('Fetching delivery notes from Supabase');
    const { data, error } = await supabase
      .from('delivery_notes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching delivery notes:', error);
      throw error;
    }

    console.log('Fetched delivery notes:', data);
    return data || [];
  };

  // Add new delivery note
  const addDeliveryNote = async (newNote) => {
    console.log('Adding new delivery note:', newNote);
    
    // Prepare the data structure to match the table schema
    const noteToAdd = {
      order_reference: newNote.orderReference || '',
      delivery_date: newNote.deliveryDate || new Date().toISOString().split('T')[0],
      receiver_name: newNote.receiverName || '',
      receiver_contact: newNote.receiverContact || '',
      delivery_location: newNote.deliveryLocation || '',
      delivery_person: newNote.deliveryPerson || '',
      delivery_status: newNote.deliveryStatus || 'pending',
      items: newNote.items || [],
      digital_signature: newNote.digitalSignature || null,
      geolocation: newNote.geolocation || null,
      qr_code: newNote.qrCode || null
    };
    
    const { data, error } = await supabase
      .from('delivery_notes')
      .insert([noteToAdd])
      .select()
      .single();

    if (error) {
      console.error('Error adding delivery note:', error);
      throw error;
    }

    console.log('Successfully added delivery note:', data);
    return data;
  };

  // Update delivery note status
  const updateDeliveryNoteStatus = async ({ id, status }) => {
    console.log('Updating delivery note status:', { id, status });
    const { data, error } = await supabase
      .from('delivery_notes')
      .update({ delivery_status: status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating delivery note status:', error);
      throw error;
    }

    console.log('Successfully updated delivery note status:', data);
    return data;
  };

  // Delete delivery note
  const deleteDeliveryNote = async (id) => {
    console.log('Deleting delivery note:', id);
    const { error } = await supabase
      .from('delivery_notes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting delivery note:', error);
      throw error;
    }

    console.log('Successfully deleted delivery note with ID:', id);
    return id;
  };

  // Use React Query for data fetching and caching
  const { data: deliveryNotes, isLoading, error, refetch } = useQuery({
    queryKey: ['deliveryNotes'],
    queryFn: fetchDeliveryNotes
  });

  // Mutations for modifying data
  const addDeliveryNoteMutation = useMutation({
    mutationFn: addDeliveryNote,
    onSuccess: () => {
      queryClient.invalidateQueries(['deliveryNotes']);
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: updateDeliveryNoteStatus,
    onSuccess: () => {
      queryClient.invalidateQueries(['deliveryNotes']);
    }
  });

  const deleteDeliveryNoteMutation = useMutation({
    mutationFn: deleteDeliveryNote,
    onSuccess: () => {
      queryClient.invalidateQueries(['deliveryNotes']);
    }
  });

  return {
    deliveryNotes: deliveryNotes || [],
    isLoading,
    error,
    refetch,
    addDeliveryNote: addDeliveryNoteMutation.mutate,
    updateDeliveryNoteStatus: updateStatusMutation.mutate,
    deleteDeliveryNote: deleteDeliveryNoteMutation.mutate,
    isSaving: addDeliveryNoteMutation.isPending
  };
};
