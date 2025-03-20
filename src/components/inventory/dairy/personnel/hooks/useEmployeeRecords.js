
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';

export const useEmployeeRecords = ({ timeRange, searchTerm, status } = {}) => {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecords = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching employee records with filters:', { timeRange, searchTerm, status });
      
      let query = supabase
        .from('personnel_employee_records')
        .select('*');

      // Apply status filter
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      // Apply time range filter
      if (timeRange && timeRange !== 'all') {
        const now = new Date();
        let startDate = new Date();

        switch (timeRange) {
          case 'hour':
            startDate.setHours(now.getHours() - 1);
            break;
          case 'day':
            startDate.setDate(now.getDate() - 1);
            break;
          case 'week':
            startDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            startDate.setMonth(now.getMonth() - 1);
            break;
          case 'year':
            startDate.setFullYear(now.getFullYear() - 1);
            break;
          default:
            startDate = null;
        }

        if (startDate) {
          query = query.gte('created_at', startDate.toISOString());
        }
      }

      // Apply search term filter
      if (searchTerm) {
        query = query.or(
          `employee_id.ilike.%${searchTerm}%,job_title.ilike.%${searchTerm}%,comments.ilike.%${searchTerm}%`
        );
      }

      // Get data ordered by most recent first
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      console.log('Fetched employee records:', data);
      setRecords(data || []);
    } catch (err) {
      console.error('Error fetching employee records:', err);
      setError(err.message || 'Failed to fetch employee records');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch records when filters change
  useEffect(() => {
    fetchRecords();
  }, [timeRange, searchTerm, status]);

  return {
    records,
    isLoading,
    error,
    refreshData: fetchRecords
  };
};
