import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import AddItemForm from './components/AddItemForm';
import InventoryTable from './components/InventoryTable';
import SearchBar from './components/SearchBar';

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

const itemStatuses = {
  'good': 'Good for Service',
  'fair': 'Fair for Service',
  'bad': 'Bad for Service',
  'out': 'Out of Service',
  'repair': 'Out for Repair & Maintenance',
  'used': 'Used-up',
  'need': 'More Needed'
};

const initialItems = [
  { id: 1, itemName: "Milk Cans", section: "Milk Reception and Initial Processing", quantity: 10, unitCost: 50000, totalCost: 500000, lastUpdated: new Date().toISOString() },
  { id: 2, itemName: "Aluminium Buckets", section: "Milk Reception and Initial Processing", quantity: 15, unitCost: 30000, totalCost: 450000, lastUpdated: new Date().toISOString() },
  { id: 3, itemName: "Sieving Cloths", section: "Milk Reception and Initial Processing", quantity: 20, unitCost: 5000, totalCost: 100000, lastUpdated: new Date().toISOString() },
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
  { id: 14, itemName: "Charcoal Stoves", section: "Heating and Cooking", quantity: 4, unitCost: 150000, totalCost: 600000, lastUpdated: new Date().toISOString() },
  { id: 15, itemName: "Stove Stands (Small)", section: "Heating and Cooking", quantity: 6, unitCost: 50000, totalCost: 300000, lastUpdated: new Date().toISOString() },
  { id: 16, itemName: "Stove Stands (Big)", section: "Heating and Cooking", quantity: 4, unitCost: 80000, totalCost: 320000, lastUpdated: new Date().toISOString() },
  { id: 17, itemName: "Moulds (Gouda)", section: "Moulding and Pressing Section", quantity: 10, unitCost: 120000, totalCost: 1200000, lastUpdated: new Date().toISOString() },
  { id: 18, itemName: "Moulds (Mozzarella)", section: "Moulding and Pressing Section", quantity: 12, unitCost: 100000, totalCost: 1200000, lastUpdated: new Date().toISOString() },
  { id: 19, itemName: "Press", section: "Moulding and Pressing Section", quantity: 2, unitCost: 500000, totalCost: 1000000, lastUpdated: new Date().toISOString() },
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
  { id: 30, itemName: "Deep Freezers", section: "Storage and Refrigeration", quantity: 3, unitCost: 2000000, totalCost: 6000000, lastUpdated: new Date().toISOString() },
  { id: 31, itemName: "Fridge Guards", section: "Storage and Refrigeration", quantity: 3, unitCost: 100000, totalCost: 300000, lastUpdated: new Date().toISOString() },
  { id: 32, itemName: "Extension Cables", section: "Storage and Refrigeration", quantity: 5, unitCost: 30000, totalCost: 150000, lastUpdated: new Date().toISOString() },
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
  { id: 56, itemName: "Tables", section: "Office and Administration", quantity: 5, unitCost: 200000, totalCost: 1000000, lastUpdated: new Date().toISOString() },
  { id: 57, itemName: "Chairs", section: "Office and Administration", quantity: 10, unitCost: 100000, totalCost: 1000000, lastUpdated: new Date().toISOString() },
  { id: 58, itemName: "Plastic Chairs", section: "Office and Administration", quantity: 15, unitCost: 30000, totalCost: 450000, lastUpdated: new Date().toISOString() },
  { id: 59, itemName: "Stationery", section: "Office and Administration", quantity: 1, unitCost: 500000, totalCost: 500000, lastUpdated: new Date().toISOString() },
  { id: 60, itemName: "Computers", section: "Office and Administration", quantity: 3, unitCost: 2000000, totalCost: 6000000, lastUpdated: new Date().toISOString() },
  { id: 61, itemName: "First Aid Kit", section: "Others (General and Safety)", quantity: 2, unitCost: 100000, totalCost: 200000, lastUpdated: new Date().toISOString() },
  { id: 62, itemName: "Uniforms", section: "Others (General and Safety)", quantity: 20, unitCost: 50000, totalCost: 1000000, lastUpdated: new Date().toISOString() },
  { id: 63, itemName: "Gumboots", section: "Others (General and Safety)", quantity: 15, unitCost: 30000, totalCost: 450000, lastUpdated: new Date().toISOString() },
  { id: 64, itemName: "Wall Clock", section: "Others (General and Safety)", quantity: 3, unitCost: 20000, totalCost: 60000, lastUpdated: new Date().toISOString() }
];

const ItemManagementPanel = () => {
  const { toast } = useToast();
  const [items, setItems] = useState(initialItems.map(item => ({ ...item, status: 'good' })));
  const [searchTerm, setSearchTerm] = useState('');
  const [newItem, setNewItem] = useState({
    itemName: '',
    section: '',
    quantity: '',
    unitCost: '',
    supplierDetails: '',
    notes: '',
    status: 'good'
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
      lastUpdated: new Date().toISOString(),
      status: 'good'
    };

    setItems([...items, itemWithTotal]);
    setNewItem({
      itemName: '',
      section: '',
      quantity: '',
      unitCost: '',
      supplierDetails: '',
      notes: '',
      status: 'good'
    });

    toast({
      title: "Success",
      description: "Item added successfully"
    });
  };

  const handleStatusChange = (id, newStatus) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: newStatus,
          lastUpdated: new Date().toISOString()
        };
      }
      return item;
    }));

    toast({
      title: "Status Updated",
      description: `Item status changed to ${itemStatuses[newStatus]}`
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      good: 'bg-green-100 text-green-800',
      fair: 'bg-yellow-100 text-yellow-800',
      bad: 'bg-red-100 text-red-800',
      out: 'bg-gray-100 text-gray-800',
      repair: 'bg-blue-100 text-blue-800',
      used: 'bg-purple-100 text-purple-800',
      need: 'bg-orange-100 text-orange-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredItems = items.filter(item =>
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.section.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <AddItemForm
        sections={sections}
        newItem={newItem}
        setNewItem={setNewItem}
        handleAddItem={handleAddItem}
      />

      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </CardHeader>
        <CardContent>
          <InventoryTable
            items={filteredItems}
            itemStatuses={itemStatuses}
            getStatusColor={getStatusColor}
            handleStatusChange={handleStatusChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ItemManagementPanel;
