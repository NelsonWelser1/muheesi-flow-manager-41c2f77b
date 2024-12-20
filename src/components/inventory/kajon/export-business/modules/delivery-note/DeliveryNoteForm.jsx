import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DeliveryNoteForm = ({ onBack }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here
    console.log('Delivery note form submitted');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Order Reference</Label>
          <Input placeholder="Enter order reference" />
        </div>
        
        <div className="space-y-2">
          <Label>Delivery Date</Label>
          <Input type="date" />
        </div>

        <div className="space-y-2">
          <Label>Customer Name</Label>
          <Input placeholder="Enter customer name" />
        </div>

        <div className="space-y-2">
          <Label>Delivery Status</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-transit">In Transit</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Items to be Delivered</Label>
        <div className="border rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input placeholder="Item name" />
            <Input type="number" placeholder="Quantity" />
            <Input placeholder="Unit" />
            <Button type="button" variant="outline">Add Item</Button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Special Instructions</Label>
        <Input placeholder="Enter any special delivery instructions" />
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onBack}>Cancel</Button>
        <Button type="submit">Create Delivery Note</Button>
      </div>
    </form>
  );
};

export default DeliveryNoteForm;