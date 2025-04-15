
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from 'date-fns';

// Mock data for scheduled harvests - in a real app, this would come from a database
const mockSchedules = [
  { id: 1, crop: 'banana', variety: 'Gonja', location: 'Kashari Eastern Block A', startDate: '2025-05-10', endDate: '2025-05-15', status: 'scheduled', estimatedYield: '2.5 tons' },
  { id: 2, crop: 'coffee', variety: 'Robusta', location: 'Kashari Western Block C', startDate: '2025-06-01', endDate: '2025-06-10', status: 'scheduled', estimatedYield: '1.8 tons' },
  { id: 3, crop: 'maize', variety: 'Longe 5', location: 'Kashari Northern Block B', startDate: '2025-04-20', endDate: '2025-04-25', status: 'in-progress', estimatedYield: '4 tons' },
  { id: 4, crop: 'beans', variety: 'K132', location: 'Kashari Southern Block A', startDate: '2025-04-16', endDate: '2025-04-18', status: 'completed', estimatedYield: '1.2 tons' },
];

const HarvestSchedule = () => {
  const [showForm, setShowForm] = useState(false);
  const [schedules, setSchedules] = useState(mockSchedules);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newSchedule, setNewSchedule] = useState({
    crop: '',
    variety: '',
    location: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(new Date().setDate(new Date().getDate() + 5)), 'yyyy-MM-dd'),
    status: 'scheduled',
    estimatedYield: ''
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSchedule({
      ...newSchedule,
      [name]: value
    });
  };
  
  const handleSelectChange = (name, value) => {
    setNewSchedule({
      ...newSchedule,
      [name]: value
    });

    if (name === 'crop') {
      setSelectedCrop(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Add the new schedule to our list
    const updatedSchedules = [...schedules, {
      id: Date.now(), // Simple ID generation
      ...newSchedule
    }];
    
    setSchedules(updatedSchedules);
    
    // Reset form and hide it
    setNewSchedule({
      crop: '',
      variety: '',
      location: '',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(new Date(new Date().setDate(new Date().getDate() + 5)), 'yyyy-MM-dd'),
      status: 'scheduled',
      estimatedYield: ''
    });
    setShowForm(false);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getVarietyOptions = () => {
    switch (selectedCrop) {
      case 'banana':
        return ['Bogoya', 'Gonja', 'Kibuzi', 'Ndizi'];
      case 'coffee':
        return ['Arabica', 'Robusta'];
      case 'maize':
        return ['Longe 5', 'Longe 7', 'Hybrid', 'Open-Pollinated'];
      case 'beans':
        return ['K132', 'Nambale', 'NABE 15', 'NABE 16'];
      default:
        return [];
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Harvest Schedule</CardTitle>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Schedule Harvest'}
        </Button>
      </CardHeader>
      <CardContent>
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 border rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Crop</label>
                <Select 
                  name="crop" 
                  onValueChange={(value) => handleSelectChange('crop', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select crop type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="coffee">Coffee</SelectItem>
                    <SelectItem value="maize">Maize</SelectItem>
                    <SelectItem value="beans">Beans</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Variety</label>
                <Select 
                  name="variety" 
                  onValueChange={(value) => handleSelectChange('variety', value)}
                  disabled={!selectedCrop}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={selectedCrop ? "Select variety" : "Select crop first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {getVarietyOptions().map(variety => (
                      <SelectItem key={variety} value={variety}>{variety}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <Select 
                  name="location" 
                  onValueChange={(value) => handleSelectChange('location', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Kashari Eastern Block A">Kashari Eastern Block A</SelectItem>
                    <SelectItem value="Kashari Eastern Block B">Kashari Eastern Block B</SelectItem>
                    <SelectItem value="Kashari Western Block A">Kashari Western Block A</SelectItem>
                    <SelectItem value="Kashari Western Block B">Kashari Western Block B</SelectItem>
                    <SelectItem value="Kashari Western Block C">Kashari Western Block C</SelectItem>
                    <SelectItem value="Kashari Northern Block A">Kashari Northern Block A</SelectItem>
                    <SelectItem value="Kashari Northern Block B">Kashari Northern Block B</SelectItem>
                    <SelectItem value="Kashari Southern Block A">Kashari Southern Block A</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Estimated Yield</label>
                <Input 
                  name="estimatedYield" 
                  value={newSchedule.estimatedYield} 
                  onChange={handleInputChange} 
                  placeholder="e.g. 2.5 tons" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <Input 
                  type="date"
                  name="startDate" 
                  value={newSchedule.startDate} 
                  onChange={handleInputChange} 
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <Input 
                  type="date"
                  name="endDate" 
                  value={newSchedule.endDate} 
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <Select 
                  name="status" 
                  defaultValue="scheduled"
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit">Save Schedule</Button>
            </div>
          </form>
        )}
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Crop</TableHead>
                <TableHead>Variety</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Est. Yield</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">No harvests scheduled</TableCell>
                </TableRow>
              ) : (
                schedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell className="capitalize">{schedule.crop}</TableCell>
                    <TableCell>{schedule.variety}</TableCell>
                    <TableCell>{schedule.location}</TableCell>
                    <TableCell>{new Date(schedule.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(schedule.endDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(schedule.status)}`}>
                        {schedule.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </TableCell>
                    <TableCell>{schedule.estimatedYield}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm" 
                          disabled={schedule.status === 'completed' || schedule.status === 'cancelled'}>
                          Update Status
                        </Button>
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

export default HarvestSchedule;
