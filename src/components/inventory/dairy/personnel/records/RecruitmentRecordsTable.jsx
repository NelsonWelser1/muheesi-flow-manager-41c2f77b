
import React from 'react';
import { 
  Table, 
  TableBody
} from "@/components/ui/table";
import { useRecordsTable } from './hooks/useRecordsTable';
import SortableTableHeader from './components/SortableTableHeader';
import RecordTableRow from './components/RecordTableRow';
import RecordDetailsDialog from './components/RecordDetailsDialog';

const RecruitmentRecordsTable = ({ records, isLoading, error }) => {
  const {
    sortColumn,
    sortDirection,
    handleSort,
    sortedRecords,
    viewDialogOpen,
    setViewDialogOpen,
    selectedRecord,
    handleViewRecord
  } = useRecordsTable(records);

  if (isLoading) {
    return <div className="flex justify-center p-4">Loading recruitment records...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Error loading recruitment records: {error.message}</div>;
  }

  if (!records || records.length === 0) {
    return <div className="text-center p-6 text-gray-500">No recruitment records found</div>;
  }

  return (
    <>
      <div className="border rounded-md overflow-x-auto">
        <Table className="min-w-full">
          <SortableTableHeader 
            onSort={handleSort} 
            sortColumn={sortColumn} 
            sortDirection={sortDirection} 
          />
          <TableBody>
            {sortedRecords.map((record) => (
              <RecordTableRow 
                key={record.id} 
                record={record} 
                onViewRecord={handleViewRecord} 
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <RecordDetailsDialog 
        record={selectedRecord}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />
    </>
  );
};

export default RecruitmentRecordsTable;
