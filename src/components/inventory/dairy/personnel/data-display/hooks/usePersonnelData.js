
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/supabase";
import { useToast } from "@/components/ui/use-toast";

/**
 * Custom hook to fetch personnel data from a specified table
 * @param {string} tableName - The name of the table to fetch data from
 * @param {string} searchTerm - Search term to filter records
 * @param {string} timeRange - Time range filter (hour, day, week, month, year, all)
 * @returns {Object} Query result with data, loading state, and refetch function
 */
export const usePersonnelData = (tableName, searchTerm, timeRange) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: [tableName, searchTerm, timeRange],
    queryFn: async () => {
      try {
        let query = supabase.from(tableName).select('*');

        if (searchTerm) {
          // Customize the search fields based on the table
          if (tableName === 'personnel_employee_records') {
            query = query.or(`employee_id.ilike.%${searchTerm}%,job_title.ilike.%${searchTerm}%,comments.ilike.%${searchTerm}%`);
          } else if (tableName === 'personnel_training_evaluations') {
            query = query.or(`employee_id.ilike.%${searchTerm}%,training_module.ilike.%${searchTerm}%,feedback.ilike.%${searchTerm}%`);
          }
        }

        if (timeRange !== 'all') {
          const now = new Date();
          let startDate = new Date();
          
          switch (timeRange) {
            case 'hour':
              startDate.setHours(startDate.getHours() - 1);
              break;
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
        
        // Add a status field based on the record type
        return data.map(record => ({
          ...record,
          status: determineStatus(record, tableName)
        }));
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

// Helper function to determine record status based on the record type
const determineStatus = (record, tableName) => {
  // Logic for employee records
  if (tableName === 'personnel_employee_records') {
    const now = new Date();
    const shiftEnd = record.shift_end ? new Date(record.shift_end) : null;
    
    if (!shiftEnd) return 'pending';
    
    if (shiftEnd < now) {
      return record.performance_rating >= 3 ? 'active' : 'inactive';
    }
    
    return 'active';
  }
  
  // Logic for training records
  if (tableName === 'personnel_training_evaluations') {
    const trainingDate = record.training_date ? new Date(record.training_date) : null;
    const now = new Date();
    
    if (!trainingDate) return 'pending';
    
    // Training completed
    if (trainingDate < now) {
      // Based on performance rating
      if (record.performance_rating >= 4) return 'active';
      if (record.performance_rating <= 2) return 'inactive';
      return 'pending'; // In between ratings
    }
    
    // Future training
    return 'pending';
  }
  
  return 'active'; // Default status
};
