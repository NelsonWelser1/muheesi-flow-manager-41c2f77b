
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, ArrowUp, ArrowDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const CommunicationTable = ({ messages, loading, onViewDetails, sortConfig, onSort }) => {
  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    onSort({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8">Loading messages...</div>;
  }

  if (!messages || messages.length === 0) {
    return <div className="flex justify-center py-8">No messages found</div>;
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('subject')}
            >
              <div className="flex items-center">
                Subject {getSortIcon('subject')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('type')}
            >
              <div className="flex items-center">
                Type {getSortIcon('type')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('recipients')}
            >
              <div className="flex items-center">
                Recipients {getSortIcon('recipients')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('status')}
            >
              <div className="flex items-center">
                Status {getSortIcon('status')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('sentDate')}
            >
              <div className="flex items-center">
                Sent Date {getSortIcon('sentDate')}
              </div>
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.map((message) => (
            <TableRow key={message.id}>
              <TableCell className="font-medium">{message.subject || 'No subject'}</TableCell>
              <TableCell>{message.type?.toUpperCase() || 'N/A'}</TableCell>
              <TableCell>{message.recipients || 'N/A'}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(message.status)}>
                  {message.status?.charAt(0).toUpperCase() + message.status?.slice(1) || 'Unknown'}
                </Badge>
              </TableCell>
              <TableCell>
                {message.sentDate 
                  ? new Date(message.sentDate).toLocaleDateString() 
                  : message.status === 'scheduled' ? 'Scheduled' : 'N/A'
                }
              </TableCell>
              <TableCell>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onViewDetails(message)}
                  className="flex items-center gap-1"
                >
                  <Eye className="h-4 w-4" /> View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CommunicationTable;
