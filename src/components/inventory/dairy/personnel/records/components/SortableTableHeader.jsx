
import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";

const SortableTableHeader = ({ onSort, sortColumn, sortDirection }) => {
  const getSortIndicator = (column) => {
    return sortColumn === column ? (sortDirection === 'asc' ? '↑' : '↓') : '';
  };

  return (
    <TableHeader>
      <TableRow>
        <TableHead onClick={() => onSort('candidate_name')} className="cursor-pointer">
          Candidate Name
          <ArrowUpDown className="ml-2 h-4 w-4 inline" />
          {getSortIndicator('candidate_name')}
        </TableHead>
        <TableHead onClick={() => onSort('job_title')} className="cursor-pointer">
          Job Title
          <ArrowUpDown className="ml-2 h-4 w-4 inline" />
          {getSortIndicator('job_title')}
        </TableHead>
        <TableHead onClick={() => onSort('interview_date_time')} className="cursor-pointer">
          Interview Date/Time
          <ArrowUpDown className="ml-2 h-4 w-4 inline" />
          {getSortIndicator('interview_date_time')}
        </TableHead>
        <TableHead onClick={() => onSort('hiring_manager_id')} className="cursor-pointer">
          Hiring Manager
          <ArrowUpDown className="ml-2 h-4 w-4 inline" />
          {getSortIndicator('hiring_manager_id')}
        </TableHead>
        <TableHead onClick={() => onSort('status')} className="cursor-pointer">
          Status
          <ArrowUpDown className="ml-2 h-4 w-4 inline" />
          {getSortIndicator('status')}
        </TableHead>
        <TableHead onClick={() => onSort('created_at')} className="cursor-pointer">
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4 inline" />
          {getSortIndicator('created_at')}
        </TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default SortableTableHeader;
