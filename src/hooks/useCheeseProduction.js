import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

export const useCheeseProduction = () => {
  console.log('Initializing useCheeseProduction hook');
  
  const fetchProduction = async () => {
    console.log('Fetching cheese production data...');
    const { data, error } = await supabase
      .from('cheese_production')
      .select(`
        *,
        production_line:production_line_id (
          id,
          name,
          status,
          manager
        )
      `)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error in cheese production query:', error);
      throw error;
    }
    
    console.log('Cheese production data:', data);
    return data;
  };

  return useQuery({
    queryKey: ['cheeseProduction'],
    queryFn: fetchProduction,
  });
};

export const useProductionStats = () => {
  console.log('Initializing useProductionStats hook');
  
  const fetchStats = async () => {
    console.log('Fetching production stats...');
    const { data, error } = await supabase
      .from('cheese_production_stats')
      .select('*')
      .order('date', { ascending: false })
      .limit(7);

    if (error) {
      console.error('Error in production stats query:', error);
      throw error;
    }
    
    console.log('Production stats data:', data);
    return data;
  };

  return useQuery({
    queryKey: ['productionStats'],
    queryFn: fetchStats,
  });
};