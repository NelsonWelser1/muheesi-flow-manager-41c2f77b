
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';

export const useCoffeeStockRecords = ({ 
  statusFilter = 'all', 
  timeRange = 'all', 
  searchTerm = '' 
} = {}) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecords = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching coffee stock with filters:', { statusFilter, timeRange, searchTerm });
      
      let query = supabase
        .from('coffee_stock')
        .select('*');

      // Apply status filter
      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
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

      // Apply search term filter if provided
      if (searchTerm) {
        query = query.or(
          `manager.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%,coffee_type.ilike.%${searchTerm}%,quality_grade.ilike.%${searchTerm}%,source.ilike.%${searchTerm}%,notes.ilike.%${searchTerm}%`
        );
      }

      // Get data ordered by most recent first
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      console.log('Fetched coffee stock records:', data);
      
      // Transform the data to match the expected format in the UI
      const formattedData = data.map(item => ({
        id: item.id,
        manager: item.manager,
        location: item.location,
        coffeeType: item.coffee_type,
        qualityGrade: item.quality_grade,
        source: item.source,
        humidity: item.humidity,
        buying_price: item.buying_price,
        currency: item.currency,
        quantity: item.quantity,
        unit: item.unit,
        notes: item.notes,
        status: item.status,
        created_at: item.created_at
      }));
      
      setRecords(formattedData || []);
      return formattedData;
    } catch (err) {
      console.error('Error fetching coffee stock records:', err);
      setError(err.message || 'Failed to fetch coffee stock records');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch records when filters change
  useEffect(() => {
    fetchRecords();
  }, [statusFilter, timeRange, searchTerm]);

  return {
    records,
    loading,
    error,
    refreshData: fetchRecords
  };
};
