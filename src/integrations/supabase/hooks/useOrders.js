import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

export const useOrders = (company) => useQuery({
    queryKey: ['orders', company],
    queryFn: () => fromSupabase(
        supabase.from('orders')
            .select('*')
            .eq('company', company)
            .order('created_at', { ascending: false })
    ),
});

export const useAddOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (orderData) => {
            console.log('Creating order:', orderData);
            const { data, error } = await supabase
                .from('orders')
                .insert([{
                    ...orderData,
                    order_number: `PO-${Date.now()}`,
                    created_at: new Date().toISOString(),
                }])
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['orders']);
            console.log('Order created successfully:', data);
        },
    });
};