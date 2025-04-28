
import React from 'react';
import { Card } from "@/components/ui/card";
import { useCattleInventory } from '@/hooks/useCattleInventory';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Loader2, PlusCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CattleList = () => {
  const { cattleList, isLoading, error, deleteCattle } = useCattleInventory('kashari');

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading cattle data...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center p-4 text-red-500">
          <p>Error loading cattle data</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Cattle List</h3>
        <Button
          variant="orange"
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={() => window.location.reload()}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Register New Cattle
        </Button>
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Tag Number</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Breed</TableHead>
              <TableHead>Health Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cattleList && cattleList.length > 0 ? (
              cattleList.map((cattle) => (
                <TableRow key={cattle.id} className="border-t hover:bg-muted/30">
                  <TableCell>{cattle.tag_number}</TableCell>
                  <TableCell>{cattle.name || '-'}</TableCell>
                  <TableCell>{cattle.type}</TableCell>
                  <TableCell>{cattle.breed}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full bg-slate-800 text-white text-xs">
                      {cattle.health_status || 'good'}
                    </span>
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 text-blue-600"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 text-red-600"
                      onClick={() => deleteCattle.mutate(cattle.id)}
                      disabled={deleteCattle.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                  No cattle records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default CattleList;
