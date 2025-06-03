
import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";

const SortableTableHeader = ({ onSort, sortColumn, sortDirection }) => {
  const getSortIndicator = (column) => {
    return sortColumn === column ? (sortDirection === 'asc' ? '↑' : '↓') : '';
  };

  return (
    <TableHeader>
      <TableRow className="whitespace-nowrap">
        <TableHead onClick={() => onSort('candidate_name')} className="cursor-pointer whitespace-nowrap min-w-32">
          Candidate Name
          <ArrowUpDown className="ml-2 h-4 w-4 inline" />
          {getSortIndicator('candidate_name')}
        </TableHead>
        <TableHead onClick={() => onSort('job_title')} className="cursor-pointer whitespace-nowrap min-w-32">
          Job Title
          <ArrowUpDown className="ml-2 h-4 w-4 inline" />
          {getSortIndicator('job_title')}
        </TableHead>
        <TableHead onClick={() => onSort('interview_date_time')} className="cursor-pointer whitespace-nowrap min-w-40">
          Interview Date/Time
          <ArrowUpDown className="ml-2 h-4 w-4 inline" />
          {getSortIndicator('interview_date_time')}
        </TableHead>
        <TableHead onClick={() => onSort('hiring_manager_id')} className="cursor-pointer whitespace-nowrap min-w-32">
          Hiring Manager
          <ArrowUpDown className="ml-2 h-4 w-4 inline" />
          {getSortIndicator('hiring_manager_id')}
        </TableHead>
        <TableHead onClick={() => onSort('status')} className="cursor-pointer whitespace-nowrap min-w-24">
          Status
          <ArrowUpDown className="ml-2 h-4 w-4 inline" />
          {getSortIndicator('status')}
        </TableHead>
        <TableHead onClick={() => onSort('created_at')} className="cursor-pointer whitespace-nowrap min-w-40">
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4 inline" />
          {getSortIndicator('created_at')}
        </TableHead>
        <TableHead className="whitespace-nowrap min-w-24">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default SortableTableHeader;
