
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

export const useCompanyManagement = () => {
  // Fetch company inventory data
  const { data: inventoryData, isLoading: inventoryLoading } = useQuery({
    queryKey: ['companyInventory'],
    queryFn: async () => {
      const tables = [
        'dairy_inventory',
        'yogurt_inventory',
        'cheese_inventory',
        'cold_room_inventory',
        'company_stocks'
      ];
      
      const results = {};
      
      for (const table of tables) {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        results[table] = data || [];
      }
      
      return results;
    }
  });

  // Fetch personnel data
  const { data: personnelData, isLoading: personnelLoading } = useQuery({
    queryKey: ['companyPersonnel'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('personnel')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch approvals data
  const { data: approvalsData, isLoading: approvalsLoading } = useQuery({
    queryKey: ['companyApprovals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('approvals')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    }
  });

  return {
    inventoryData,
    personnelData,
    approvalsData,
    isLoading: inventoryLoading || personnelLoading || approvalsLoading
  };
};
