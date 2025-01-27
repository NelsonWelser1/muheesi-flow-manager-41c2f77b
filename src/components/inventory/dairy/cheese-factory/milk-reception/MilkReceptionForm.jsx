import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useMilkReception } from '@/hooks/useMilkReception';

const MilkReceptionForm = () => {
  const { toast } = useToast();
  const { addMilkReception } = useMilkReception();
  const [formData, setFormData] = useState({
    supplier_name: '',
    milk_volume: '',
    temperature: '',
    fat_percentage: '',
    protein_percentage: '',
    total_plate_count: '',
    acidity: '',
    quality_score: '',
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
    console.log('Setting quality score to:', value);
    setFormData(prev => ({
      ...prev,
      quality_score: value
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      'supplier_name',
      'milk_volume',
      'temperature',
      'fat_percentage',
      'protein_percentage',
      'total_plate_count',
      'acidity',
      'quality_score'
    ];

    const errors = [];
    requiredFields.forEach(field => {
      if (!formData[field]) {
        errors.push(`${field.replace('_', ' ')} is required`);
      }
    });

    // Validate numeric fields
    const numericFields = [
      'milk_volume',
      'temperature',
      'fat_percentage',
      'protein_percentage',
      'total_plate_count',
      'acidity'
    ];

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
        milk_volume: parseFloat(formData.milk_volume),
        temperature: parseFloat(formData.temperature),
        fat_percentage: parseFloat(formData.fat_percentage),
        protein_percentage: parseFloat(formData.protein_percentage),
        total_plate_count: parseInt(formData.total_plate_count),
        acidity: parseFloat(formData.acidity),
        quality_score: formData.quality_score // Keep as string
      };

      console.log('Submitting data:', dataToSubmit);
      const result = await addMilkReception.mutateAsync(dataToSubmit);
      console.log('Submission result:', result);

      if (result) {
        toast({
          title: "Success",
          description: "Milk reception record added successfully",
        });

        // Reset form after successful submission
        setFormData({
          supplier_name: '',
          milk_volume: '',
          temperature: '',
          fat_percentage: '',
          protein_percentage: '',
          total_plate_count: '',
          acidity: '',
          quality_score: '',
          notes: ''
        });
      } else {
        throw new Error('Failed to add record');
      }
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
        <CardTitle>New Milk Reception Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
                step="0.1"
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
                step="0.1"
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
                step="0.1"
                value={formData.acidity}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quality_score">Quality Score</Label>
              <Select 
                value={formData.quality_score} 
                onValueChange={handleQualityChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select quality score" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Grade A">Grade A</SelectItem>
                  <SelectItem value="Grade B">Grade B</SelectItem>
                  <SelectItem value="Grade C">Grade C</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
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
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MilkReceptionForm;