
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import AddStockEntryForm from "./AddStockEntryForm";
import InventoryTable from './inventory/InventoryTable';
import { usePlantationData } from '@/hooks/usePlantationData';

const InventoryManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  const { inventory, isLoadingInventory, addInventoryItem } = usePlantationData();

  const handleAddClick = () => setShowForm(true);
  
  const handleFormSubmit = async (entry) => {
    try {
      await addInventoryItem.mutateAsync(entry);
      setShowForm(false);
      toast({
        title: "Success",
        description: "Inventory item added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add inventory item",
        variant: "destructive",
      });
    }
  };

  const handleFormCancel = () => setShowForm(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        {!showForm && (
          <Button variant="outline" className="ml-auto" onClick={handleAddClick}>
            <Plus className="h-4 w-4 mr-2" />
            Add Stock Entry
          </Button>
        )}
      </div>

      {showForm && (
        <AddStockEntryForm
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Current Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <InventoryTable 
            inventory={inventory || []} 
            isLoading={isLoadingInventory} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryManagement;
