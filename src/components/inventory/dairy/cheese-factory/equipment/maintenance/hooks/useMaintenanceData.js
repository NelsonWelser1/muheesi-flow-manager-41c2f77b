
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

export const useMaintenanceData = () => {
  return useQuery({
    queryKey: ['maintenanceSchedule'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('equipment_maintenance')
        .select('*')
        .order('created_at', { ascending: false }); // Sort by most recent first
      
      if (error) {
        console.error('Error fetching maintenance data:', error);
        throw error;
      }
      console.log('Fetched maintenance data:', data);
      return data;
    }
  });
};
