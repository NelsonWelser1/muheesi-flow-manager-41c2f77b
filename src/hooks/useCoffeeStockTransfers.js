
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from '@/components/ui/use-toast';

export const useCoffeeStockTransfers = () => {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchTransfers = async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      // Query the coffee_stock_transfers table
      let query = supabase
        .from('coffee_stock_transfers')
        .select('*')
        .order('created_at', { ascending: false });
        
      // Apply time range filter if provided
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
      
      // Apply status filter if provided
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      
      // Apply partner transfer filter if provided
      if (filters.isPartnerTransfer !== undefined) {
        query = query.eq('is_partner_transfer', filters.isPartnerTransfer);
      }
      
      // Apply location filter if provided
      if (filters.location) {
        query = query.or(`source_location.ilike.%${filters.location}%,destination_location.ilike.%${filters.location}%`);
      }
      
      // Apply search filter if provided - using proper OR filter syntax
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.trim();
        if (searchTerm) {
          query = query.or(`coffee_type.ilike.%${searchTerm}%,quality_grade.ilike.%${searchTerm}%,source_location.ilike.%${searchTerm}%,destination_location.ilike.%${searchTerm}%,manager.ilike.%${searchTerm}%`);
        }
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      // Ensure we don't have any undefined or null items
      const validData = (data || []).filter(item => item !== null && item !== undefined);
      
      // Add default properties to prevent "x is undefined" errors
      const processedData = validData.map(item => ({
        id: item.id || `transfer-${Math.random().toString(36).substring(2, 9)}`,
        name: item.name || `${item.coffee_type || 'Coffee'} Transfer`,
        coffee_type: item.coffee_type || 'Unknown Type',
        quality_grade: item.quality_grade || 'N/A',
        source_location: item.source_location || 'Unknown Source',
        destination_location: item.destination_location || 'Unknown Destination',
        quantity: item.quantity || 0,
        status: item.status || 'pending',
        manager: item.manager || 'N/A',
        is_partner_transfer: !!item.is_partner_transfer,
        created_at: item.created_at || new Date().toISOString(),
        updated_at: item.updated_at || item.created_at || new Date().toISOString(),
        ...item  // Keep all original properties
      }));
      
      setTransfers(processedData);
      console.log('Fetched coffee transfers data:', processedData);
      return processedData;
    } catch (err) {
      console.error('Error fetching transfers:', err);
      setError(err);
      toast({
        title: "Error fetching transfers",
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
    fetchTransfers();
  }, []);

  return {
    transfers,
    loading,
    error,
    fetchTransfers
  };
};

export default useCoffeeStockTransfers;
