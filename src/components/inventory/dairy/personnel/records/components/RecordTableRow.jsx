
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
    <TableRow key={record.id} className="whitespace-nowrap">
      <TableCell className="font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-32">{record.candidate_name}</TableCell>
      <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis max-w-32">{record.job_title}</TableCell>
      <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis max-w-40">{formatDate(record.interview_date_time)}</TableCell>
      <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis max-w-32">{record.hiring_manager_id}</TableCell>
      <TableCell className="whitespace-nowrap">
        <Badge className={getStatusColor(record.status)}>
          {record.status}
        </Badge>
      </TableCell>
      <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis max-w-40">{formatDate(record.created_at)}</TableCell>
      <TableCell className="whitespace-nowrap">
        <RecordActionButtons 
          record={record}
          onViewRecord={onViewRecord}
        />
      </TableCell>
    </TableRow>
  );
};

export default RecordTableRow;
