import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const InvoiceForm = ({ onBack }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here
    console.log('Invoice form submitted');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Invoice Number</Label>
          <Input placeholder="Enter invoice number" />
        </div>
        
        <div className="space-y-2">
          <Label>Invoice Date</Label>
          <Input type="date" />
        </div>

        <div className="space-y-2">
          <Label>Customer Name</Label>
          <Input placeholder="Enter customer name" />
        </div>

        <div className="space-y-2">
          <Label>Payment Terms</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select terms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediate">Immediate</SelectItem>
              <SelectItem value="net30">Net 30</SelectItem>
              <SelectItem value="net60">Net 60</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Invoice Items</Label>
        <div className="border rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Input placeholder="Item description" />
            <Input type="number" placeholder="Quantity" />
            <Input type="number" placeholder="Unit price" />
            <Input placeholder="Total" readOnly />
            <Button type="button" variant="outline">Add Item</Button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Notes</Label>
        <Input placeholder="Enter any additional notes" />
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onBack}>Cancel</Button>
        <Button type="submit">Generate Invoice</Button>
      </div>
    </form>
  );
};

export default InvoiceForm;