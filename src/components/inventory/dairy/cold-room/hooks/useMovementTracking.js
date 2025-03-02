
import { useState, useEffect, useMemo } from 'react';
import { useColdRoomInventory } from './useColdRoomInventory';

export const useMovementTracking = () => {
  const { inventoryItems, loading, error, fetchInventory } = useColdRoomInventory();
  const [filteredItems, setFilteredItems] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'in', 'out'
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredItems(inventoryItems);
    } else {
      setFilteredItems(
        inventoryItems.filter(item => 
          item.movement_action.toLowerCase() === filter
        )
      );
    }
  }, [inventoryItems, filter]);

  const columns = [
    { header: 'Date & Time', accessorKey: 'storage_date_time' },
    { header: 'Action', accessorKey: 'movement_action' },
    { header: 'Product', accessorKey: 'product_type' },
    { header: 'Batch ID', accessorKey: 'batch_id' },
    { header: 'Cold Room', accessorKey: 'cold_room_id' },
    { header: 'Quantity', accessorKey: 'unit_quantity' },
    { header: 'Operator', accessorKey: 'operator_id' }
  ];

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

  const filteredAndSortedData = useMemo(() => {
    let filtered = [...filteredItems];

    if (searchTerm) {
      filtered = filtered.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchTerm)
        )
      );
    }

    if (dateRange.from && dateRange.to) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.storage_date_time);
        return itemDate >= dateRange.from && itemDate <= dateRange.to;
      });
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [filteredItems, searchTerm, sortConfig, dateRange]);

  return {
    loading,
    error,
    filter,
    setFilter,
    filteredAndSortedData,
    columns,
    sortConfig,
    handleSearch,
    handleSort,
    handleDateRangeChange,
    fetchInventory
  };
};
