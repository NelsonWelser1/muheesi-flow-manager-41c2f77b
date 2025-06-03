
import { useState, useMemo } from 'react';

export const useDossierPagination = (dossiers, itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(dossiers.length / itemsPerPage);
  
  const paginatedDossiers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return dossiers.slice(startIndex, endIndex);
  }, [dossiers, currentPage, itemsPerPage]);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  // Reset to page 1 when dossiers change
  useMemo(() => {
    setCurrentPage(1);
  }, [dossiers.length]);

  return {
    currentPage,
    totalPages,
    paginatedDossiers,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    totalItems: dossiers.length,
    itemsPerPage
  };
};
