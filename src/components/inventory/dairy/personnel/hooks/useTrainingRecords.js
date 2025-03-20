
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { subHours, subDays, subWeeks, subMonths, subYears } from 'date-fns';

export const useTrainingRecords = ({ timeRange = 'week', searchTerm = '', status = 'all' }) => {
  const getTimeRangeDate = () => {
    const now = new Date();
    switch (timeRange) {
      case 'hour': return subHours(now, 1).toISOString();
      case 'day': return subDays(now, 1).toISOString();
      case 'week': return subWeeks(now, 1).toISOString();
      case 'month': return subMonths(now, 1).toISOString();
      case 'year': return subYears(now, 1).toISOString();
      default: return subWeeks(now, 1).toISOString();
    }
  };

  const fetchTrainingRecords = async () => {
    let query = supabase
      .from('personnel_training_evaluations')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Apply time range filter
    if (timeRange !== 'all') {
      const fromDate = getTimeRangeDate();
      query = query.gte('created_at', fromDate);
    }
    
    // Apply status filter
    if (status === 'completed') {
      // Assuming completed means feedback is not null
      query = query.not('feedback', 'is', null);
    } else if (status === 'pending') {
      // Assuming pending means feedback is null
      query = query.is('feedback', null);
    } else if (status === 'low') {
      // Low rating (1-2)
      query = query.lte('performance_rating', 2);
    } else if (status === 'high') {
      // High rating (4-5)
      query = query.gte('performance_rating', 4);
    }
    
    // Apply search filter
    if (searchTerm) {
      query = query.or(
        `employee_id.ilike.%${searchTerm}%,training_module.ilike.%${searchTerm}%,feedback.ilike.%${searchTerm}%`
      );
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  };

  const { 
    data: records = [], 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['trainingRecords', timeRange, searchTerm, status],
    queryFn: fetchTrainingRecords,
  });

  return {
    records,
    isLoading,
    error,
    refreshData: refetch
  };
};
