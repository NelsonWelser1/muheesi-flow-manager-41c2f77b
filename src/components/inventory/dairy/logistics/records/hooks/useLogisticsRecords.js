
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/supabase";

export const useLogisticsRecords = (searchTerm, timeRange, statusFilter, sortConfig) => {
  const [deliveries, setDeliveries] = useState([]);
  const [orders, setOrders] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getTimeRangeFilter = useCallback(() => {
    const now = new Date();
    switch (timeRange) {
      case 'today':
        return now.toISOString().split('T')[0];
      case 'this-week': {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        return weekStart.toISOString().split('T')[0];
      }
      case 'this-month': {
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        return monthStart.toISOString().split('T')[0];
      }
      case 'this-year': {
        const yearStart = new Date(now.getFullYear(), 0, 1);
        return yearStart.toISOString().split('T')[0];
      }
      default:
        return null;
    }
  }, [timeRange]);

  const fetchDeliveries = useCallback(async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from('logistics_delivery_management')
        .select('*');

      // Apply status filter
      if (statusFilter !== 'all') {
        const statusMap = {
          'pending': 'Pending',
          'in-transit': 'In Transit',
          'delivered': 'Delivered',
          'delayed': 'Delayed'
        };
        query = query.eq('status', statusMap[statusFilter]);
      }

      // Apply time range filter
      const timeRangeStart = getTimeRangeFilter();
      if (timeRangeStart) {
        query = query.gte('created_at', timeRangeStart);
      }

      // Apply search
      if (searchTerm) {
        query = query.or(`customer_name.ilike.%${searchTerm}%,delivery_id.ilike.%${searchTerm}%,delivery_location.ilike.%${searchTerm}%`);
      }

      // Apply sorting
      if (sortConfig.key) {
        query = query.order(sortConfig.key, { ascending: sortConfig.direction === 'asc' });
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // If no data, provide samples for development
      if (!data || data.length === 0) {
        setDeliveries([
          {
            id: '1',
            delivery_id: 'DEL-001',
            customer_name: 'Acme Foods',
            pickup_location: 'Warehouse A',
            delivery_location: 'Retail Store 145',
            status: 'In Transit',
            scheduled_delivery_time: new Date().toISOString(),
            comments: 'Frozen goods delivery'
          },
          {
            id: '2',
            delivery_id: 'DEL-002',
            customer_name: 'Organic Farms Co.',
            pickup_location: 'Farm Location',
            delivery_location: 'Distribution Center',
            status: 'Delivered',
            scheduled_delivery_time: new Date().toISOString(),
            comments: 'Fresh milk delivery'
          }
        ]);
      } else {
        setDeliveries(data);
      }
    } catch (err) {
      console.error('Error fetching deliveries:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, timeRange, statusFilter, sortConfig, getTimeRangeFilter]);

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from('logistics_order_entries')
        .select('*');

      // Apply status filter
      if (statusFilter !== 'all') {
        const statusMap = {
          'pending': 'Pending',
          'confirmed': 'Confirmed',
          'in-progress': 'In Progress',
          'cancelled': 'Cancelled'
        };
        query = query.eq('order_status', statusMap[statusFilter]);
      }

      // Apply time range filter
      const timeRangeStart = getTimeRangeFilter();
      if (timeRangeStart) {
        query = query.gte('created_at', timeRangeStart);
      }

      // Apply search
      if (searchTerm) {
        query = query.or(`customer_name.ilike.%${searchTerm}%,order_id.ilike.%${searchTerm}%`);
      }

      // Apply sorting
      if (sortConfig.key) {
        query = query.order(sortConfig.key, { ascending: sortConfig.direction === 'asc' });
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // If no data, provide samples for development
      if (!data || data.length === 0) {
        setOrders([
          {
            id: '1',
            order_id: 'ORD-001',
            customer_name: 'Supermarket Chain Ltd',
            order_date_time: new Date().toISOString(),
            delivery_priority: 'High',
            order_status: 'Pending',
            order_details: JSON.stringify({
              products: [
                { name: 'Fresh Milk', quantity: 200, unit: 'L' },
                { name: 'Yogurt', quantity: 150, unit: 'kg' }
              ]
            })
          },
          {
            id: '2',
            order_id: 'ORD-002',
            customer_name: 'Local Restaurant Group',
            order_date_time: new Date().toISOString(),
            delivery_priority: 'Normal',
            order_status: 'Confirmed',
            order_details: JSON.stringify({
              products: [
                { name: 'Cheese', quantity: 50, unit: 'kg' },
                { name: 'Butter', quantity: 20, unit: 'kg' }
              ]
            })
          }
        ]);
      } else {
        setOrders(data);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, timeRange, statusFilter, sortConfig, getTimeRangeFilter]);

  const fetchPerformance = useCallback(async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from('logistics_delivery_performance')
        .select('*');

      // Apply time range filter
      const timeRangeStart = getTimeRangeFilter();
      if (timeRangeStart) {
        query = query.gte('created_at', timeRangeStart);
      }

      // Apply search
      if (searchTerm) {
        query = query.or(`delivery_id.ilike.%${searchTerm}%,comments.ilike.%${searchTerm}%`);
      }

      // Apply sorting
      if (sortConfig.key) {
        query = query.order(sortConfig.key, { ascending: sortConfig.direction === 'asc' });
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // If no data, provide samples for development
      if (!data || data.length === 0) {
        setPerformance([
          {
            id: '1',
            delivery_id: 'DEL-001',
            performance_rating: 4,
            delivery_time: 45,
            deviation_from_average: -2.5,
            action_required: false
          },
          {
            id: '2',
            delivery_id: 'DEL-002',
            performance_rating: 3,
            delivery_time: 65,
            deviation_from_average: 12.5,
            action_required: true,
            action_details: 'Review delivery route',
            delay_reason: 'Traffic'
          }
        ]);
      } else {
        setPerformance(data);
      }
    } catch (err) {
      console.error('Error fetching performance data:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, timeRange, statusFilter, sortConfig, getTimeRangeFilter]);

  const refetchRecords = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        fetchDeliveries(),
        fetchOrders(),
        fetchPerformance()
      ]);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchDeliveries, fetchOrders, fetchPerformance]);

  useEffect(() => {
    refetchRecords();
  }, [refetchRecords]);

  return {
    deliveries,
    orders,
    performance,
    isLoading,
    error,
    refetchRecords
  };
};

export default useLogisticsRecords;
