
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock data for equipment - in a real app, this would come from a database
const mockEquipment = [
  { id: 1, name: 'Tractor', type: 'heavy-machinery', status: 'operational', assignedTo: 'Kashari Eastern', lastMaintenance: '2025-03-15' },
  { id: 2, name: 'Irrigation Pump', type: 'irrigation', status: 'needs-maintenance', assignedTo: 'Kashari Western', lastMaintenance: '2024-12-10' },
  { id: 3, name: 'Pruning Shears (Set)', type: 'hand-tools', status: 'operational', assignedTo: 'All Farms', lastMaintenance: '2025-02-20' },
  { id: 4, name: 'Pesticide Sprayer', type: 'spraying-equipment', status: 'operational', assignedTo: 'Kashari Northern', lastMaintenance: '2025-03-01' },
];

const EquipmentTracker = () => {
  const [showForm, setShowForm] = useState(false);
  const [equipment, setEquipment] = useState(mockEquipment);
  const [newEquipment, setNewEquipment] = useState({
    name: '',
    type: '',
    status: 'operational',
    assignedTo: '',
    lastMaintenance: new Date().toISOString().split('T')[0]
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEquipment({
      ...newEquipment,
      [name]: value
    });
  };
  
  const handleSelectChange = (name, value) => {
    setNewEquipment({
      ...newEquipment,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Add the new equipment to our list
    const updatedEquipment = [...equipment, {
      id: Date.now(), // Simple ID generation
      ...newEquipment
    }];
    
    setEquipment(updatedEquipment);
    
    // Reset form and hide it
    setNewEquipment({
      name: '',
      type: '',
      status: 'operational',
      assignedTo: '',
      lastMaintenance: new Date().toISOString().split('T')[0]
    });
    setShowForm(false);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'operational':
        return 'bg-green-100 text-green-800';
      case 'needs-maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'out-of-service':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Equipment Tracker</CardTitle>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Equipment'}
        </Button>
      </CardHeader>
      <CardContent>
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 border rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Equipment Name</label>
                <Input 
                  name="name" 
                  value={newEquipment.name} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="Name of the equipment"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <Select 
                  name="type" 
                  onValueChange={(value) => handleSelectChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select equipment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="heavy-machinery">Heavy Machinery</SelectItem>
                    <SelectItem value="irrigation">Irrigation Equipment</SelectItem>
                    <SelectItem value="hand-tools">Hand Tools</SelectItem>
                    <SelectItem value="spraying-equipment">Spraying Equipment</SelectItem>
                    <SelectItem value="processing-equipment">Processing Equipment</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <Select 
                  name="status" 
                  defaultValue="operational"
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="operational">Operational</SelectItem>
                    <SelectItem value="needs-maintenance">Needs Maintenance</SelectItem>
                    <SelectItem value="out-of-service">Out of Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Assigned To</label>
                <Select 
                  name="assignedTo" 
                  onValueChange={(value) => handleSelectChange('assignedTo', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select farm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Kashari Eastern">Kashari Eastern</SelectItem>
                    <SelectItem value="Kashari Western">Kashari Western</SelectItem>
                    <SelectItem value="Kashari Northern">Kashari Northern</SelectItem>
                    <SelectItem value="Kashari Southern">Kashari Southern</SelectItem>
                    <SelectItem value="All Farms">All Farms</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Maintenance Date</label>
                <Input 
                  type="date"
                  name="lastMaintenance" 
                  value={newEquipment.lastMaintenance} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit">Save Equipment</Button>
            </div>
          </form>
        )}
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Last Maintenance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipment.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">No equipment recorded</TableCell>
                </TableRow>
              ) : (
                equipment.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="capitalize">{item.type.replace('-', ' ')}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(item.status)}`}>
                        {item.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </TableCell>
                    <TableCell>{item.assignedTo}</TableCell>
                    <TableCell>{new Date(item.lastMaintenance).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm">Log Maintenance</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default EquipmentTracker;
