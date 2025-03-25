
import React from 'react';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, Download, Eye, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const RequisitionRecordsTable = ({ records, sortConfig, onSort, isLoading, error }) => {
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? (
      <ArrowUp className="h-4 w-4 ml-1" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-1" />
    );
  };

  const renderSortableHeader = (key, label) => (
    <TableHead className="cursor-pointer" onClick={() => onSort(key)}>
      <div className="flex items-center">
        {label}
        {getSortIcon(key)}
      </div>
    </TableHead>
  );

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Completed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">{status || 'Unknown'}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading requisition records...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 border rounded-md bg-red-50 text-red-800">
        <p className="font-medium">Error loading requisition records</p>
        <p className="text-sm">{error.toString()}</p>
      </div>
    );
  }

  if (!records || records.length === 0) {
    return (
      <div className="text-center p-8 border rounded-md bg-gray-50">
        <p className="text-gray-500">No requisition records found.</p>
        <p className="text-sm text-gray-400">Try changing your filters or add a new requisition.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            {renderSortableHeader('requester', 'Requester')}
            {renderSortableHeader('department', 'Department')}
            {renderSortableHeader('requisition_type', 'Type')}
            {renderSortableHeader('urgency', 'Urgency')}
            {renderSortableHeader('status', 'Status')}
            {renderSortableHeader('created_at', 'Date')}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{record.requester_name}</TableCell>
              <TableCell>{record.department}</TableCell>
              <TableCell>{record.requisition_type}</TableCell>
              <TableCell>
                <Badge
                  className={`${
                    record.urgency === 'high'
                      ? 'bg-red-100 text-red-800'
                      : record.urgency === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {record.urgency?.charAt(0).toUpperCase() + record.urgency?.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>{getStatusBadge(record.status)}</TableCell>
              <TableCell>
                {record.created_at ? format(new Date(record.created_at), 'PPP') : 'N/A'}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="icon" title="View Details">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" title="Download">
                    <Download className="h-4 w-4" />
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

export default RequisitionRecordsTable;
