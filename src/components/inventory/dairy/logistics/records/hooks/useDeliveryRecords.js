
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/supabase";

export const useDeliveryRecords = (searchTerm, timeRange, statusFilter, sortConfig) => {
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);

  // Main query to fetch deliveries
  const { 
    data: deliveries = [], 
    isLoading,
    error,
    refetch: refetchRecords
  } = useQuery({
    queryKey: ['logistics_delivery_records'],
    queryFn: async () => {
      console.log('Fetching delivery records from Supabase...');
      
      const { data, error } = await supabase
        .from('logistics_delivery_management')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching delivery records:', error);
        throw error;
      }
      
      console.log(`Fetched ${data?.length || 0} delivery records`);
      return data || [];
    }
  });

  // Apply filters and sorting
  useEffect(() => {
    if (!deliveries?.length) {
      setFilteredDeliveries([]);
      return;
    }

    let filtered = [...deliveries];

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(delivery => 
        (delivery.delivery_id?.toLowerCase().includes(search)) ||
        (delivery.customer_name?.toLowerCase().includes(search)) ||
        (delivery.pickup_location?.toLowerCase().includes(search)) ||
        (delivery.delivery_location?.toLowerCase().includes(search)) ||
        (delivery.status?.toLowerCase().includes(search))
      );
    }

    // Apply status filter
    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(delivery => 
        delivery.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Apply time range filter
    if (timeRange && timeRange !== 'all') {
      const now = new Date();
      let startDate = new Date();

      switch (timeRange) {
        case 'hour':
          startDate.setHours(now.getHours() - 1);
          break;
        case 'today':
          startDate.setHours(0, 0, 0, 0);
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
          startDate = new Date(0); // All time
      }

      filtered = filtered.filter(delivery => {
        const createdDate = new Date(delivery.created_at);
        return createdDate >= startDate;
      });
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] === null) return 1;
        if (b[sortConfig.key] === null) return -1;
        
        // Handle date sorting
        if (sortConfig.key.includes('time') || sortConfig.key === 'created_at' || sortConfig.key === 'updated_at') {
          const dateA = new Date(a[sortConfig.key]);
          const dateB = new Date(b[sortConfig.key]);
          return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
        }
        
        // Handle string sorting
        if (typeof a[sortConfig.key] === 'string') {
          const valA = a[sortConfig.key].toLowerCase();
          const valB = b[sortConfig.key].toLowerCase();
          return sortConfig.direction === 'asc' 
            ? valA.localeCompare(valB) 
            : valB.localeCompare(valA);
        }
        
        // Handle number sorting
        return sortConfig.direction === 'asc' 
          ? a[sortConfig.key] - b[sortConfig.key] 
          : b[sortConfig.key] - a[sortConfig.key];
      });
    }

    setFilteredDeliveries(filtered);
  }, [deliveries, searchTerm, statusFilter, timeRange, sortConfig]);

  return {
    deliveries: filteredDeliveries,
    isLoading,
    error,
    refetchRecords
  };
};
