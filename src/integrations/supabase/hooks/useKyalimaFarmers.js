import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

export const useRiceImports = () => useQuery({
    queryKey: ['riceImports'],
    queryFn: () => fromSupabase(supabase.from('tz2ug_rice_imports').select('*')),
});

export const useCoffeeFarm = () => useQuery({
    queryKey: ['coffeeFarm'],
    queryFn: () => fromSupabase(supabase.from('coffee_farm_kyiboga').select('*')),
});

export const useBullFattening = () => useQuery({
    queryKey: ['bullFattening'],
    queryFn: () => fromSupabase(supabase.from('bull_fattening_program').select('*')),
});

// Mutations
export const useAddRiceImport = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newImport) => fromSupabase(supabase.from('tz2ug_rice_imports').insert([newImport])),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['riceImports'] });
        },
    });
};