
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for inventory items - in a real app, this would come from a database
const mockInventory = {
  seeds: [
    { id: 1, name: 'Maize Seeds (Longe 5)', quantity: 150, unit: 'kg', location: 'Main Storehouse', lastUpdated: '2025-03-20' },
    { id: 2, name: 'Bean Seeds (K132)', quantity: 75, unit: 'kg', location: 'Main Storehouse', lastUpdated: '2025-03-15' },
  ],
  tools: [
    { id: 1, name: 'Pruning Shears', quantity: 25, unit: 'pieces', location: 'Equipment Shed', lastUpdated: '2025-03-10' },
    { id: 2, name: 'Harvesting Knives', quantity: 30, unit: 'pieces', location: 'Equipment Shed', lastUpdated: '2025-03-18' },
  ],
  fertilizers: [
    { id: 1, name: 'NPK Fertilizer', quantity: 500, unit: 'kg', location: 'Chemical Storage', lastUpdated: '2025-03-05' },
    { id: 2, name: 'Organic Compost', quantity: 2000, unit: 'kg', location: 'Compost Area', lastUpdated: '2025-03-22' },
  ],
  pesticides: [
    { id: 1, name: 'Insecticide Solution', quantity: 50, unit: 'liters', location: 'Chemical Storage', lastUpdated: '2025-03-12' },
    { id: 2, name: 'Fungicide Powder', quantity: 25, unit: 'kg', location: 'Chemical Storage', lastUpdated: '2025-03-08' },
  ],
  produce: [
    { id: 1, name: 'Harvested Bananas', quantity: 300, unit: 'bunches', location: 'Produce Storage', lastUpdated: '2025-04-10' },
    { id: 2, name: 'Harvested Coffee Beans', quantity: 450, unit: 'kg', location: 'Produce Storage', lastUpdated: '2025-04-05' },
  ]
};

const InventoryManagement = () => {
  const [activeTab, setActiveTab] = useState('seeds');
  const [showForm, setShowForm] = useState(false);
  const [inventory, setInventory] = useState(mockInventory);
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: '',
    unit: '',
    location: '',
    lastUpdated: new Date().toISOString().split('T')[0]
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({
      ...newItem,
      [name]: value
    });
  };
  
  const handleSelectChange = (name, value) => {
    setNewItem({
      ...newItem,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Add the new item to our inventory
    const updatedInventory = {
      ...inventory,
      [activeTab]: [
        ...inventory[activeTab],
        {
          id: Date.now(), // Simple ID generation
          ...newItem,
          quantity: parseFloat(newItem.quantity)
        }
      ]
    };
    
    setInventory(updatedInventory);
    
    // Reset form and hide it
    setNewItem({
      name: '',
      quantity: '',
      unit: '',
      location: '',
      lastUpdated: new Date().toISOString().split('T')[0]
    });
    setShowForm(false);
  };

  const getUnitOptions = () => {
    switch (activeTab) {
      case 'seeds':
      case 'fertilizers':
      case 'pesticides':
        return ['kg', 'g', 'liters', 'bags'];
      case 'tools':
        return ['pieces', 'sets', 'boxes'];
      case 'produce':
        return ['kg', 'bunches', 'boxes', 'bags', 'tons'];
      default:
        return ['pieces', 'kg', 'liters'];
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Inventory Management</CardTitle>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Item'}
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="seeds">Seeds</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="fertilizers">Fertilizers</TabsTrigger>
            <TabsTrigger value="pesticides">Pesticides</TabsTrigger>
            <TabsTrigger value="produce">Produce</TabsTrigger>
          </TabsList>
          
          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 border rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Item Name</label>
                  <Input 
                    name="name" 
                    value={newItem.name} 
                    onChange={handleInputChange} 
                    required 
                    placeholder={`Name of the ${activeTab.slice(0, -1)}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Quantity</label>
                  <Input 
                    type="number"
                    min="0"
                    step="0.01"
                    name="quantity" 
                    value={newItem.quantity} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Unit</label>
                  <Select 
                    name="unit" 
                    onValueChange={(value) => handleSelectChange('unit', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {getUnitOptions().map(unit => (
                        <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Storage Location</label>
                  <Select 
                    name="location" 
                    onValueChange={(value) => handleSelectChange('location', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Main Storehouse">Main Storehouse</SelectItem>
                      <SelectItem value="Equipment Shed">Equipment Shed</SelectItem>
                      <SelectItem value="Chemical Storage">Chemical Storage</SelectItem>
                      <SelectItem value="Compost Area">Compost Area</SelectItem>
                      <SelectItem value="Produce Storage">Produce Storage</SelectItem>
                      <SelectItem value="Field Storage">Field Storage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit">Save Item</Button>
              </div>
            </form>
          )}
          
          {Object.keys(inventory).map(key => (
            <TabsContent key={key} value={key} className="space-y-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventory[key].length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">No {key} in inventory</TableCell>
                      </TableRow>
                    ) : (
                      inventory[key].map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.unit}</TableCell>
                          <TableCell>{item.location}</TableCell>
                          <TableCell>{new Date(item.lastUpdated).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">Edit</Button>
                              <Button variant="ghost" size="sm">Update Stock</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default InventoryManagement;
