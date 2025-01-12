import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

export const useCompanyStocks = (company) => {
  return useQuery({
    queryKey: ['companyStocks', company],
    queryFn: async () => {
      console.log('Fetching stocks for company:', company);
      const { data, error } = await supabase
        .from('company_stocks')
        .select('*')
        .eq('company', company);

      if (error) {
        console.error('Error fetching company stocks:', error);
        throw error;
      }

      console.log('Fetched stocks:', data);
      return data;
    },
    enabled: !!company,
  });
};