
import { useState } from 'react';
import { useRecruitmentRecords } from '../../hooks/useRecruitmentRecords';

export const useRecruitmentFilters = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('all');
  
  const { 
    records, 
    isLoading, 
    error, 
    refreshData 
  } = useRecruitmentRecords({ timeRange, searchTerm, status });

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
  };

  return {
    timeRange,
    searchTerm,
    status,
    records,
    isLoading,
    error,
    refreshData,
    handleTimeRangeChange,
    handleSearch,
    handleStatusChange
  };
};
