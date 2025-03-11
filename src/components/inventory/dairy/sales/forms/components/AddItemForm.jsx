
import React, { useState } from 'react';
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const AddItemForm = ({ register, addDeliveredItem, watch }) => {
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [itemUnit, setItemUnit] = useState('');

  const handleAddItem = () => {
    if (itemName && itemQuantity && itemUnit) {
      addDeliveredItem({
        name: itemName,
        quantity: itemQuantity,
        unit: itemUnit
      });
      
      // Reset form fields after adding an item
      setItemName('');
      setItemQuantity('');
      setItemUnit('');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Input 
        placeholder="Item name" 
        value={itemName}
        onChange={(e) => setItemName(e.target.value)} 
      />
      <Input 
        type="number" 
        placeholder="Quantity" 
        value={itemQuantity}
        onChange={(e) => setItemQuantity(e.target.value)} 
      />
      <Input 
        placeholder="Unit" 
        value={itemUnit}
        onChange={(e) => setItemUnit(e.target.value)} 
      />
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
