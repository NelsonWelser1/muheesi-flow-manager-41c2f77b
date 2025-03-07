import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

export const useSystemUsers = () => useQuery({
    queryKey: ['systemUsers'],
    queryFn: () => fromSupabase(supabase.from('system_users').select('*')),
});

export const useAddSystemUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newUser) => fromSupabase(supabase.from('system_users').insert([newUser])),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['systemUsers'] });
        },
    });
};

export const useUpdateSystemUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => 
            fromSupabase(supabase.from('system_users').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['systemUsers'] });
        },
    });
};