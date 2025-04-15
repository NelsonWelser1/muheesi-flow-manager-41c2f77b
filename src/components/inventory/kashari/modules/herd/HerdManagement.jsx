
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFetchCattle, useAddCattle, useUpdateCattle, useDeleteCattle } from '@/integrations/supabase/hooks/useKashariCattle';
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { format } from 'date-fns';
import AddEditCattleDialog from './AddEditCattleDialog';
import DeleteCattleDialog from './DeleteCattleDialog';
import GrowthPredictionDialog from '../growth/GrowthPredictionDialog';

const HerdManagement = () => {
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCattleId, setSelectedCattleId] = useState(null);
  const [cattleToDelete, setCattleToDelete] = useState(null);
  const [isPredictionDialogOpen, setIsPredictionDialogOpen] = useState(false);

  const { data: cattleData, isLoading, error, refetch } = useFetchCattle();
  const { mutateAsync: addCattle, isLoading: isAdding } = useAddCattle();
  const { mutateAsync: updateCattle, isLoading: isUpdating } = useUpdateCattle();
  const { mutateAsync: deleteCattle, isLoading: isDeleting } = useDeleteCattle();
  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      toast({
        title: "Error fetching cattle",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleAddEditCattle = async (cattleData) => {
    try {
      if (selectedCattleId) {
        // Update existing cattle
        await updateCattle({ id: selectedCattleId, ...cattleData });
        toast({
          title: "Cattle updated",
          description: "Cattle information has been updated successfully.",
        });
      } else {
        // Add new cattle
        await addCattle(cattleData);
        toast({
          title: "Cattle added",
          description: "New cattle has been added to the inventory.",
        });
      }
      setIsAddEditDialogOpen(false);
      setSelectedCattleId(null);
      refetch(); // Refresh cattle data
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteCattle = async () => {
    if (!cattleToDelete) return;
    try {
      await deleteCattle(cattleToDelete.id);
      toast({
        title: "Cattle deleted",
        description: "Cattle has been removed from the inventory.",
      });
      setIsDeleteDialogOpen(false);
      setCattleToDelete(null);
      refetch(); // Refresh cattle data
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleOpenEditDialog = (cattleId) => {
    setSelectedCattleId(cattleId);
    setIsAddEditDialogOpen(true);
  };

  const handleOpenDeleteDialog = (cattle) => {
    setCattleToDelete(cattle);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Herd Management</h2>
        <Button onClick={() => setIsAddEditDialogOpen(true)} disabled={isAdding || isUpdating || isDeleting}>
          Add Cattle
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cattle Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tag Number</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Breed</TableHead>
                  <TableHead>Date of Birth</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Skeleton loading state
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={`skeleton-${i}`}>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell className="text-right"><Skeleton /></TableCell>
                    </TableRow>
                  ))
                ) : cattleData && cattleData.length > 0 ? (
                  // Actual data rows
                  cattleData.map((cattle) => (
                    <TableRow key={cattle.id}>
                      <TableCell>{cattle.tag_number}</TableCell>
                      <TableCell>{cattle.name}</TableCell>
                      <TableCell>{cattle.cattle_type}</TableCell>
                      <TableCell>{cattle.breed}</TableCell>
                      <TableCell>{cattle.date_of_birth ? format(new Date(cattle.date_of_birth), 'yyyy-MM-dd') : 'N/A'}</TableCell>
                      <TableCell>{cattle.weight}</TableCell>
                      <TableCell>
                        <Badge variant={cattle.status === 'active' ? 'default' : 'secondary'}>
                          {cattle.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleOpenEditDialog(cattle.id)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenDeleteDialog(cattle)}>
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  // No data state
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">No cattle found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    Total cattle: {cattleData ? cattleData.length : 0}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      <Button 
        onClick={() => setIsPredictionDialogOpen(true)}
        className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:opacity-90"
      >
        <span>Add Measurement</span>
      </Button>
      
      <GrowthPredictionDialog 
        open={isPredictionDialogOpen}
        onOpenChange={setIsPredictionDialogOpen}
        cattleData={cattleData || []}
      />

      <AddEditCattleDialog
        open={isAddEditDialogOpen}
        onOpenChange={setIsAddEditDialogOpen}
        onSubmit={handleAddEditCattle}
        isLoading={isAdding || isUpdating}
        cattleId={selectedCattleId}
      />

      <DeleteCattleDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteCattle}
        isLoading={isDeleting}
        cattle={cattleToDelete}
      />
    </div>
  );
};

export default HerdManagement;
