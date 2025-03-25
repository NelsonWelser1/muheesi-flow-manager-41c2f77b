
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { ArrowUp, ArrowDown, Loader2 } from 'lucide-react';

const RequisitionRecordsTable = ({ records, loading, error }) => {
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedRecords = [...records].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    // Handle date fields
    if (sortField === 'created_at' || sortField === 'updated_at') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'approved': return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return '';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Loading requisitions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-40 bg-red-50 text-red-700 rounded-md p-4">
        <p>Error loading requisitions: {error}</p>
      </div>
    );
  }

  if (!records || records.length === 0) {
    return (
      <div className="flex justify-center items-center h-40 bg-gray-50 rounded-md">
        <p className="text-gray-500">No requisitions found</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              onClick={() => handleSort('requester_name')}
              className="cursor-pointer hover:bg-gray-100"
            >
              Requester
              {sortField === 'requester_name' && (
                sortDirection === 'asc' ? <ArrowUp className="inline ml-1 h-4 w-4" /> : <ArrowDown className="inline ml-1 h-4 w-4" />
              )}
            </TableHead>
            <TableHead 
              onClick={() => handleSort('department')}
              className="cursor-pointer hover:bg-gray-100"
            >
              Department
              {sortField === 'department' && (
                sortDirection === 'asc' ? <ArrowUp className="inline ml-1 h-4 w-4" /> : <ArrowDown className="inline ml-1 h-4 w-4" />
              )}
            </TableHead>
            <TableHead 
              onClick={() => handleSort('requisition_type')}
              className="cursor-pointer hover:bg-gray-100"
            >
              Type
              {sortField === 'requisition_type' && (
                sortDirection === 'asc' ? <ArrowUp className="inline ml-1 h-4 w-4" /> : <ArrowDown className="inline ml-1 h-4 w-4" />
              )}
            </TableHead>
            <TableHead>Description</TableHead>
            <TableHead 
              onClick={() => handleSort('urgency_level')}
              className="cursor-pointer hover:bg-gray-100"
            >
              Urgency
              {sortField === 'urgency_level' && (
                sortDirection === 'asc' ? <ArrowUp className="inline ml-1 h-4 w-4" /> : <ArrowDown className="inline ml-1 h-4 w-4" />
              )}
            </TableHead>
            <TableHead 
              onClick={() => handleSort('status')}
              className="cursor-pointer hover:bg-gray-100"
            >
              Status
              {sortField === 'status' && (
                sortDirection === 'asc' ? <ArrowUp className="inline ml-1 h-4 w-4" /> : <ArrowDown className="inline ml-1 h-4 w-4" />
              )}
            </TableHead>
            <TableHead 
              onClick={() => handleSort('created_at')}
              className="cursor-pointer hover:bg-gray-100"
            >
              Date Submitted
              {sortField === 'created_at' && (
                sortDirection === 'asc' ? <ArrowUp className="inline ml-1 h-4 w-4" /> : <ArrowDown className="inline ml-1 h-4 w-4" />
              )}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRecords.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="font-medium">{record.requester_name}</TableCell>
              <TableCell>{record.department}</TableCell>
              <TableCell className="capitalize">{record.requisition_type}</TableCell>
              <TableCell>
                {record.requisition_type === 'tools' 
                  ? (record.tools_machinery || '-') 
                  : (record.repairs || '-')}
              </TableCell>
              <TableCell>
                <Badge className={getUrgencyColor(record.urgency_level)}>
                  {record.urgency_level}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(record.status)}>
                  {record.status}
                </Badge>
              </TableCell>
              <TableCell>
                {format(new Date(record.created_at), 'MMM dd, yyyy p')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RequisitionRecordsTable;
