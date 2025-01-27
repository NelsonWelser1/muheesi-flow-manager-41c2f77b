import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    console.log('Starting form submission with data:', formData);

    try {
      const dataToSubmit = {
        supplier_name: formData.supplier_name,
        milk_volume: parseFloat(formData.milk_volume),
        temperature: parseFloat(formData.temperature),
        fat_percentage: parseFloat(formData.fat_percentage),
        protein_percentage: parseFloat(formData.protein_percentage),
        total_plate_count: parseInt(formData.total_plate_count),
        acidity: parseFloat(formData.acidity),
        notes: formData.notes,
        created_at: new Date().toISOString()
      };

      console.log('Prepared data for submission:', dataToSubmit);
      
      const result = await addMilkReception.mutateAsync(dataToSubmit);
      console.log('Submission result:', result);

      toast({
        title: "Success",
        description: "Milk reception record added successfully",
      });

      setFormData({
        supplier_name: '',
        milk_volume: '',
        temperature: '',
        fat_percentage: '',
        protein_percentage: '',
        total_plate_count: '',
        acidity: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error details:', error);
      toast({
        title: "Error",
        description: "Failed to add milk reception record: " + error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Milk Reception</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="supplier_name">Supplier Name *</Label>
            <Input
              id="supplier_name"
              name="supplier_name"
              value={formData.supplier_name}
              onChange={handleChange}
              placeholder="e.g., Dairy Farm A"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="milk_volume">Volume (L) *</Label>
            <Input
              id="milk_volume"
              name="milk_volume"
              type="number"
              value={formData.milk_volume}
              onChange={handleChange}
              placeholder="Enter volume"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="temperature">Temperature (°C) *</Label>
            <Input
              id="temperature"
              name="temperature"
              type="number"
              step="0.1"
              value={formData.temperature}
              onChange={handleChange}
              placeholder="Enter temperature"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fat_percentage">Fat Percentage (%) *</Label>
            <Input
              id="fat_percentage"
              name="fat_percentage"
              type="number"
              step="0.1"
              value={formData.fat_percentage}
              onChange={handleChange}
              placeholder="Enter fat percentage"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="protein_percentage">Protein Percentage (%) *</Label>
            <Input
              id="protein_percentage"
              name="protein_percentage"
              type="number"
              step="0.1"
              value={formData.protein_percentage}
              onChange={handleChange}
              placeholder="Enter protein percentage"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="total_plate_count">Total Plate Count *</Label>
            <Input
              id="total_plate_count"
              name="total_plate_count"
              type="number"
              value={formData.total_plate_count}
              onChange={handleChange}
              placeholder="Enter plate count"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="acidity">Acidity (pH) *</Label>
            <Input
              id="acidity"
              name="acidity"
              type="number"
              step="0.1"
              value={formData.acidity}
              onChange={handleChange}
              placeholder="Enter acidity"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add notes"
            />
          </div>
        </div>
        <Button className="mt-4" onClick={handleSubmit}>
          <Plus className="w-4 h-4 mr-2" />
          Add Reception Record
        </Button>
      </CardContent>
    </Card>
  );
};

export default MilkReceptionForm;