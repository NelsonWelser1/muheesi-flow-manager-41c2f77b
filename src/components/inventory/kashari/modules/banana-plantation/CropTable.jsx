
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bell, ChevronUp, ChevronDown, MoreHorizontal, Edit, Trash } from "lucide-react";
import { format, isAfter, isBefore, addDays } from "date-fns";

const CropTable = ({ crops, sortConfig, handleSort, handleEditCrop, setCropToDelete, setIsDeleteDialogOpen }) => {
  // Format date for display
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return format(new Date(date), 'dd MMM yyyy');
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => handleSort('plantationArea')} className="cursor-pointer hover:bg-gray-50">
              Plantation Area (acres) {sortConfig.key === 'plantationArea' && (sortConfig.direction === 'ascending' ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />)}
            </TableHead>
            <TableHead onClick={() => handleSort('growthStage')} className="cursor-pointer hover:bg-gray-50">
              Growth Stage {sortConfig.key === 'growthStage' && (sortConfig.direction === 'ascending' ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />)}
            </TableHead>
            <TableHead>Last Fertilization</TableHead>
            <TableHead>Next Fertilization</TableHead>
            <TableHead onClick={() => handleSort('diseaseStatus')} className="cursor-pointer hover:bg-gray-50">
              Disease Status {sortConfig.key === 'diseaseStatus' && (sortConfig.direction === 'ascending' ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />)}
            </TableHead>
            <TableHead onClick={() => handleSort('bunchesHarvested')} className="cursor-pointer hover:bg-gray-50">
              Bunches Harvested {sortConfig.key === 'bunchesHarvested' && (sortConfig.direction === 'ascending' ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />)}
            </TableHead>
            <TableHead>Harvest Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {crops.length > 0 ? (
            crops.map((crop) => (
              <TableRow key={crop.id}>
                <TableCell>{crop.plantationArea}</TableCell>
                <TableCell>{crop.growthStage}</TableCell>
                <TableCell>{formatDate(crop.lastFertilizationDate)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {formatDate(crop.nextFertilizationDate)}
                    {crop.nextFertilizationDate && isAfter(crop.nextFertilizationDate, new Date()) && isBefore(crop.nextFertilizationDate, addDays(new Date(), 3)) && (
                      <Bell className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    crop.diseaseStatus === 'Healthy' ? 'bg-green-100 text-green-800' : 
                    crop.diseaseStatus === 'Infected' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {crop.diseaseStatus}
                  </span>
                </TableCell>
                <TableCell>{crop.bunchesHarvested || 'N/A'}</TableCell>
                <TableCell>{formatDate(crop.harvestDate)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditCrop(crop)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => {
                          setCropToDelete(crop);
                          setIsDeleteDialogOpen(true);
                        }}
                        className="text-red-600"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                No crops found. Add a crop to get started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CropTable;
