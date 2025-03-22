
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { showErrorToast } from '@/components/ui/notifications';
import { fetchCoffeeStock } from '@/utils/coffee/coffeeStockCore';

export const useCoffeeStockRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ field: 'created_at', ascending: false });
  const { toast } = useToast();

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Calculate the timeAgo date if timeRange is specified
      let startDate = null;
      let endDate = new Date(); // Use current date as end date
      
      if (timeRange !== 'all') {
        const now = new Date();
        switch (timeRange) {
          case 'hour':
            startDate = new Date(now.getTime() - 60 * 60 * 1000);
            break;
          case 'day':
            startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            break;
          case 'week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'month':
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case 'year':
            startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            break;
          default:
            startDate = null;
        }
      }

      const data = await fetchCoffeeStock({
        statusFilter: statusFilter !== 'all' ? statusFilter : null,
        startDate,
        endDate,
        sortField: sortConfig.field,
        ascending: sortConfig.ascending
      });

      setRecords(data);
    } catch (err) {
      console.error('Error fetching coffee stock records:', err);
      setError('Failed to load coffee stock records. Please try again later.');
      showErrorToast(toast, 'Failed to load coffee stock records');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, timeRange, sortConfig, toast]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // Filter records based on search term
  const filteredRecords = records.filter(record => {
    if (!searchTerm) return true;
    
    const search = searchTerm.toLowerCase();
    return (
      (record.manager && record.manager.toLowerCase().includes(search)) ||
      (record.location && record.location.toLowerCase().includes(search)) ||
      (record.sourceLocation && record.sourceLocation.toLowerCase().includes(search)) ||
      (record.destinationLocation && record.destinationLocation.toLowerCase().includes(search)) ||
      (record.coffee_type && record.coffee_type.toLowerCase().includes(search)) ||
      (record.quality_grade && record.quality_grade.toLowerCase().includes(search)) ||
      (record.reason && record.reason.toLowerCase().includes(search)) ||
      (record.notes && record.notes.toLowerCase().includes(search))
    );
  });

  const handleSort = (field) => {
    setSortConfig(prevConfig => ({
      field,
      ascending: prevConfig.field === field ? !prevConfig.ascending : true
    }));
  };

  const handleStatusChange = (status) => {
    setStatusFilter(status);
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleRefresh = () => {
    fetchRecords();
  };

  return {
    records: filteredRecords,
    loading,
    error,
    statusFilter,
    timeRange,
    searchTerm,
    sortConfig,
    handleSort,
    handleStatusChange,
    handleTimeRangeChange,
    handleSearch,
    handleRefresh
  };
};
