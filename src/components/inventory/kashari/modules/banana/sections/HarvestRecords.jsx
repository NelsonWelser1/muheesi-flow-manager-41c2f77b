
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePlantingHarvestingSchedule } from '@/hooks/usePlantingHarvestingSchedule';

const HarvestRecords = () => {
  const [showForm, setShowForm] = useState(false);
  const { 
    scheduleData, 
    schedules, 
    loading, 
    handleInputChange, 
    handleSelectChange, 
    saveSchedule 
  } = usePlantingHarvestingSchedule();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Set activity type to harvesting
    handleSelectChange('activity_type', 'harvesting');
    const result = await saveSchedule();
    if (result.success) {
      setShowForm(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Harvest Records</CardTitle>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Harvest Record'}
        </Button>
      </CardHeader>
      <CardContent>
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 border rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Farm Name</label>
                <Input 
                  name="farm_name" 
                  value={scheduleData.farm_name} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Produce Type</label>
                <Select 
                  name="produce_type" 
                  onValueChange={(value) => handleSelectChange('produce_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select produce type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="coffee">Coffee</SelectItem>
                    <SelectItem value="maize">Maize</SelectItem>
                    <SelectItem value="beans">Beans</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Harvest Date</label>
                <Input 
                  type="date" 
                  name="scheduled_date" 
                  value={scheduleData.scheduled_date} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Quantity (kg)</label>
                <Input 
                  type="number" 
                  name="quantity" 
                  value={scheduleData.quantity} 
                  onChange={handleInputChange} 
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Notes</label>
                <Input 
                  name="notes" 
                  value={scheduleData.notes} 
                  onChange={handleInputChange} 
                  placeholder="Additional details..." 
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit" disabled={loading}>Save Record</Button>
            </div>
          </form>
        )}
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Farm</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Harvest Date</TableHead>
                <TableHead>Quantity (kg)</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.filter(s => s.activity_type === 'harvesting').length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">No harvest records found</TableCell>
                </TableRow>
              ) : (
                schedules
                  .filter(s => s.activity_type === 'harvesting')
                  .map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell>{schedule.farm_name}</TableCell>
                      <TableCell>{schedule.produce_type || 'Not specified'}</TableCell>
                      <TableCell>{new Date(schedule.scheduled_date).toLocaleDateString()}</TableCell>
                      <TableCell>{schedule.quantity || '-'}</TableCell>
                      <TableCell>{schedule.notes || '-'}</TableCell>
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

export default HarvestRecords;
