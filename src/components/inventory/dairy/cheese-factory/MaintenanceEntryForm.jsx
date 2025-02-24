import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from 'date-fns';
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/supabase';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const MaintenanceEntryForm = () => {
  const [formData, setFormData] = useState({
    equipment_name: '',
    maintenance_type: '',
    status: 'due',
    last_maintenance: new Date(),
    next_maintenance: new Date(),
    health_score: 100,
    notes: '',
    company: 'Grand Berna Dairies',
    project: 'Cheese Factory'
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: maintenanceRecords, isLoading } = useQuery({
    queryKey: ['maintenance'],
    queryFn: async () => {
      console.log('Fetching maintenance records...');
      const { data, error } = await supabase
        .from('equipment_maintenance')
        .select('*')
        .order('next_maintenance', { ascending: true });

      if (error) {
        console.error('Error fetching maintenance records:', error);
        throw error;
      }

      console.log('Fetched maintenance records:', data);
      return data;
    }
  });

  const handleInputChange = (field, value) => {
    console.log(`Updating ${field} with value:`, value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);

    try {
      const formattedData = {
        ...formData,
        last_maintenance: formData.last_maintenance.toISOString(),
        next_maintenance: formData.next_maintenance.toISOString()
      };

      console.log('Formatted data for submission:', formattedData);

      const { data, error } = await supabase
        .from('equipment_maintenance')
        .insert([formattedData])
        .select();

      if (error) {
        console.error('Error saving maintenance record:', error);
        throw error;
      }

      console.log('Maintenance record saved successfully:', data);

      const { data: statsData, error: statsError } = await supabase
        .from('maintenance_stats')
        .select('*')
        .limit(1)
        .single();

      if (statsError) {
        console.error('Error fetching stats:', statsError);
        throw statsError;
      }

      const updatedStats = {
        completed_today: statsData.completed_today + (formData.status === 'completed' ? 1 : 0),
        equipment_health: formData.health_score,
        pending_maintenance: statsData.pending_maintenance + (formData.status === 'due' ? 1 : 0)
      };

      const { error: updateError } = await supabase
        .from('maintenance_stats')
        .update(updatedStats)
        .eq('id', statsData.id);

      if (updateError) {
        console.error('Error updating stats:', updateError);
        throw updateError;
      }

      queryClient.invalidateQueries(['maintenance']);
      
      toast({
        title: "Success",
        description: "Maintenance record saved successfully",
      });

      setFormData({
        equipment_name: '',
        maintenance_type: '',
        status: 'due',
        last_maintenance: new Date(),
        next_maintenance: new Date(),
        health_score: 100,
        notes: '',
        company: 'Grand Berna Dairies',
        project: 'Cheese Factory'
      });

    } catch (error) {
      console.error('Error in form submission:', error);
      toast({
        title: "Error",
        description: "Failed to save maintenance record",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Maintenance Entry Form</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="equipment_name">Equipment Name</Label>
              <Input
                id="equipment_name"
                value={formData.equipment_name}
                onChange={(e) => handleInputChange('equipment_name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maintenance_type">Maintenance Type</Label>
              <Select
                value={formData.maintenance_type}
                onValueChange={(value) => handleInputChange('maintenance_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="routine">Routine Check</SelectItem>
                  <SelectItem value="repair">Repair</SelectItem>
                  <SelectItem value="replacement">Part Replacement</SelectItem>
                  <SelectItem value="calibration">Calibration</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Last Maintenance Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.last_maintenance && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.last_maintenance ? format(formData.last_maintenance, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.last_maintenance}
                    onSelect={(date) => handleInputChange('last_maintenance', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Next Maintenance Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.next_maintenance && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.next_maintenance ? format(formData.next_maintenance, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.next_maintenance}
                    onSelect={(date) => handleInputChange('next_maintenance', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="due">Due</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="health_score">Health Score (%)</Label>
              <Input
                id="health_score"
                type="number"
                min="0"
                max="100"
                value={formData.health_score}
                onChange={(e) => handleInputChange('health_score', parseInt(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Add any additional notes"
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit">Save Maintenance Record</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MaintenanceEntryForm;
