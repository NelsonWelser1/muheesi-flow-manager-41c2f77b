
import { useState, useEffect, useMemo } from 'react';
import { addDays, startOfDay, endOfDay, subDays, subMonths, subYears, isWithinInterval } from 'date-fns';

export const useRecordsFilter = (records = []) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  
  // Filter records based on search term, status, and time range
  const filteredRecords = useMemo(() => {
    let filtered = [...records];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(record => 
        record.payment_number?.toLowerCase().includes(term) ||
        record.party_name?.toLowerCase().includes(term) ||
        record.payment_method?.toLowerCase().includes(term) ||
        String(record.amount).includes(term)
      );
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(record => record.status === statusFilter);
    }
    
    // Filter by time range
    if (timeRange !== 'all') {
      const now = new Date();
      let startDate;
      
      switch (timeRange) {
        case 'today':
          startDate = startOfDay(now);
          break;
        case 'this-week':
          startDate = subDays(now, 7);
          break;
        case 'this-month':
          startDate = subMonths(now, 1);
          break;
        case 'this-year':
          startDate = subYears(now, 1);
          break;
        default:
          startDate = null;
      }
      
      if (startDate) {
        filtered = filtered.filter(record => {
          const recordDate = new Date(record.payment_date);
          return isWithinInterval(recordDate, { start: startDate, end: now });
        });
      }
    }
    
    // Sort records
    filtered.sort((a, b) => {
      const dateA = new Date(a.payment_date);
      const dateB = new Date(b.payment_date);
      
      switch (sortBy) {
        case 'date-asc':
          return dateA - dateB;
        case 'date-desc':
          return dateB - dateA;
        case 'amount-asc':
          return a.amount - b.amount;
        case 'amount-desc':
          return b.amount - a.amount;
        default:
          return dateB - dateA;
      }
    });
    
    return filtered;
  }, [records, searchTerm, statusFilter, timeRange, sortBy]);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    timeRange,
    setTimeRange,
    sortBy,
    setSortBy,
    filteredRecords
  };
};
