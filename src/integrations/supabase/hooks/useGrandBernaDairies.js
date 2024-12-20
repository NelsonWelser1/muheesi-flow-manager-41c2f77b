import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

// Milk Cooler Queries
export const useMilkCoolerData = () => useQuery({
    queryKey: ['milk_cooler_data'],
    queryFn: () => fromSupabase(supabase.from('milk_cooler_data').select('*')),
});

export const useMilkCoolerAlerts = () => useQuery({
    queryKey: ['milk_cooler_alerts'],
    queryFn: () => fromSupabase(supabase.from('milk_cooler_alerts').select('*')),
});

// Factory Queries
export const useProductionData = () => useQuery({
    queryKey: ['production_data'],
    queryFn: () => fromSupabase(supabase.from('production_data').select('*')),
});

export const useRawMaterialsInventory = () => useQuery({
    queryKey: ['raw_materials_inventory'],
    queryFn: () => fromSupabase(supabase.from('raw_materials_inventory').select('*')),
});

// Cold Room Queries
export const useColdRoomInventory = () => useQuery({
    queryKey: ['cold_room_inventory'],
    queryFn: () => fromSupabase(supabase.from('cold_room_inventory').select('*')),
});

export const useColdRoomEnvironmentLogs = () => useQuery({
    queryKey: ['cold_room_environment_logs'],
    queryFn: () => fromSupabase(supabase.from('cold_room_environment_logs').select('*')),
});

// Slaughterhouse Queries
export const useAnimalProcessingData = () => useQuery({
    queryKey: ['animal_processing_data'],
    queryFn: () => fromSupabase(supabase.from('animal_processing_data').select('*')),
});

export const useProductInventory = () => useQuery({
    queryKey: ['product_inventory'],
    queryFn: () => fromSupabase(supabase.from('product_inventory').select('*')),
});

// Mutations
export const useAddMilkCoolerData = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => fromSupabase(supabase.from('milk_cooler_data').insert([data])),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['milk_cooler_data'] });
        },
    });
};

// Add more mutations as needed for other tables