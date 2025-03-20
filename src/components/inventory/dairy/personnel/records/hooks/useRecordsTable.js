
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";

export const useRecordsTable = (initialRecords) => {
  const [sortColumn, setSortColumn] = useState('interview_date_time');
  const [sortDirection, setSortDirection] = useState('desc');
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const { toast } = useToast();

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleViewRecord = (record) => {
    setSelectedRecord(record);
    setViewDialogOpen(true);
    
    toast({
      title: "Record Details",
      description: `Viewing details for ${record.candidate_name}`,
    });
  };

  const sortedRecords = [...(initialRecords || [])].sort((a, b) => {
    let valueA = a[sortColumn];
    let valueB = b[sortColumn];

    if (sortColumn === 'interview_date_time') {
      valueA = new Date(valueA || 0).getTime();
      valueB = new Date(valueB || 0).getTime();
    }

    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return {
    sortColumn,
    sortDirection,
    handleSort,
    sortedRecords,
    viewDialogOpen,
    setViewDialogOpen,
    selectedRecord,
    handleViewRecord
  };
};
