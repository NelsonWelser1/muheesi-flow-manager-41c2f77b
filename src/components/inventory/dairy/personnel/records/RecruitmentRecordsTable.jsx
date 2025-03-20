
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Eye, Download, Mail, Phone } from "lucide-react";
import { format } from 'date-fns';

const getStatusColor = (status) => {
  switch (status) {
    case 'Completed':
      return "bg-green-100 text-green-800 border-green-300";
    case 'Scheduled':
      return "bg-blue-100 text-blue-800 border-blue-300";
    case 'In Progress':
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case 'Pending':
      return "bg-orange-100 text-orange-800 border-orange-300";
    case 'Rejected':
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

const RecruitmentRecordsTable = ({ records, isLoading, error }) => {
  const [sortColumn, setSortColumn] = useState('interview_date_time');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'PPp');
    } catch (error) {
      return dateString;
    }
  };

  const sortedRecords = [...(records || [])].sort((a, b) => {
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
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => handleSort('candidate_name')} className="cursor-pointer">
              Candidate Name
              <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
            <TableHead onClick={() => handleSort('job_title')} className="cursor-pointer">
              Job Title
              <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
            <TableHead onClick={() => handleSort('interview_date_time')} className="cursor-pointer">
              Interview Date/Time
              <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
            <TableHead onClick={() => handleSort('hiring_manager_id')} className="cursor-pointer">
              Hiring Manager
              <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
            <TableHead onClick={() => handleSort('status')} className="cursor-pointer">
              Status
              <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
            <TableHead onClick={() => handleSort('created_at')} className="cursor-pointer">
              Created At
              <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRecords.map((record) => (
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
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" title="View">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" title="Download">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" title="Email">
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" title="Call">
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecruitmentRecordsTable;
