import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from "@/components/ui/use-toast";

export const useInventoryItems = () => {
  console.log('Initializing useInventoryItems hook');
  return useQuery({
    queryKey: ['inventoryItems'],
    queryFn: async () => {
      console.log('Fetching inventory items...');
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .order('procurement_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching inventory items:', error);
        throw error;
      }
      
      return data || [];
    }
  });
};

export const useAddInventoryItem = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemData) => {
      console.log('Adding new inventory item:', itemData);
      const { data, error } = await supabase
        .from('inventory_items')
        .insert([{
          item_name: itemData.itemName,
          section: itemData.section,
          quantity: Number(itemData.quantity),
          unit_cost: Number(itemData.unitCost),
          total_cost: Number(itemData.quantity) * Number(itemData.unitCost),
          supplier_details: itemData.supplierDetails,
          notes: itemData.notes,
          status: 'pending',
          procurement_date: new Date().toISOString()
        }])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['inventoryItems']);
      toast({
        title: "Success",
        description: "Item added successfully and pending review"
      });
    },
    onError: (error) => {
      console.error('Error in mutation:', error);
      toast({
        title: "Error",
        description: "Failed to add item. Please try again.",
        variant: "destructive"
      });
    }
  });
};

export const useUpdateInventoryItem = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updateData }) => {
      console.log('Updating inventory item:', id, updateData);
      const { data, error } = await supabase
        .from('inventory_items')
        .update(updateData)
        .eq('id', id)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['inventoryItems']);
      toast({
        title: "Success",
        description: "Item updated successfully"
      });
    },
    onError: (error) => {
      console.error('Error updating item:', error);
      toast({
        title: "Error",
        description: "Failed to update item. Please try again.",
        variant: "destructive"
      });
    }
  });
};