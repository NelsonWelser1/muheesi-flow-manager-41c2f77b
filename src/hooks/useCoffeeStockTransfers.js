
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from '@/components/ui/use-toast';
import { showSuccessToast, showErrorToast, showWarningToast, showInfoToast } from "@/components/ui/notifications";

/**
 * Hook for managing coffee stock transfers
 */
export const useCoffeeStockTransfers = () => {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ field: 'created_at', ascending: false });
  const { toast } = useToast();

  // Fetch transfers with optional filters
  const fetchTransfers = async () => {
    setLoading(true);
    setError(null);

    try {
      // Start building the query
      let query = supabase
        .from('coffee_stock_transfers')
        .select('*');

      // Apply status filter if not 'all'
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      // Apply time range filter
      if (timeRange !== 'all') {
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
            break;
        }

        query = query.gte('created_at', startDate.toISOString());
        query = query.lte('created_at', now.toISOString());
      }

      // Apply sorting
      query = query.order(sortConfig.field, { ascending: sortConfig.ascending });

      // Execute the query
      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // Apply search filter client-side
      let filteredData = data;
      if (searchTerm) {
        const lowercaseSearch = searchTerm.toLowerCase();
        filteredData = data.filter(item => 
          item.manager?.toLowerCase().includes(lowercaseSearch) ||
          item.source_location?.toLowerCase().includes(lowercaseSearch) ||
          item.destination_location?.toLowerCase().includes(lowercaseSearch) ||
          item.coffee_type?.toLowerCase().includes(lowercaseSearch) ||
          item.quality_grade?.toLowerCase().includes(lowercaseSearch) ||
          item.reason?.toLowerCase().includes(lowercaseSearch) ||
          item.status?.toLowerCase().includes(lowercaseSearch)
        );
      }

      setTransfers(filteredData);
    } catch (err) {
      console.error('Error fetching transfers:', err);
      setError(err.message);
      showErrorToast(toast, `Failed to load transfers: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Submit a new stock transfer
  const submitTransfer = async (transferData) => {
    try {
      const { data, error } = await supabase
        .from('coffee_stock_transfers')
        .insert([{
          ...transferData,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();

      if (error) {
        throw error;
      }

      showSuccessToast(toast, 'Stock transfer submitted successfully');
      
      // In a real app, here we would trigger a notification to the recipient
      showInfoToast(toast, `Notification sent to recipient at ${transferData.destination_location}`);
      
      return data[0];
    } catch (err) {
      console.error('Error submitting transfer:', err);
      showErrorToast(toast, `Failed to submit transfer: ${err.message}`);
      throw err;
    }
  };

  // Handle transfer response (accept or decline)
  const respondToTransfer = async (transferId, action, userId, notes = '') => {
    try {
      const now = new Date().toISOString();
      const updates = {
        status: action === 'accept' ? 'received' : 'declined',
        updated_at: now,
        notes
      };
      
      // Set the appropriate timestamp field
      if (action === 'accept') {
        updates.received_at = now;
      } else {
        updates.declined_at = now;
      }
      
      const { data, error } = await supabase
        .from('coffee_stock_transfers')
        .update(updates)
        .eq('id', transferId)
        .select();

      if (error) {
        throw error;
      }

      // If accepted, we would also update inventory volumes here in a real implementation
      if (action === 'accept') {
        showSuccessToast(toast, 'Transfer accepted successfully');
        
        // In a real app, here we would trigger a notification back to the sender
        showInfoToast(toast, 'Notification sent to sender that transfer was accepted');
        
        // In a real app, we would also update the inventory volumes here
        // The code would subtract from source location and add to destination location
      } else {
        showWarningToast(toast, 'Transfer declined');
        
        // In a real app, here we would trigger a notification back to the sender
        showInfoToast(toast, 'Notification sent to sender that transfer was declined');
      }
      
      return data[0];
    } catch (err) {
      console.error('Error responding to transfer:', err);
      showErrorToast(toast, `Failed to process response: ${err.message}`);
      throw err;
    }
  };

  // Handle filter and sort changes
  const handleStatusChange = (status) => {
    setStatusFilter(status);
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleSort = (field) => {
    setSortConfig(prevConfig => ({
      field,
      ascending: prevConfig.field === field ? !prevConfig.ascending : true
    }));
  };

  // Fetch transfers when filters or sort change
  useEffect(() => {
    fetchTransfers();
  }, [statusFilter, timeRange, sortConfig.field, sortConfig.ascending]);

  return {
    transfers,
    loading,
    error,
    statusFilter,
    timeRange,
    searchTerm,
    sortConfig,
    handleStatusChange,
    handleTimeRangeChange,
    handleSearch,
    handleSort,
    handleRefresh: fetchTransfers,
    submitTransfer,
    respondToTransfer
  };
};
