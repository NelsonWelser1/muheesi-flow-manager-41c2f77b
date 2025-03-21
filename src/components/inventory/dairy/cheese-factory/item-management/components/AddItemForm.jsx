import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AddItemForm = ({ sections, newItem, setNewItem, handleAddItem }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Item</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="item_name">Item Name *</Label>
            <Input
              id="item_name"
              value={newItem.item_name}
              onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })}
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
            <Label htmlFor="unit_cost">Unit Cost *</Label>
            <Input
              id="unit_cost"
              type="number"
              value={newItem.unit_cost}
              onChange={(e) => setNewItem({ ...newItem, unit_cost: e.target.value })}
              placeholder="Enter unit cost"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="supplier_details">Supplier Details</Label>
            <Input
              id="supplier_details"
              value={newItem.supplier_details}
              onChange={(e) => setNewItem({ ...newItem, supplier_details: e.target.value })}
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