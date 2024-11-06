import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/*
### Dashboard

| name         | type                     | format    | required |
|--------------|--------------------------|-----------|----------|
| id           | integer                  | bigint    | true     |
| created_at   | timestamp with time zone | timestamp | true     |
| title        | string                  | text      | false    |
| content      | string                  | text      | false    |
| Date & Time  | timestamp with time zone | timestamp | false    |
| Charts       | string                  | text      | false    |

Description: Present Statistics for all Businesses Integrated here
*/

export const useDashboard = (id) => useQuery({
    queryKey: ['dashboard', id],
    queryFn: () => fromSupabase(supabase.from('Dashboard').select('*').eq('id', id).single()),
});

export const useDashboards = () => useQuery({
    queryKey: ['dashboard'],
    queryFn: () => fromSupabase(supabase.from('Dashboard').select('*')),
});

export const useAddDashboard = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newDashboard) => fromSupabase(supabase.from('Dashboard').insert([newDashboard])),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
    });
};

export const useUpdateDashboard = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => 
            fromSupabase(supabase.from('Dashboard').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
    });
};

export const useDeleteDashboard = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('Dashboard').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
    });
};