
import React from 'react';
import { format } from 'date-fns';
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import RecordActionButtons from './RecordActionButtons';
import { getStatusColor } from '../utils/statusUtils';

const RecordTableRow = ({ record, onViewRecord }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'PPp');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <TableRow key={record.id}>
      <TableCell className="font-medium">{record.candidate_name}</TableCell>
      <TableCell>{record.job_title}</TableCell>
      <TableCell>{formatDate(record.interview_date_time)}</TableCell>
      <TableCell>{record.hiring_manager_id}</TableCell>
      <TableCell>
        <Badge className={getStatusColor(record.status)}>
          {record.status}
        </Badge>
      </TableCell>
      <TableCell>{formatDate(record.created_at)}</TableCell>
      <TableCell>
        <RecordActionButtons 
          record={record}
          onViewRecord={onViewRecord}
        />
      </TableCell>
    </TableRow>
  );
};

export default RecordTableRow;
