import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Search, Trash2 } from "lucide-react";

const sections = [
  "Milk Reception and Initial Processing",
  "Processing Section",
  "Heating and Cooking",
  "Moulding and Pressing Section",
  "Packaging Section",
  "Storage and Refrigeration",
  "Lab and Quality Control",
  "Additives and Ingredients",
  "Office and Administration",
  "Others (General and Safety)"
];

const initialItems = [
  // Milk Reception and Initial Processing
  { id: 1, itemName: "Milk Cans", section: "Milk Reception and Initial Processing", quantity: 10, unitCost: 50000, totalCost: 500000, lastUpdated: new Date().toISOString() },
  { id: 2, itemName: "Aluminium Buckets", section: "Milk Reception and Initial Processing", quantity: 15, unitCost: 30000, totalCost: 450000, lastUpdated: new Date().toISOString() },
  { id: 3, itemName: "Sieving Cloths", section: "Milk Reception and Initial Processing", quantity: 20, unitCost: 5000, totalCost: 100000, lastUpdated: new Date().toISOString() },
  
  // Processing Section
  { id: 4, itemName: "Processing Vats (Big)", section: "Processing Section", quantity: 5, unitCost: 200000, totalCost: 1000000, lastUpdated: new Date().toISOString() },
  { id: 5, itemName: "Processing Vats (Small)", section: "Processing Section", quantity: 8, unitCost: 150000, totalCost: 1200000, lastUpdated: new Date().toISOString() },
  // ... Add all other items following the same pattern
];

const ItemManagementPanel = () => {
  const { toast } = useToast();
  const [items, setItems] = useState(initialItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [newItem, setNewItem] = useState({
    itemName: '',
    section: '',
    quantity: '',
    unitCost: '',
    supplierDetails: '',
    notes: ''
  });

  const handleAddItem = () => {
    if (!newItem.itemName || !newItem.section || !newItem.quantity || !newItem.unitCost) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const totalCost = Number(newItem.quantity) * Number(newItem.unitCost);
    const itemWithTotal = {
      ...newItem,
      id: Date.now(),
      totalCost,
      lastUpdated: new Date().toISOString()
    };

    setItems([...items, itemWithTotal]);
    setNewItem({
      itemName: '',
      section: '',
      quantity: '',
      unitCost: '',
      supplierDetails: '',
      notes: ''
    });

    toast({
      title: "Success",
      description: "Item added successfully"
    });
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
    toast({
      title: "Success",
      description: "Item deleted successfully"
    });
  };

  const filteredItems = items.filter(item =>
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.section.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
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

      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Cost</TableHead>
                  <TableHead>Total Cost</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.itemName}</TableCell>
                    <TableCell>{item.section}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.unitCost}</TableCell>
                    <TableCell>{item.totalCost}</TableCell>
                    <TableCell>{new Date(item.lastUpdated).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ItemManagementPanel;