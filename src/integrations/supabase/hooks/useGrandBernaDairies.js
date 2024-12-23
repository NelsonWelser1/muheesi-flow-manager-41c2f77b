import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

// Helper function to handle Supabase responses
const handleSupabaseResponse = async (promise) => {
  const { data, error } = await promise;
  if (error) throw error;
  return data;
};

// Production Batches
export const useProductionBatches = () => useQuery({
  queryKey: ['productionBatches'],
  queryFn: () => handleSupabaseResponse(
    supabase.from('production_batches').select('*').order('created_at', { ascending: false })
  ),
});

export const useAddProductionBatch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (batch) => handleSupabaseResponse(
      supabase.from('production_batches').insert(batch).select()
    ),
    onSuccess: () => {
      queryClient.invalidateQueries(['productionBatches']);
    },
  });
};

// Raw Materials Inventory
export const useRawMaterialsInventory = () => useQuery({
  queryKey: ['rawMaterialsInventory'],
  queryFn: () => handleSupabaseResponse(
    supabase.from('raw_materials_inventory').select('*').order('expiration_date', { ascending: true })
  ),
});

export const useAddRawMaterial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (material) => handleSupabaseResponse(
      supabase.from('raw_materials_inventory').insert(material).select()
    ),
    onSuccess: () => {
      queryClient.invalidateQueries(['rawMaterialsInventory']);
    },
  });
};

// Quality Control
export const useQualityControlChecks = (batchId) => useQuery({
  queryKey: ['qualityControlChecks', batchId],
  queryFn: () => handleSupabaseResponse(
    supabase.from('quality_control_checks')
      .select('*')
      .eq('batch_id', batchId)
      .order('checked_at', { ascending: false })
  ),
  enabled: !!batchId,
});

export const useAddQualityCheck = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (check) => handleSupabaseResponse(
      supabase.from('quality_control_checks').insert(check).select()
    ),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['qualityControlChecks', data[0].batch_id]);
    },
  });
};

// Factory Operations
export const useFactoryOperations = () => {
  const { data: batches } = useProductionBatches();
  const { data: inventory } = useRawMaterialsInventory();

  return {
    batches,
    inventory,
    totalProduction: batches?.reduce((acc, batch) => acc + (batch.actual_yield || 0), 0) || 0,
    lowInventoryItems: inventory?.filter(item => item.quantity < 100) || [],
  };
};

// Cold Room Management
export const useColdRoomManagement = () => useQuery({
  queryKey: ['coldRoomManagement'],
  queryFn: () => handleSupabaseResponse(
    supabase.from('cold_room_inventory').select('*')
  ),
});