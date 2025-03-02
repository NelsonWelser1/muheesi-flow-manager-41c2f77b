
import { useState, useMemo, useEffect } from 'react';
import { useColdRoomInventory } from './useColdRoomInventory';

export const useInventorySummary = () => {
  const { loading, error, getStockLevelsByBatch } = useColdRoomInventory();
  const [stockByBatch, setStockByBatch] = useState({});
  const [stockList, setStockList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  const columns = [
    { header: 'Batch ID', accessorKey: 'batch_id' },
    { header: 'Product Type', accessorKey: 'product_type' },
    { header: 'Product Category', accessorKey: 'product_category' },
    { header: 'Cold Room', accessorKey: 'cold_room_id' },
    { header: 'Received', accessorKey: 'received' },
    { header: 'Issued', accessorKey: 'issued' },
    { header: 'Current', accessorKey: 'current' },
    { header: 'Last Updated', accessorKey: 'lastUpdated' }
  ];

  useEffect(() => {
    const fetchStockLevels = async () => {
      setIsLoading(true);
      try {
        const stockData = await getStockLevelsByBatch();
        setStockByBatch(stockData);
        
        // Convert object to array for easier rendering
        const stockArray = Object.values(stockData).filter(item => item.current > 0);
        setStockList(stockArray);
      } catch (err) {
        console.error('Error in InventorySummary:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStockLevels();
    
    // Set up interval for periodic refresh
    const intervalId = setInterval(fetchStockLevels, 30000); // 30 seconds
    
    return () => clearInterval(intervalId);
  }, [getStockLevelsByBatch]);

  const handleSearch = (term) => {
    setSearchTerm(term.toLowerCase());
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
  };

  const refreshData = () => {
    getStockLevelsByBatch().then(stockData => {
      setStockByBatch(stockData);
      setStockList(Object.values(stockData).filter(item => item.current > 0));
    });
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = [...stockList];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchTerm)
        )
      );
    }

    // Apply date range filter
    if (dateRange.from && dateRange.to) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.lastUpdated);
        return itemDate >= dateRange.from && itemDate <= dateRange.to;
      });
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [stockList, searchTerm, sortConfig, dateRange]);

  return {
    isLoading,
    error,
    filteredAndSortedData,
    columns,
    sortConfig,
    handleSearch,
    handleSort,
    handleDateRangeChange,
    refreshData
  };
};
