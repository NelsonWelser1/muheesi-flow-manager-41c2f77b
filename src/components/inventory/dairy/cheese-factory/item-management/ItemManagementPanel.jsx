import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  { id: 6, itemName: "Saucepans (Big)", section: "Processing Section", quantity: 4, unitCost: 80000, totalCost: 320000, lastUpdated: new Date().toISOString() },
  { id: 7, itemName: "Saucepans (Medium)", section: "Processing Section", quantity: 6, unitCost: 60000, totalCost: 360000, lastUpdated: new Date().toISOString() },
  { id: 8, itemName: "Sauce Pans (Small)", section: "Processing Section", quantity: 8, unitCost: 40000, totalCost: 320000, lastUpdated: new Date().toISOString() },
  { id: 9, itemName: "Plungers", section: "Processing Section", quantity: 10, unitCost: 15000, totalCost: 150000, lastUpdated: new Date().toISOString() },
  { id: 10, itemName: "Mingling Sticks", section: "Processing Section", quantity: 12, unitCost: 10000, totalCost: 120000, lastUpdated: new Date().toISOString() },
  { id: 11, itemName: "Basin/Plastic Buckets", section: "Processing Section", quantity: 15, unitCost: 20000, totalCost: 300000, lastUpdated: new Date().toISOString() },
  { id: 12, itemName: "Knives", section: "Processing Section", quantity: 8, unitCost: 25000, totalCost: 200000, lastUpdated: new Date().toISOString() },
  { id: 13, itemName: "Cheese Stretcher", section: "Processing Section", quantity: 3, unitCost: 100000, totalCost: 300000, lastUpdated: new Date().toISOString() },

  // Heating and Cooking
  { id: 14, itemName: "Charcoal Stoves", section: "Heating and Cooking", quantity: 4, unitCost: 150000, totalCost: 600000, lastUpdated: new Date().toISOString() },
  { id: 15, itemName: "Stove Stands (Small)", section: "Heating and Cooking", quantity: 6, unitCost: 50000, totalCost: 300000, lastUpdated: new Date().toISOString() },
  { id: 16, itemName: "Stove Stands (Big)", section: "Heating and Cooking", quantity: 4, unitCost: 80000, totalCost: 320000, lastUpdated: new Date().toISOString() },

  // Moulding and Pressing Section
  { id: 17, itemName: "Moulds (Gouda)", section: "Moulding and Pressing Section", quantity: 10, unitCost: 120000, totalCost: 1200000, lastUpdated: new Date().toISOString() },
  { id: 18, itemName: "Moulds (Mozzarella)", section: "Moulding and Pressing Section", quantity: 12, unitCost: 100000, totalCost: 1200000, lastUpdated: new Date().toISOString() },
  { id: 19, itemName: "Press", section: "Moulding and Pressing Section", quantity: 2, unitCost: 500000, totalCost: 1000000, lastUpdated: new Date().toISOString() },

  // Packaging Section
  { id: 20, itemName: "Impulse Sealer", section: "Packaging Section", quantity: 2, unitCost: 300000, totalCost: 600000, lastUpdated: new Date().toISOString() },
  { id: 21, itemName: "Vacuum Sealer", section: "Packaging Section", quantity: 1, unitCost: 800000, totalCost: 800000, lastUpdated: new Date().toISOString() },
  { id: 22, itemName: "Labels (Mozzarella)", section: "Packaging Section", quantity: 1000, unitCost: 200, totalCost: 200000, lastUpdated: new Date().toISOString() },
  { id: 23, itemName: "Labels (Gouda)", section: "Packaging Section", quantity: 1000, unitCost: 200, totalCost: 200000, lastUpdated: new Date().toISOString() },
  { id: 24, itemName: "PVC Gouda 6\"", section: "Packaging Section", quantity: 100, unitCost: 5000, totalCost: 500000, lastUpdated: new Date().toISOString() },
  { id: 25, itemName: "PVC Mozzarella 4\"", section: "Packaging Section", quantity: 100, unitCost: 4000, totalCost: 400000, lastUpdated: new Date().toISOString() },
  { id: 26, itemName: "Boxes", section: "Packaging Section", quantity: 200, unitCost: 2000, totalCost: 400000, lastUpdated: new Date().toISOString() },
  { id: 27, itemName: "Seal Tape", section: "Packaging Section", quantity: 50, unitCost: 3000, totalCost: 150000, lastUpdated: new Date().toISOString() },
  { id: 28, itemName: "Tying Ropes", section: "Packaging Section", quantity: 100, unitCost: 1000, totalCost: 100000, lastUpdated: new Date().toISOString() },
  { id: 29, itemName: "Scissors", section: "Packaging Section", quantity: 5, unitCost: 10000, totalCost: 50000, lastUpdated: new Date().toISOString() },

  // Storage and Refrigeration
  { id: 30, itemName: "Deep Freezers", section: "Storage and Refrigeration", quantity: 3, unitCost: 2000000, totalCost: 6000000, lastUpdated: new Date().toISOString() },
  { id: 31, itemName: "Fridge Guards", section: "Storage and Refrigeration", quantity: 3, unitCost: 100000, totalCost: 300000, lastUpdated: new Date().toISOString() },
  { id: 32, itemName: "Extension Cables", section: "Storage and Refrigeration", quantity: 5, unitCost: 30000, totalCost: 150000, lastUpdated: new Date().toISOString() },

  // Lab and Quality Control
  { id: 33, itemName: "Test Tubes", section: "Lab and Quality Control", quantity: 50, unitCost: 5000, totalCost: 250000, lastUpdated: new Date().toISOString() },
  { id: 34, itemName: "Test Tube Rack", section: "Lab and Quality Control", quantity: 5, unitCost: 20000, totalCost: 100000, lastUpdated: new Date().toISOString() },
  { id: 35, itemName: "Test Tube Holders", section: "Lab and Quality Control", quantity: 10, unitCost: 15000, totalCost: 150000, lastUpdated: new Date().toISOString() },
  { id: 36, itemName: "Milk Analyser", section: "Lab and Quality Control", quantity: 1, unitCost: 3000000, totalCost: 3000000, lastUpdated: new Date().toISOString() },
  { id: 37, itemName: "Droppers", section: "Lab and Quality Control", quantity: 20, unitCost: 5000, totalCost: 100000, lastUpdated: new Date().toISOString() },
  { id: 38, itemName: "Lactometer", section: "Lab and Quality Control", quantity: 3, unitCost: 50000, totalCost: 150000, lastUpdated: new Date().toISOString() },
  { id: 39, itemName: "Digital Thermometer", section: "Lab and Quality Control", quantity: 4, unitCost: 100000, totalCost: 400000, lastUpdated: new Date().toISOString() },
  { id: 40, itemName: "Digital Spoon", section: "Lab and Quality Control", quantity: 2, unitCost: 150000, totalCost: 300000, lastUpdated: new Date().toISOString() },
  { id: 41, itemName: "Universal pH Meter", section: "Lab and Quality Control", quantity: 2, unitCost: 200000, totalCost: 400000, lastUpdated: new Date().toISOString() },
  { id: 42, itemName: "Measuring Cylinders", section: "Lab and Quality Control", quantity: 10, unitCost: 30000, totalCost: 300000, lastUpdated: new Date().toISOString() },
  { id: 43, itemName: "Measuring Jars", section: "Lab and Quality Control", quantity: 8, unitCost: 25000, totalCost: 200000, lastUpdated: new Date().toISOString() },

  // Additives and Ingredients
  { id: 44, itemName: "Rennet Enzyme", section: "Additives and Ingredients", quantity: 20, unitCost: 50000, totalCost: 1000000, lastUpdated: new Date().toISOString() },
  { id: 45, itemName: "Salt Peter", section: "Additives and Ingredients", quantity: 50, unitCost: 10000, totalCost: 500000, lastUpdated: new Date().toISOString() },
  { id: 46, itemName: "Potassium", section: "Additives and Ingredients", quantity: 30, unitCost: 20000, totalCost: 600000, lastUpdated: new Date().toISOString() },
  { id: 47, itemName: "Calcium", section: "Additives and Ingredients", quantity: 40, unitCost: 15000, totalCost: 600000, lastUpdated: new Date().toISOString() },
  { id: 48, itemName: "Annato", section: "Additives and Ingredients", quantity: 25, unitCost: 30000, totalCost: 750000, lastUpdated: new Date().toISOString() },
  { id: 49, itemName: "Culture Gouda", section: "Additives and Ingredients", quantity: 15, unitCost: 100000, totalCost: 1500000, lastUpdated: new Date().toISOString() },
  { id: 50, itemName: "Culture Mozzarella STI 13/14", section: "Additives and Ingredients", quantity: 15, unitCost: 100000, totalCost: 1500000, lastUpdated: new Date().toISOString() },
  { id: 51, itemName: "Salt", section: "Additives and Ingredients", quantity: 100, unitCost: 2000, totalCost: 200000, lastUpdated: new Date().toISOString() },
  { id: 52, itemName: "R704", section: "Additives and Ingredients", quantity: 10, unitCost: 80000, totalCost: 800000, lastUpdated: new Date().toISOString() },
  { id: 53, itemName: "ST1", section: "Additives and Ingredients", quantity: 10, unitCost: 80000, totalCost: 800000, lastUpdated: new Date().toISOString() },
  { id: 54, itemName: "CHN 22", section: "Additives and Ingredients", quantity: 10, unitCost: 80000, totalCost: 800000, lastUpdated: new Date().toISOString() },
  { id: 55, itemName: "Charcoal", section: "Additives and Ingredients", quantity: 200, unitCost: 1000, totalCost: 200000, lastUpdated: new Date().toISOString() },

  // Office and Administration
  { id: 56, itemName: "Tables", section: "Office and Administration", quantity: 5, unitCost: 200000, totalCost: 1000000, lastUpdated: new Date().toISOString() },
  { id: 57, itemName: "Chairs", section: "Office and Administration", quantity: 10, unitCost: 100000, totalCost: 1000000, lastUpdated: new Date().toISOString() },
  { id: 58, itemName: "Plastic Chairs", section: "Office and Administration", quantity: 15, unitCost: 30000, totalCost: 450000, lastUpdated: new Date().toISOString() },
  { id: 59, itemName: "Stationery", section: "Office and Administration", quantity: 1, unitCost: 500000, totalCost: 500000, lastUpdated: new Date().toISOString() },
  { id: 60, itemName: "Computers", section: "Office and Administration", quantity: 3, unitCost: 2000000, totalCost: 6000000, lastUpdated: new Date().toISOString() },

  // Others (General and Safety)
  { id: 61, itemName: "First Aid Kit", section: "Others (General and Safety)", quantity: 2, unitCost: 100000, totalCost: 200000, lastUpdated: new Date().toISOString() },
  { id: 62, itemName: "Uniforms", section: "Others (General and Safety)", quantity: 20, unitCost: 50000, totalCost: 1000000, lastUpdated: new Date().toISOString() },
  { id: 63, itemName: "Gumboots", section: "Others (General and Safety)", quantity: 15, unitCost: 30000, totalCost: 450000, lastUpdated: new Date().toISOString() },
  { id: 64, itemName: "Wall Clock", section: "Others (General and Safety)", quantity: 3, unitCost: 20000, totalCost: 60000, lastUpdated: new Date().toISOString() }
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
