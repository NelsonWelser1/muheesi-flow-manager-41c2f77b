
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

// Mock data for workers - in a real app, this would come from a database
const mockWorkers = [
  { id: 1, name: 'John Doe', role: 'field-worker', contact: '0772123456', farm: 'Kashari Eastern', active: true },
  { id: 2, name: 'Jane Smith', role: 'supervisor', contact: '0712987654', farm: 'Kashari Western', active: true },
  { id: 3, name: 'Robert Mukasa', role: 'field-worker', contact: '0789456123', farm: 'Kashari Northern', active: false },
  { id: 4, name: 'Sarah Namugga', role: 'manager', contact: '0701234567', farm: 'All Farms', active: true },
];

const WorkerManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [workers, setWorkers] = useState(mockWorkers);
  const [newWorker, setNewWorker] = useState({
    name: '',
    role: '',
    contact: '',
    farm: '',
    active: true
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewWorker({
      ...newWorker,
      [name]: value
    });
  };
  
  const handleSelectChange = (name, value) => {
    setNewWorker({
      ...newWorker,
      [name]: value
    });
  };

  const handleCheckboxChange = (checked) => {
    setNewWorker({
      ...newWorker,
      active: checked
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Add the new worker to our list
    const updatedWorkers = [...workers, {
      id: Date.now(), // Simple ID generation
      ...newWorker
    }];
    
    setWorkers(updatedWorkers);
    
    // Reset form and hide it
    setNewWorker({
      name: '',
      role: '',
      contact: '',
      farm: '',
      active: true
    });
    setShowForm(false);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Worker Management</CardTitle>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Worker'}
        </Button>
      </CardHeader>
      <CardContent>
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 border rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <Input 
                  name="name" 
                  value={newWorker.name} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="Worker's full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <Select 
                  name="role" 
                  onValueChange={(value) => handleSelectChange('role', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select worker role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="field-worker">Field Worker</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="specialist">Specialist</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contact Number</label>
                <Input 
                  name="contact" 
                  value={newWorker.contact} 
                  onChange={handleInputChange} 
                  placeholder="Phone number"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Farm Assignment</label>
                <Select 
                  name="farm" 
                  onValueChange={(value) => handleSelectChange('farm', value)}
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
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="active" 
                  checked={newWorker.active} 
                  onCheckedChange={handleCheckboxChange} 
                />
                <label htmlFor="active" className="text-sm font-medium">
                  Active Worker
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit">Save Worker</Button>
            </div>
          </form>
        )}
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Farm</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">No workers recorded</TableCell>
                </TableRow>
              ) : (
                workers.map((worker) => (
                  <TableRow key={worker.id}>
                    <TableCell>{worker.name}</TableCell>
                    <TableCell className="capitalize">{worker.role.replace('-', ' ')}</TableCell>
                    <TableCell>{worker.contact}</TableCell>
                    <TableCell>{worker.farm}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${worker.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {worker.active ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Edit</Button>
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

export default WorkerManagement;
