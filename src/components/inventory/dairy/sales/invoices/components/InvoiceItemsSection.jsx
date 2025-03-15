
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import InvoiceItemRow from './InvoiceItemRow';

const InvoiceItemsSection = ({ invoiceItems, handleAddItem, handleItemChange, handleRemoveItem }) => {
  return (
    <div className="space-y-2">
      <Label>Itemized Products/Services</Label>
      <div className="border rounded-lg p-4 space-y-4">
        {invoiceItems.map((item, index) => (
          <InvoiceItemRow 
            key={index}
            item={item}
            index={index}
            handleItemChange={handleItemChange}
            handleRemoveItem={handleRemoveItem}
          />
        ))}
        
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleAddItem}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Add Item
        </Button>
      </div>
    </div>
  );
};

export default InvoiceItemsSection;
