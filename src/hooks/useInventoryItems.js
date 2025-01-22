import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

export const useInventoryItems = () => {
  const queryClient = useQueryClient();

  const fetchItems = async () => {
    console.log('Fetching inventory items from Supabase');
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching inventory items:', error);
      throw error;
    }

    console.log('Fetched inventory items:', data);
    return data;
  };

  const addItem = async (newItem) => {
    console.log('Adding new inventory item:', newItem);
    const { data, error } = await supabase
      .from('inventory_items')
      .insert([newItem])
      .select()
      .single();

    if (error) {
      console.error('Error adding inventory item:', error);
      throw error;
    }

    console.log('Successfully added item:', data);
    return data;
  };

  const updateItemStatus = async ({ id, status }) => {
    console.log('Updating item status:', { id, status });
    const { data, error } = await supabase
      .from('inventory_items')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating item status:', error);
      throw error;
    }

    console.log('Successfully updated item status:', data);
    return data;
  };

  const { data: items, isLoading } = useQuery({
    queryKey: ['inventoryItems'],
    queryFn: fetchItems,
  });

  const addItemMutation = useMutation({
    mutationFn: addItem,
    onSuccess: () => {
      queryClient.invalidateQueries(['inventoryItems']);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: updateItemStatus,
    onSuccess: () => {
      queryClient.invalidateQueries(['inventoryItems']);
    },
  });

  return {
    items,
    isLoading,
    addItem: addItemMutation.mutate,
    updateItemStatus: updateStatusMutation.mutate,
  };
};