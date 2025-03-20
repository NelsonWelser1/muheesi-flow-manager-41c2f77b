
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';

export const useRecruitmentRecords = ({ timeRange, searchTerm, status }) => {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getTimeRangeDate = () => {
    const now = new Date();
    switch (timeRange) {
      case 'hour':
        return new Date(now.setHours(now.getHours() - 1));
      case 'day':
        return new Date(now.setDate(now.getDate() - 1));
      case 'week':
        return new Date(now.setDate(now.getDate() - 7));
      case 'month':
        return new Date(now.setMonth(now.getMonth() - 1));
      case 'year':
        return new Date(now.setFullYear(now.getFullYear() - 1));
      default:
        return null;
    }
  };

  const fetchRecords = async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from('personnel_recruitment_records')
        .select('*');

      // Apply status filter
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      // Apply time range filter
      if (timeRange !== 'all') {
        const timeRangeDate = getTimeRangeDate();
        if (timeRangeDate) {
          query = query.gte('created_at', timeRangeDate.toISOString());
        }
      }

      // Execute the query
      const { data, error } = await query;

      if (error) throw error;

      // Apply search filter on the client side
      let filteredData = data;
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filteredData = data.filter(record => 
          record.candidate_name?.toLowerCase().includes(searchLower) ||
          record.job_title?.toLowerCase().includes(searchLower) ||
          record.feedback?.toLowerCase().includes(searchLower) ||
          record.hiring_manager_id?.toLowerCase().includes(searchLower)
        );
      }

      setRecords(filteredData);
    } catch (err) {
      console.error('Error fetching recruitment records:', err);
      setError(err);
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
