
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

export const useAddHealthRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data) => {
      const { data: result, error } = await supabase
        .from('cattle_health_records')
        .insert([data])
        .select()
        .single();
        
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthRecords'] });
    },
  });
};

export const useFetchHealthRecords = () => {
  return useQuery({
    queryKey: ['healthRecords'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cattle_health_records')
        .select('*')
        .order('record_date', { ascending: false });
        
      if (error) throw error;
      return data;
    },
  });
};
