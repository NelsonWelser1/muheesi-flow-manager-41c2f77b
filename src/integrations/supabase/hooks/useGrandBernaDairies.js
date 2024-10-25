import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

export const useFactoryOperations = () => useQuery({
    queryKey: ['factoryOperations'],
    queryFn: () => fromSupabase(supabase.from('factory_operations').select('*')),
});

export const useColdRoomManagement = () => useQuery({
    queryKey: ['coldRoomManagement'],
    queryFn: () => fromSupabase(supabase.from('cold_room_management').select('*')),
});

export const useDairySalesRecords = () => useQuery({
    queryKey: ['dairySalesRecords'],
    queryFn: () => fromSupabase(supabase.from('dairy_sales_records').select('*')),
});

// Mutations for Factory Operations
export const useAddFactoryOperation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newOperation) => 
            fromSupabase(supabase.from('factory_operations').insert([newOperation])),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['factoryOperations'] });
        },
    });
};

// Mutations for Cold Room Management
export const useAddColdRoomRecord = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newRecord) => 
            fromSupabase(supabase.from('cold_room_management').insert([newRecord])),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['coldRoomManagement'] });
        },
    });
};