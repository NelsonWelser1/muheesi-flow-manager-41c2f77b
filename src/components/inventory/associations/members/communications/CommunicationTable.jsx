
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

const CommunicationTable = ({ 
  messages, 
  loading, 
  onViewDetails, 
  sortConfig, 
  onSort 
}) => {
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'failed':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getSortDirection = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '↑' : '↓';
    }
    return '';
  };

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    onSort({ key, direction });
  };

  return (
    <div className="rounded-md border mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer hover:bg-muted transition-colors"
              onClick={() => handleSort('subject')}
            >
              Subject {getSortDirection('subject')}
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted transition-colors"
              onClick={() => handleSort('type')}
            >
              Type {getSortDirection('type')}
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted transition-colors"
              onClick={() => handleSort('recipients')}
            >
              Recipients {getSortDirection('recipients')}
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted transition-colors"
              onClick={() => handleSort('status')}
            >
              Status {getSortDirection('status')}
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted transition-colors"
              onClick={() => handleSort('sentDate')}
            >
              Sent Date {getSortDirection('sentDate')}
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                Loading messages...
              </TableCell>
            </TableRow>
          ) : messages.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                No messages found matching your search criteria
              </TableCell>
            </TableRow>
          ) : (
            messages.map(message => (
              <TableRow key={message.id}>
                <TableCell className="font-medium">{message.subject || 'No subject'}</TableCell>
                <TableCell>{message.type?.toUpperCase() || 'N/A'}</TableCell>
                <TableCell>{message.recipients || 'N/A'}</TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeColor(message.status)}>
                    {message.status?.charAt(0).toUpperCase() + message.status?.slice(1) || 'Unknown'}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(message.sentDate)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => onViewDetails(message)}>
                      <FileText size={14} className="mr-1" />
                      Details
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CommunicationTable;
