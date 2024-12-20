import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

// Factory Operations
export const useFactoryOperations = () => useQuery({
    queryKey: ['factoryOperations'],
    queryFn: () => fromSupabase(supabase.from('production_data').select('*')),
});

// Cold Room Management
export const useColdRoomManagement = () => useQuery({
    queryKey: ['coldRoomManagement'],
    queryFn: () => fromSupabase(supabase.from('cold_room_inventory').select('*')),
});

// Dairy Sales Records
export const useDairySalesRecords = () => useQuery({
    queryKey: ['dairySales'],
    queryFn: () => fromSupabase(supabase.from('dairy_sales_records').select('*')),
});

// Additional hooks from the previous implementation
export const useMilkCoolerData = () => useQuery({
    queryKey: ['milk_cooler_data'],
    queryFn: () => fromSupabase(supabase.from('milk_cooler_data').select('*')),
});

export const useMilkCoolerAlerts = () => useQuery({
    queryKey: ['milk_cooler_alerts'],
    queryFn: () => fromSupabase(supabase.from('milk_cooler_alerts').select('*')),
});

export const useProductionData = () => useQuery({
    queryKey: ['production_data'],
    queryFn: () => fromSupabase(supabase.from('production_data').select('*')),
});

export const useRawMaterialsInventory = () => useQuery({
    queryKey: ['raw_materials_inventory'],
    queryFn: () => fromSupabase(supabase.from('raw_materials_inventory').select('*')),
});

export const useColdRoomInventory = () => useQuery({
    queryKey: ['cold_room_inventory'],
    queryFn: () => fromSupabase(supabase.from('cold_room_inventory').select('*')),
});

export const useColdRoomEnvironmentLogs = () => useQuery({
    queryKey: ['cold_room_environment_logs'],
    queryFn: () => fromSupabase(supabase.from('cold_room_environment_logs').select('*')),
});

export const useAnimalProcessingData = () => useQuery({
    queryKey: ['animal_processing_data'],
    queryFn: () => fromSupabase(supabase.from('animal_processing_data').select('*')),
});

export const useProductInventory = () => useQuery({
    queryKey: ['product_inventory'],
    queryFn: () => fromSupabase(supabase.from('product_inventory').select('*')),
});

export const useAddMilkCoolerData = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => fromSupabase(supabase.from('milk_cooler_data').insert([data])),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['milk_cooler_data'] });
        },
    });
};