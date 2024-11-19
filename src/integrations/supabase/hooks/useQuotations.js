import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

export const useQuotation = (id) => useQuery({
    queryKey: ['quotation', id],
    queryFn: () => fromSupabase(supabase.from('quotations').select('*').eq('id', id).single()),
    enabled: !!id,
});

export const useQuotations = (filters = {}) => {
    let query = supabase.from('quotations').select('*');
    
    if (filters.dateRange) {
        query = query
            .gte('created_at', filters.dateRange.start)
            .lte('created_at', filters.dateRange.end);
    }
    if (filters.destination) {
        query = query.eq('destination', filters.destination);
    }
    if (filters.incoterm) {
        query = query.eq('incoterm', filters.incoterm);
    }

    return useQuery({
        queryKey: ['quotations', filters],
        queryFn: () => fromSupabase(query.order('created_at', { ascending: false })),
    });
};

export const useAddQuotation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newQuotation) => fromSupabase(
            supabase.from('quotations').insert([{
                ...newQuotation,
                created_at: new Date().toISOString(),
            }])
        ),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['quotations'] });
        },
    });
};

export const useUpdateQuotation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => 
            fromSupabase(supabase.from('quotations').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['quotations'] });
        },
    });
};

export const useDeleteQuotation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('quotations').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['quotations'] });
        },
    });
};