
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from '@/components/ui/use-toast';

export const useCoffeeStockTransfers = () => {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    field: 'created_at',
    ascending: false
  });
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
      
      // Apply operation type filter if provided
      if (filters.operationType) {
        // For relocate-stock, filter out is_partner_transfer = true entries
        if (filters.operationType === 'relocate-stock') {
          query = query.eq('is_partner_transfer', false);
        }
        // For partner-stock, ensure is_partner_transfer = true
        else if (filters.operationType === 'partner-stock') {
          query = query.eq('is_partner_transfer', true);
        }
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
        // Add operation type for better filtering
        operation_type: item.is_partner_transfer ? 'partner-stock' : 'relocate-stock',
        ...item  // Keep all original properties
      }));
      
      setTransfers(processedData);
      console.log('Fetched coffee transfers data:', processedData);
      return processedData;
    } catch (err) {
      console.error('Error fetching transfers:', err);
      setError(err.message || "Failed to fetch transfers");
      toast({
        title: "Error fetching transfers",
        description: err.message || "Failed to fetch transfers",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Handle status filter change
  const handleStatusChange = (status) => {
    setStatusFilter(status);
    fetchTransfers({ 
      status, 
      timeRange, 
      searchTerm, 
      sortConfig 
    });
  };

  // Handle time range filter change
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    fetchTransfers({ 
      status: statusFilter, 
      timeRange: range, 
      searchTerm, 
      sortConfig 
    });
  };

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
    fetchTransfers({ 
      status: statusFilter, 
      timeRange, 
      searchTerm: term, 
      sortConfig 
    });
  };

  // Handle sorting
  const handleSort = (field) => {
    const isAsc = sortConfig.field === field && !sortConfig.ascending;
    setSortConfig({ field, ascending: isAsc });
    
    // Sort transfers locally without refetching
    const sortedTransfers = [...transfers].sort((a, b) => {
      if (a[field] < b[field]) return isAsc ? -1 : 1;
      if (a[field] > b[field]) return isAsc ? 1 : -1;
      return 0;
    });
    
    setTransfers(sortedTransfers);
  };

  // Submit a new transfer
  const submitTransfer = async (transferData) => {
    try {
      // Set is_partner_transfer based on transferData
      const isPartnerTransfer = transferData.hasOwnProperty('is_partner_transfer') 
        ? transferData.is_partner_transfer 
        : false;
        
      const { data, error } = await supabase
        .from('coffee_stock_transfers')
        .insert([{
          ...transferData,
          is_partner_transfer: isPartnerTransfer,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Transfer created",
        description: "Stock transfer request submitted successfully",
      });
      
      return data;
    } catch (err) {
      console.error('Error creating transfer:', err);
      toast({
        title: "Error creating transfer",
        description: err.message,
        variant: "destructive"
      });
      throw err;
    }
  };

  // Update a transfer status
  const updateTransferStatus = async (id, status, notes = '') => {
    try {
      const { data, error } = await supabase
        .from('coffee_stock_transfers')
        .update({ 
          status, 
          notes: notes,
          updated_at: new Date().toISOString() 
        })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      toast({
        title: `Transfer ${status}`,
        description: `Stock transfer request has been ${status}`,
      });
      
      // Update local state
      setTransfers(prevTransfers => 
        prevTransfers.map(transfer => 
          transfer.id === id 
            ? { ...transfer, status, notes, updated_at: new Date().toISOString() } 
            : transfer
        )
      );
      
      return data;
    } catch (err) {
      console.error('Error updating transfer status:', err);
      toast({
        title: "Error updating transfer",
        description: err.message,
        variant: "destructive"
      });
      throw err;
    }
  };

  // Manual refresh function
  const handleRefresh = () => {
    return fetchTransfers({ 
      status: statusFilter, 
      timeRange, 
      searchTerm, 
      sortConfig 
    });
  };

  // Initial fetch on mount
  useEffect(() => {
    handleRefresh();
  }, []);

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
    handleRefresh,
    fetchTransfers,
    submitTransfer,
    updateTransferStatus
  };
};

export default useCoffeeStockTransfers;
