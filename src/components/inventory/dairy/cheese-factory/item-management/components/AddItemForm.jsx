import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

const AddItemForm = ({ sections, newItem, setNewItem, handleAddItem }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Item</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="itemName">Item Name *</Label>
            <Input
              id="itemName"
              value={newItem.itemName}
              onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
              placeholder="e.g., Milk Cans"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="section">Section *</Label>
            <Select
              value={newItem.section}
              onValueChange={(value) => setNewItem({ ...newItem, section: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select section" />
              </SelectTrigger>
              <SelectContent>
                {sections.map((section) => (
                  <SelectItem key={section} value={section}>
                    {section}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity *</Label>
            <Input
              id="quantity"
              type="number"
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
              placeholder="Enter quantity"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unitCost">Unit Cost *</Label>
            <Input
              id="unitCost"
              type="number"
              value={newItem.unitCost}
              onChange={(e) => setNewItem({ ...newItem, unitCost: e.target.value })}
              placeholder="Enter unit cost"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="supplierDetails">Supplier Details</Label>
            <Input
              id="supplierDetails"
              value={newItem.supplierDetails}
              onChange={(e) => setNewItem({ ...newItem, supplierDetails: e.target.value })}
              placeholder="Enter supplier details"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={newItem.notes}
              onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
              placeholder="Add notes"
            />
          </div>
        </div>
        <Button className="mt-4" onClick={handleAddItem}>
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </CardContent>
    </Card>
  );
};

export default AddItemForm;