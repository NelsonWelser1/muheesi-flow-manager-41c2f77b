import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useShipments = () => {
  const queryClient = useQueryClient();

  const { data: shipments = [], isLoading } = useQuery({
    queryKey: ['shipments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const createShipment = useMutation({
    mutationFn: async (shipmentData) => {
      const { data, error } = await supabase
        .from('shipments')
        .insert([shipmentData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      toast.success('Shipping order created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create shipping order: ${error.message}`);
    }
  });

  const updateShipment = useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data, error } = await supabase
        .from('shipments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      toast.success('Shipment updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update shipment: ${error.message}`);
    }
  });

  return {
    shipments,
    isLoading,
    createShipment,
    updateShipment
  };
};
