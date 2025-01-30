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
    supplier_name: '',
    milk_volume: '',
    temperature: '',
    fat_percentage: '',
    protein_percentage: '',
    total_plate_count: '',
    acidity: '',
    destination: '',
    quality_check: 'Pass',
    notes: ''
  });

  const handleTankSelection = (tankValue) => {
    console.log('Selected tank:', tankValue);
    setFormData(prev => ({
      ...prev,
      tank_number: tankValue
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input changed - ${name}:`, value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    console.log('Validating form with data:', formData);
    const errors = [];
    const requiredFields = [
      'tank_number', 'supplier_name', 'milk_volume', 'temperature',
      'fat_percentage', 'protein_percentage', 'total_plate_count', 'acidity',
      'destination'
    ];

    requiredFields.forEach(field => {
      if (!formData[field]) {
        errors.push(`${field.replace('_', ' ')} is required`);
      }
    });

    const tankMilk = milkReceptionData?.filter(record => 
      record.tank_number === formData.tank_number
    ).reduce((total, record) => total + record.milk_volume, 0) || 0;

    console.log('Available milk in tank:', tankMilk);
    if (parseFloat(formData.milk_volume) > tankMilk) {
      errors.push(`Not enough milk in ${formData.tank_number}. Available: ${tankMilk}L`);
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Starting form submission with data:', formData);

    const errors = validateForm();
    if (errors.length > 0) {
      console.log('Validation errors:', errors);
      toast({
        title: "Validation Error",
        description: errors.join(', '),
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Recording milk tank offload...');
      const { data: offloadData, error: offloadError } = await supabase
        .from('milk_tank_offloads')
        .insert([{
          tank_number: formData.tank_number,
          supplier_name: formData.supplier_name,
          milk_volume: parseFloat(formData.milk_volume),
          temperature: parseFloat(formData.temperature),
          fat_percentage: parseFloat(formData.fat_percentage),
          protein_percentage: parseFloat(formData.protein_percentage),
          total_plate_count: parseInt(formData.total_plate_count),
          acidity: parseFloat(formData.acidity),
          destination: formData.destination,
          quality_check: formData.quality_check,
          notes: formData.notes,
          offload_date: new Date().toISOString(),
          created_at: new Date().toISOString()
        }])
        .select();

      if (offloadError) {
        console.error('Error in milk tank offload:', offloadError);
        throw offloadError;
      }

      console.log('Successfully recorded milk tank offload:', offloadData);

      toast({
        title: "Success",
        description: "Tank offload record added successfully",
      });

      setFormData({
        tank_number: '',
        supplier_name: '',
        milk_volume: '',
        temperature: '',
        fat_percentage: '',
        protein_percentage: '',
        total_plate_count: '',
        acidity: '',
        destination: '',
        quality_check: 'Pass',
        notes: ''
      });

      await refetchMilkReception();
      window.dispatchEvent(new CustomEvent('milkOffloadCompleted'));

    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "An error occurred while submitting the form",
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
              <Label htmlFor="tank_number">Storage Tank</Label>
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
              <Label htmlFor="quality_check">Quality Check</Label>
              <Select 
                value={formData.quality_check} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, quality_check: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select quality check" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pass">Pass</SelectItem>
                  <SelectItem value="Fail">Fail</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier_name">Supplier Name</Label>
              <Input
                id="supplier_name"
                name="supplier_name"
                value={formData.supplier_name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="milk_volume">Milk Volume (L)</Label>
              <Input
                id="milk_volume"
                name="milk_volume"
                type="number"
                step="0.01"
                value={formData.milk_volume}
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
              <Label htmlFor="fat_percentage">Fat Percentage (%)</Label>
              <Input
                id="fat_percentage"
                name="fat_percentage"
                type="number"
                step="0.01"
                value={formData.fat_percentage}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="protein_percentage">Protein Percentage (%)</Label>
              <Input
                id="protein_percentage"
                name="protein_percentage"
                type="number"
                step="0.01"
                value={formData.protein_percentage}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="total_plate_count">Total Plate Count</Label>
              <Input
                id="total_plate_count"
                name="total_plate_count"
                type="number"
                value={formData.total_plate_count}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="acidity">Acidity (pH)</Label>
              <Input
                id="acidity"
                name="acidity"
                type="number"
                step="0.01"
                value={formData.acidity}
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
