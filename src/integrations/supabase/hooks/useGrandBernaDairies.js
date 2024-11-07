import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

export const useFactoryOperations = () => useQuery({
    queryKey: ['factory_operations'],
    queryFn: () => fromSupabase(supabase.from('factory_operations').select('*')),
});

export const useColdRoomManagement = () => useQuery({
    queryKey: ['cold_room_management'],
    queryFn: () => fromSupabase(supabase.from('cold_room_management').select('*')),
});

export const useDairySalesRecords = () => useQuery({
    queryKey: ['dairy_sales_records'],
    queryFn: () => fromSupabase(supabase.from('dairy_sales_records').select('*')),
});