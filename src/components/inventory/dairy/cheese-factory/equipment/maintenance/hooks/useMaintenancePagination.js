
import { useState, useEffect, useMemo } from 'react';

export const useMaintenancePagination = (maintenanceData, selectedDate, view) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset to first page when view or date changes
  useEffect(() => {
    setCurrentPage(1);
  }, [view, selectedDate]);

  const filteredMaintenanceData = useMemo(() => {
    if (!maintenanceData) return [];
    
    return maintenanceData.filter(task => {
      if (view === 'calendar') {
        const taskDate = new Date(task.next_maintenance);
        return (
          taskDate.getDate() === selectedDate.getDate() &&
          taskDate.getMonth() === selectedDate.getMonth() &&
          taskDate.getFullYear() === selectedDate.getFullYear()
        );
      }
      return true;
    });
  }, [maintenanceData, view, selectedDate]);

  const totalItems = filteredMaintenanceData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMaintenanceData = filteredMaintenanceData.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return {
    filteredMaintenanceData,
    paginatedMaintenanceData,
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    totalItems,
    handlePageChange
  };
};
