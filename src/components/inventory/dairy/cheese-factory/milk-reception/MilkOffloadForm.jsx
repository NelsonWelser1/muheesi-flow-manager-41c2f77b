import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase';
import { useMilkReception } from '@/hooks/useMilkReception';

const MilkOffloadForm = () => {
  const { toast } = useToast();
  const { data: milkReceptionData, refetch: refetchMilkReception } = useMilkReception();
  const [formData, setFormData] = useState({
    tank_number: '',
    volume_offloaded: '',
    destination: '',
    temperature: '',
    quality_check: 'Pass',
    notes: ''
  });

  const handleTankSelection = (tankNumber) => {
    setFormData(prev => ({
      ...prev,
      tank_number: tankNumber
    }));
  };

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
    const errors = [];
    const requiredFields = ['tank_number', 'volume_offloaded', 'destination', 'temperature'];

    requiredFields.forEach(field => {
      if (!formData[field]) {
        errors.push(`${field.replace('_', ' ')} is required`);
      }
    });

    // Check if there's enough milk in the tank
    const tankMilk = milkReceptionData?.filter(record => 
      record.tank_number === formData.tank_number
    ).reduce((total, record) => total + record.milk_volume, 0) || 0;

    if (parseFloat(formData.volume_offloaded) > tankMilk) {
      errors.push(`Not enough milk in ${formData.tank_number}. Available: ${tankMilk}L`);
    }

    return errors;
  };

  const updateMilkReceptionRecord = async (volumeOffloaded, tankNumber) => {
    try {
      console.log('Attempting to update milk reception record...');
      const deductionRecord = {
        supplier_name: `Offload from ${tankNumber}`,
        milk_volume: -parseFloat(volumeOffloaded),
        temperature: parseFloat(formData.temperature),
        fat_percentage: 0,
        protein_percentage: 0,
        total_plate_count: 0,
        acidity: 0,
        notes: `Offloaded to: ${formData.destination}`,
        datetime: new Date().toISOString(),
        quality_check: formData.quality_check
      };

      console.log('Deduction record:', deductionRecord);

      const { error } = await supabase
        .from('milk_reception')
        .insert([deductionRecord]);

      if (error) {
        console.error('Error in updateMilkReceptionRecord:', error);
        throw error;
      }

      console.log('Successfully deducted milk from reception records');
      await refetchMilkReception();
    } catch (error) {
      console.error('Error updating milk reception record:', error);
      throw error;
    }
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
      
      // First record the offload
      const { data: offloadData, error: offloadError } = await supabase
        .from('milk_tank_offloads')
        .insert([dataToSubmit])
        .select()
        .single();

      if (offloadError) {
        console.error('Error in milk tank offload:', offloadError);
        throw offloadError;
      }

      console.log('Offload record added successfully:', offloadData);

      // Then update milk reception records to reflect the deduction
      await updateMilkReceptionRecord(
        formData.volume_offloaded,
        formData.tank_number
      );

      toast({
        title: "Success",
        description: "Tank offload record added and milk volume deducted",
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
      
      // Refresh available tanks
      const event = new CustomEvent('milkOffloadCompleted');
      window.dispatchEvent(event);
      
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
              <Select 
                value={formData.tank_number} 
                onValueChange={handleTankSelection}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tank A">Tank A</SelectItem>
                  <SelectItem value="Tank B">Tank B</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="volume_offloaded">Volume to Offload (L)</Label>
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