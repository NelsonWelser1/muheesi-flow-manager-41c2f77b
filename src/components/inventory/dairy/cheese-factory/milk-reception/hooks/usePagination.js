
import { useState, useMemo } from 'react';

export const usePagination = (data, pageSize = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(data.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedItems = data.slice(startIndex, startIndex + pageSize);

    return {
      totalPages,
      startIndex,
      paginatedItems,
      currentPage,
      pageSize,
      totalItems: data.length
    };
  }, [data, currentPage, pageSize]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const resetPage = () => {
    setCurrentPage(1);
  };

  return {
    ...paginationData,
    handlePageChange,
    resetPage
  };
};
