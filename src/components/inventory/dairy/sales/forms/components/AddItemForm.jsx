
import React from 'react';
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const AddItemForm = ({ register, addDeliveredItem, watch }) => {
  const handleAddItem = () => {
    const itemName = watch("itemName");
    const itemQuantity = watch("itemQuantity");
    const itemUnit = watch("itemUnit");
    
    if (itemName && itemQuantity && itemUnit) {
      addDeliveredItem({
        name: itemName,
        quantity: itemQuantity,
        unit: itemUnit
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Input placeholder="Item name" {...register("itemName")} />
      <Input type="number" placeholder="Quantity" {...register("itemQuantity")} />
      <Input placeholder="Unit" {...register("itemUnit")} />
      <Button 
        type="button" 
        variant="outline"
        onClick={handleAddItem}
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Add Item
      </Button>
    </div>
  );
};

export default AddItemForm;
