
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

const InvoiceItemRow = ({ item, index, handleItemChange, handleRemoveItem }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-2 items-end">
      <div>
        <Label className="text-xs">Description</Label>
        <Input 
          placeholder="Item description" 
          value={item.description}
          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
        />
      </div>
      <div>
        <Label className="text-xs">Quantity</Label>
        <Input 
          type="number" 
          placeholder="Quantity"
          value={item.quantity}
          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
          min="1"
        />
      </div>
      <div>
        <Label className="text-xs">Unit Price</Label>
        <Input 
          type="number" 
          placeholder="Unit price"
          value={item.price}
          onChange={(e) => handleItemChange(index, 'price', e.target.value)}
          min="0"
        />
      </div>
      <div>
        <Label className="text-xs">Discount</Label>
        <Input 
          type="number" 
          placeholder="Discount"
          value={item.discount}
          onChange={(e) => handleItemChange(index, 'discount', e.target.value)}
          min="0"
        />
      </div>
      <div>
        <Label className="text-xs">Tax (%)</Label>
        <Input 
          type="number" 
          placeholder="Tax %"
          value={item.tax}
          onChange={(e) => handleItemChange(index, 'tax', e.target.value)}
          min="0"
          max="100"
        />
      </div>
      <div className="flex gap-2">
        <div className="flex-grow">
          <Label className="text-xs">Total</Label>
          <Input 
            value={item.total.toLocaleString()} 
            readOnly 
            className="bg-gray-50"
          />
        </div>
        <Button 
          type="button" 
          variant="ghost" 
          size="icon"
          onClick={() => handleRemoveItem(index)}
          className="self-end"
        >
          <Trash className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    </div>
  );
};

export default InvoiceItemRow;
