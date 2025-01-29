import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase';

const MilkOffloadForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    tank_number: '',
    volume_offloaded: '',
    destination: '',
    temperature: '',
    quality_check: 'Pass',
    notes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQualityChange = (value) => {
    setFormData(prev => ({
      ...prev,
      quality_check: value
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      'tank_number',
      'volume_offloaded',
      'destination',
      'temperature',
      'quality_check'
    ];

    const errors = [];
    requiredFields.forEach(field => {
      if (!formData[field]) {
        errors.push(`${field.replace('_', ' ')} is required`);
      }
    });

    // Validate numeric fields
    const numericFields = ['volume_offloaded', 'temperature'];
    numericFields.forEach(field => {
      if (isNaN(parseFloat(formData[field]))) {
        errors.push(`${field.replace('_', ' ')} must be a valid number`);
      }
    });

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form data before submission:', formData);

    const errors = validateForm();
    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors.join(', '),
        variant: "destructive",
      });
      return;
    }

    try {
      const dataToSubmit = {
        ...formData,
        volume_offloaded: parseFloat(formData.volume_offloaded),
        temperature: parseFloat(formData.temperature),
        offload_date: new Date().toISOString()
      };

      console.log('Submitting offload data:', dataToSubmit);
      const { data, error } = await supabase
        .from('milk_tank_offloads')
        .insert([dataToSubmit])
        .select()
        .single();

      if (error) throw error;

      console.log('Offload record added successfully:', data);
      toast({
        title: "Success",
        description: "Tank offload record added successfully",
      });

      // Reset form
      setFormData({
        tank_number: '',
        volume_offloaded: '',
        destination: '',
        temperature: '',
        quality_check: 'Pass',
        notes: ''
      });
    } catch (error) {
      console.error('Error in form submission:', error);
      toast({
        title: "Submission Failed",
        description: "Please check your data and try again. " + (error.message || ''),
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Tank Offload Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tank_number">Tank Number</Label>
              <Input
                id="tank_number"
                name="tank_number"
                value={formData.tank_number}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="volume_offloaded">Volume Offloaded (L)</Label>
              <Input
                id="volume_offloaded"
                name="volume_offloaded"
                type="number"
                step="0.01"
                value={formData.volume_offloaded}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature (°C)</Label>
              <Input
                id="temperature"
                name="temperature"
                type="number"
                step="0.1"
                value={formData.temperature}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quality_check">Quality Check</Label>
              <Select 
                value={formData.quality_check} 
                onValueChange={handleQualityChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select quality status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pass">Pass</SelectItem>
                  <SelectItem value="Fail">Fail</SelectItem>
                  <SelectItem value="Pending">Pending Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="min-h-[100px]"
            />
          </div>

          <Button type="submit" className="w-full">
            Submit Offload Record
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MilkOffloadForm;