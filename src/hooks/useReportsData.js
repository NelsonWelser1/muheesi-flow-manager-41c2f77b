
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from '@/components/ui/use-toast';

export const useReportsData = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchReports = async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      // Query the kazo_coffee_reports table
      let query = supabase
        .from('kazo_coffee_reports')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply filters if provided
      if (filters.timeRange && filters.timeRange !== 'all') {
        const timeMap = {
          'hour': 1/24,
          'day': 1,
          'week': 7,
          'month': 30,
          'year': 365
        };
        
        if (timeMap[filters.timeRange]) {
          const startDate = new Date();
          startDate.setDate(startDate.getDate() - timeMap[filters.timeRange]);
          query = query.gte('created_at', startDate.toISOString());
        }
      }
      
      if (filters.reportType && filters.reportType !== 'all') {
        query = query.eq('report_type', filters.reportType);
      }
      
      if (filters.searchTerm) {
        query = query.or(`
          title.ilike.%${filters.searchTerm}%,
          content.ilike.%${filters.searchTerm}%,
          recipient_name.ilike.%${filters.searchTerm}%,
          report_type.ilike.%${filters.searchTerm}%
        `);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setReports(data || []);
      console.log('Fetched reports data:', data);
      return data;
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError(err.message);
      toast({
        title: "Error fetching reports",
        description: err.message,
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchReports();
  }, []);

  return {
    reports,
    loading,
    error,
    fetchReports,
    refresh: () => fetchReports()
  };
};

export default useReportsData;
