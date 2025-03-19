
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/supabase";
import { useQuery } from '@tanstack/react-query';

export const useLogisticsRecords = (searchTerm, timeRange, statusFilter, sortConfig) => {
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filteredPerformance, setFilteredPerformance] = useState([]);

  // Fetch data from Supabase
  const fetchDeliveries = async () => {
    const { data, error } = await supabase
      .from('logistics_delivery_management')
      .select('*');
    
    if (error) throw error;
    return data || [];
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('logistics_order_entries')
      .select('*');
    
    if (error) throw error;
    return data || [];
  };

  const fetchPerformance = async () => {
    const { data, error } = await supabase
      .from('logistics_delivery_performance')
      .select('*');
    
    if (error) throw error;
    return data || [];
  };

  // Use React Query for data fetching
  const deliveriesQuery = useQuery({
    queryKey: ['logistics-deliveries'],
    queryFn: fetchDeliveries
  });

  const ordersQuery = useQuery({
    queryKey: ['logistics-orders'],
    queryFn: fetchOrders
  });

  const performanceQuery = useQuery({
    queryKey: ['logistics-performance'],
    queryFn: fetchPerformance
  });

  // Refetch all data
  const refetchRecords = async () => {
    await Promise.all([
      deliveriesQuery.refetch(),
      ordersQuery.refetch(),
      performanceQuery.refetch()
    ]);
  };

  // Get time range date filter
  const getTimeRangeDate = () => {
    const now = new Date();
    switch (timeRange) {
      case "hour":
        return new Date(now.setHours(now.getHours() - 1));
      case "day":
        return new Date(now.setDate(now.getDate() - 1));
      case "week":
        return new Date(now.setDate(now.getDate() - 7));
      case "month":
        return new Date(now.setMonth(now.getMonth() - 1));
      case "year":
        return new Date(now.setFullYear(now.getFullYear() - 1));
      default:
        return null;
    }
  };

  // Apply filters and sorting to deliveries
  useEffect(() => {
    if (deliveriesQuery.data) {
      let filtered = [...deliveriesQuery.data];
      
      // Status filter
      if (statusFilter !== 'all') {
        filtered = filtered.filter(delivery => delivery.status === statusFilter);
      }
      
      // Time range filter
      if (timeRange !== 'all') {
        const timeRangeDate = getTimeRangeDate();
        filtered = filtered.filter(delivery => {
          return new Date(delivery.created_at) >= timeRangeDate;
        });
      }
      
      // Search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(delivery => 
          delivery.delivery_id?.toLowerCase().includes(term) ||
          delivery.customer_name?.toLowerCase().includes(term) ||
          delivery.delivery_location?.toLowerCase().includes(term) ||
          delivery.status?.toLowerCase().includes(term)
        );
      }
      
      // Sorting
      if (sortConfig.key) {
        filtered.sort((a, b) => {
          if (sortConfig.key.includes('date') || sortConfig.key.includes('time') || sortConfig.key === 'created_at') {
            const dateA = new Date(a[sortConfig.key] || 0);
            const dateB = new Date(b[sortConfig.key] || 0);
            return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
          }
          
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
          }
          return 0;
        });
      }
      
      setFilteredDeliveries(filtered);
    }
  }, [deliveriesQuery.data, searchTerm, timeRange, statusFilter, sortConfig]);

  // Apply filters and sorting to orders
  useEffect(() => {
    if (ordersQuery.data) {
      let filtered = [...ordersQuery.data];
      
      // Status filter
      if (statusFilter !== 'all') {
        filtered = filtered.filter(order => order.order_status === statusFilter);
      }
      
      // Time range filter
      if (timeRange !== 'all') {
        const timeRangeDate = getTimeRangeDate();
        filtered = filtered.filter(order => {
          return new Date(order.created_at) >= timeRangeDate;
        });
      }
      
      // Search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(order => 
          order.order_id?.toLowerCase().includes(term) ||
          order.customer_name?.toLowerCase().includes(term) ||
          order.order_status?.toLowerCase().includes(term) ||
          order.delivery_priority?.toLowerCase().includes(term)
        );
      }
      
      // Sorting
      if (sortConfig.key) {
        filtered.sort((a, b) => {
          if (sortConfig.key.includes('date') || sortConfig.key.includes('time') || sortConfig.key === 'created_at') {
            const dateA = new Date(a[sortConfig.key] || 0);
            const dateB = new Date(b[sortConfig.key] || 0);
            return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
          }
          
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
          }
          return 0;
        });
      }
      
      setFilteredOrders(filtered);
    }
  }, [ordersQuery.data, searchTerm, timeRange, statusFilter, sortConfig]);

  // Apply filters and sorting to performance
  useEffect(() => {
    if (performanceQuery.data) {
      let filtered = [...performanceQuery.data];
      
      // Time range filter
      if (timeRange !== 'all') {
        const timeRangeDate = getTimeRangeDate();
        filtered = filtered.filter(item => {
          return new Date(item.created_at) >= timeRangeDate;
        });
      }
      
      // Search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(item => 
          item.delivery_id?.toLowerCase().includes(term) ||
          item.comments?.toLowerCase().includes(term) ||
          item.delay_reason?.toLowerCase().includes(term)
        );
      }
      
      // Sorting
      if (sortConfig.key) {
        filtered.sort((a, b) => {
          if (sortConfig.key.includes('date') || sortConfig.key.includes('time') || sortConfig.key === 'created_at') {
            const dateA = new Date(a[sortConfig.key] || 0);
            const dateB = new Date(b[sortConfig.key] || 0);
            return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
          }
          
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
          }
          return 0;
        });
      }
      
      setFilteredPerformance(filtered);
    }
  }, [performanceQuery.data, searchTerm, timeRange, statusFilter, sortConfig]);

  // Combine loading states
  const isLoading = deliveriesQuery.isLoading || ordersQuery.isLoading || performanceQuery.isLoading;

  // Combine error states
  const error = deliveriesQuery.error || ordersQuery.error || performanceQuery.error;

  return {
    deliveries: filteredDeliveries,
    orders: filteredOrders,
    performance: filteredPerformance,
    isLoading,
    error,
    refetchRecords
  };
};

export default useLogisticsRecords;
