
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const ScholarshipTable = ({ scholarships, isLoading, handleEdit, handleDelete }) => {
  // Format date for display
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return format(new Date(date), 'dd MMM yyyy');
  };

  // Format amount with commas
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US').format(amount);
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading scholarships...</div>;
  }

  if (!scholarships || scholarships.length === 0) {
    return <div className="text-center py-4">No scholarships found. Add a scholarship to get started.</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student Name</TableHead>
            <TableHead>School</TableHead>
            <TableHead>Education Level</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount (UGX)</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scholarships.map((scholarship) => (
            <TableRow key={scholarship.id}>
              <TableCell>{scholarship.student_name}</TableCell>
              <TableCell>{scholarship.school_name}</TableCell>
              <TableCell>{scholarship.education_level}</TableCell>
              <TableCell>{scholarship.scholarship_type}</TableCell>
              <TableCell>{formatAmount(scholarship.scholarship_amount)}</TableCell>
              <TableCell>{formatDate(scholarship.start_date)}</TableCell>
              <TableCell>{formatDate(scholarship.end_date)}</TableCell>
              <TableCell>
                <Badge className={
                  scholarship.status === 'Active' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 
                  scholarship.status === 'Completed' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : 
                  scholarship.status === 'Suspended' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : 
                  'bg-red-100 text-red-800 hover:bg-red-200'
                }>
                  {scholarship.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(scholarship)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(scholarship.id)}
                      className="text-red-600"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ScholarshipTable;
