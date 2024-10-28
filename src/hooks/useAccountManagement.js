import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase';

export const useAccountManagement = () => {
  const queryClient = useQueryClient();

  const getAccounts = useQuery({
    queryKey: ['userAccounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_accounts')
        .select('*')
        .order('date_created', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const createAccount = useMutation({
    mutationFn: async (accountData) => {
      const { data, error } = await supabase
        .from('user_accounts')
        .insert([accountData])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userAccounts']);
    }
  });

  const updateAccount = useMutation({
    mutationFn: async ({ id, ...updateData }) => {
      const { data, error } = await supabase
        .from('user_accounts')
        .update(updateData)
        .eq('user_id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userAccounts']);
    }
  });

  const deleteAccount = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('user_accounts')
        .delete()
        .eq('user_id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userAccounts']);
    }
  });

  return {
    accounts: getAccounts.data,
    isLoading: getAccounts.isLoading,
    error: getAccounts.error,
    createAccount,
    updateAccount,
    deleteAccount
  };
};