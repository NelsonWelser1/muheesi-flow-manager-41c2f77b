
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddStockEntryForm from "./AddStockEntryForm";
import InventoryTable from './inventory/InventoryTable';

const InventoryManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [inventory, setInventory] = useState([
    {
      product: "Bananas",
      quantity: "250",
      unit: "Bunches",
      location: "Warehouse A",
      date: "2025-04-16",
    },
    {
      product: "Maize",
      quantity: "1.5",
      unit: "Tonnes",
      location: "Warehouse B",
      date: "2025-04-16",
    },
    {
      product: "Beans",
      quantity: "500",
      unit: "Kgs",
      location: "Warehouse C",
      date: "2025-04-16",
    }
  ]);

  const handleAddClick = () => setShowForm(true);
  const handleFormSubmit = (entry) => {
    setInventory([entry, ...inventory]);
    setShowForm(false);
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
          <InventoryTable inventory={inventory} />
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryManagement;
