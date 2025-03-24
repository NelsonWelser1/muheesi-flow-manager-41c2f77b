
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, RefreshCw } from "lucide-react";

const MemberListTable = ({ 
  members, 
  loading, 
  onViewDetails, 
  onRefresh, 
  sortConfig, 
  onSort 
}) => {
  const getMembershipBadgeColor = (level) => {
    switch(level?.toLowerCase()) {
      case 'gold': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'silver': return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
      case 'bronze': return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
      default: return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'inactive': return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'pending': return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
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
    <div className="rounded-md border">
      <div className="p-2 border-b flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          className="flex items-center gap-1"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer hover:bg-muted transition-colors"
              onClick={() => handleSort('id')}
            >
              Member ID {getSortDirection('id')}
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted transition-colors"
              onClick={() => handleSort('full_name')}
            >
              Member Name {getSortDirection('full_name')}
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted transition-colors"
              onClick={() => handleSort('location')}
            >
              Location {getSortDirection('location')}
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted transition-colors"
              onClick={() => handleSort('status')}
            >
              Status {getSortDirection('status')}
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted transition-colors"
              onClick={() => handleSort('member_level')}
            >
              Membership {getSortDirection('member_level')}
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted transition-colors"
              onClick={() => handleSort('farm_size')}
            >
              Farm Size (ha) {getSortDirection('farm_size')}
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted transition-colors"
              onClick={() => handleSort('coffee_type')}
            >
              Coffee Type {getSortDirection('coffee_type')}
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted transition-colors"
              onClick={() => handleSort('last_delivery')}
            >
              Last Delivery {getSortDirection('last_delivery')}
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                Loading members...
              </TableCell>
            </TableRow>
          ) : members.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                No members found matching your search criteria
              </TableCell>
            </TableRow>
          ) : (
            members.map(member => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">{member.id.substring(0, 8)}</TableCell>
                <TableCell>{member.full_name}</TableCell>
                <TableCell>{member.location}</TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeColor(member.status)}>
                    {member.status?.charAt(0).toUpperCase() + member.status?.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getMembershipBadgeColor(member.member_level)}>
                    {member.member_level?.charAt(0).toUpperCase() + member.member_level?.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>{member.farm_size}</TableCell>
                <TableCell>{member.coffee_type}</TableCell>
                <TableCell>{formatDate(member.last_delivery)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => onViewDetails(member)}>
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

export default MemberListTable;
