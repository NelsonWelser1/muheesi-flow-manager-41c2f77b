
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from "@/components/ui/use-toast";

export const useOrdersRecords = (searchTerm = '', timeRange = 'all', statusFilter = 'all', sortConfig = { key: 'created_at', direction: 'desc' }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Fetch orders based on filter and sort criteria
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching orders with filters:', { searchTerm, timeRange, statusFilter });
      
      let query = supabase
        .from('logistics_order_entries')
        .select('*');
      
      // Apply status filter
      if (statusFilter !== 'all') {
        query = query.eq('order_status', statusFilter);
      }
      
      // Apply time range filter
      if (timeRange !== 'all') {
        const now = new Date();
        let timeAgo;
        
        switch (timeRange) {
          case 'hour':
            timeAgo = new Date(now.getTime() - 60 * 60 * 1000);
            break;
          case 'day':
            timeAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            break;
          case 'week':
            timeAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'month':
            timeAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case 'year':
            timeAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            break;
          default:
            timeAgo = null;
        }
        
        if (timeAgo) {
          query = query.gte('created_at', timeAgo.toISOString());
        }
      }
      
      // Execute query and sort results later in JavaScript
      const { data, error: apiError } = await query;
      
      if (apiError) {
        console.error('Error fetching orders:', apiError);
        setError(apiError.message);
        toast({
          title: "Error loading orders",
          description: apiError.message,
          variant: "destructive"
        });
        return;
      }
      
      let filteredData = data || [];
      
      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filteredData = filteredData.filter(order => 
          order.order_id?.toLowerCase().includes(searchLower) ||
          order.customer_name?.toLowerCase().includes(searchLower)
        );
      }
      
      console.log('Orders fetched successfully:', filteredData.length);
      setOrders(filteredData);
    } catch (err) {
      console.error('Unexpected error fetching orders:', err);
      setError(err.message);
      toast({
        title: "Unexpected error",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch and refetch on filter/sort changes
  useEffect(() => {
    fetchOrders();
  }, [searchTerm, timeRange, statusFilter]);

  // Sort orders based on sort configuration
  const sortedOrders = useMemo(() => {
    if (!orders.length) return [];
    
    return [...orders].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      
      // Handle date comparisons
      if (typeof aValue === 'string' && (aValue.includes('T') || sortConfig.key.includes('date') || sortConfig.key.includes('time'))) {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      // Handle string comparisons
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      // Handle numeric comparisons
      return sortConfig.direction === 'asc' 
        ? aValue - bValue 
        : bValue - aValue;
    });
  }, [orders, sortConfig]);

  return {
    orders: sortedOrders,
    isLoading,
    error,
    refetchRecords: fetchOrders
  };
};
