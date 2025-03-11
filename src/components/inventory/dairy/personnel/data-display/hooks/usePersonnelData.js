
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/supabase";
import { useToast } from "@/components/ui/use-toast";

/**
 * Custom hook to fetch personnel data from a specified table
 * @param {string} tableName - The name of the table to fetch data from
 * @param {string} searchTerm - Search term to filter records
 * @param {string} timeRange - Time range filter (day, week, month, year, all)
 * @returns {Object} Query result with data, loading state
 */
export const usePersonnelData = (tableName, searchTerm, timeRange) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: [tableName, searchTerm, timeRange],
    queryFn: async () => {
      try {
        let query = supabase.from(tableName).select('*');

        if (searchTerm) {
          query = query.or(`name.ilike.%${searchTerm}%,id.ilike.%${searchTerm}%`);
        }

        if (timeRange !== 'all') {
          const now = new Date();
          let startDate = new Date();
          
          switch (timeRange) {
            case 'day':
              startDate.setDate(startDate.getDate() - 1);
              break;
            case 'week':
              startDate.setDate(startDate.getDate() - 7);
              break;
            case 'month':
              startDate.setMonth(startDate.getMonth() - 1);
              break;
            case 'year':
              startDate.setFullYear(startDate.getFullYear() - 1);
              break;
          }
          
          query = query.gte('created_at', startDate.toISOString())
                      .lte('created_at', now.toISOString());
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching personnel data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch personnel data",
          variant: "destructive",
        });
        return [];
      }
    }
  });
};
