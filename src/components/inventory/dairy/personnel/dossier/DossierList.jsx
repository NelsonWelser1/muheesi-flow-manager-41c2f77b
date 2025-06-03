
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useEmployeeDossiers } from './hooks/useEmployeeDossiers';
import { useDossierPagination } from './hooks/useDossierPagination';
import DossierPagination from './components/DossierPagination';
import DossierHeader from './components/DossierHeader';
import DossierEmptyState from './components/DossierEmptyState';
import DossierListTable from './components/DossierListTable';
import DossierListCards from './components/DossierListCards';

const DossierList = ({ dossiers, viewMode, onView, onUpload, onSchedule }) => {
  const { toast } = useToast();
  const { deleteDossier, isDeleting } = useEmployeeDossiers();
  
  // Sort dossiers by most recent first (created_at descending)
  const sortedDossiers = React.useMemo(() => {
    return [...dossiers].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [dossiers]);

  // Use pagination with 10 items per page
  const {
    currentPage,
    totalPages,
    paginatedDossiers,
    goToPage,
    totalItems,
    itemsPerPage
  } = useDossierPagination(sortedDossiers, 10);

  const handleDelete = (id, employeeId) => {
    deleteDossier(id);
  };

  if (dossiers.length === 0) {
    return <DossierEmptyState dossiers={dossiers} />;
  }

  return (
    <Card>
      <DossierHeader dossiers={dossiers} />
      <CardContent className="p-0">
        <div id="employee-dossiers-table">
          {viewMode === 'list' ? (
            <DossierListTable
              paginatedDossiers={paginatedDossiers}
              onView={onView}
              onUpload={onUpload}
              onSchedule={onSchedule}
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />
          ) : (
            <DossierListCards
              paginatedDossiers={paginatedDossiers}
              onView={onView}
              onUpload={onUpload}
              onSchedule={onSchedule}
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />
          )}
        </div>
        
        <DossierPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
        />
      </CardContent>
    </Card>
  );
};

export default DossierList;
