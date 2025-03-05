
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bell, MoreHorizontal, Edit, Trash } from "lucide-react";
import { format, isAfter, isBefore, addDays } from "date-fns";

const CropTable = ({ crops, isLoading, handleEdit, handleDelete }) => {
  // Format date for display
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return format(new Date(date), 'dd MMM yyyy');
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading crop records...</div>;
  }

  if (!crops || crops.length === 0) {
    return <div className="text-center py-4">No crop records found. Add a crop to get started.</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Plantation Area (acres)</TableHead>
            <TableHead>Growth Stage</TableHead>
            <TableHead>Last Fertilization</TableHead>
            <TableHead>Next Fertilization</TableHead>
            <TableHead>Disease Status</TableHead>
            <TableHead>Bunches Harvested</TableHead>
            <TableHead>Harvest Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {crops.map((crop) => (
            <TableRow key={crop.id}>
              <TableCell>{crop.plantation_area}</TableCell>
              <TableCell>{crop.growth_stage}</TableCell>
              <TableCell>{formatDate(crop.last_fertilization_date)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {formatDate(crop.next_fertilization_date)}
                  {crop.next_fertilization_date && isAfter(new Date(crop.next_fertilization_date), new Date()) && isBefore(new Date(crop.next_fertilization_date), addDays(new Date(), 3)) && (
                    <Bell className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  crop.disease_status === 'Healthy' ? 'bg-green-100 text-green-800' : 
                  crop.disease_status === 'Infected' ? 'bg-red-100 text-red-800' : 
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {crop.disease_status}
                </span>
              </TableCell>
              <TableCell>{crop.bunches_harvested || '0'}</TableCell>
              <TableCell>{formatDate(crop.harvest_date)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(crop)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(crop.id)}
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

export default CropTable;
