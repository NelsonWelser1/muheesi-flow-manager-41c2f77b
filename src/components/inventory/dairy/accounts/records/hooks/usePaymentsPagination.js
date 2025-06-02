
import { useState, useEffect, useMemo } from 'react';

export const usePaymentsPagination = (data, itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  const sortedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    // Sort by payment_date, created_at, or updated_at in descending order (most recent first)
    return [...data].sort((a, b) => {
      const dateA = new Date(a.payment_date || a.paymentDate || a.created_at || a.updated_at);
      const dateB = new Date(b.payment_date || b.paymentDate || b.created_at || b.updated_at);
      return dateB - dateA;
    });
  }, [data]);

  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return {
    paginatedData,
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    totalItems,
    handlePageChange
  };
};
