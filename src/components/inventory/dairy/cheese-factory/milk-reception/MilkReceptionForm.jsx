import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useMilkReception } from '@/hooks/useMilkReception';

const MilkReceptionForm = () => {
  const { toast } = useToast();
  const { addMilkReception } = useMilkReception();
  console.log('Rendering MilkReceptionForm');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);

    try {
      const dataToSubmit = {
        ...formData,
        milk_volume: parseFloat(formData.milk_volume),
        temperature: parseFloat(formData.temperature),
        fat_percentage: parseFloat(formData.fat_percentage),
        protein_percentage: parseFloat(formData.protein_percentage),
        total_plate_count: parseInt(formData.total_plate_count),
        acidity: parseFloat(formData.acidity),
        quality_score: Math.floor(Math.random() * 100) + 1,
        created_at: new Date().toISOString()
      };

      console.log('Submitting to Supabase:', dataToSubmit);
      
      await addMilkReception.mutateAsync(dataToSubmit);

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
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Failed to add milk reception record",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Milk Reception</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="supplier_name">Supplier Name</Label>
            <Input
              id="supplier_name"
              name="supplier_name"
              value={formData.supplier_name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="milk_volume">Volume (L)</Label>
            <Input
              id="milk_volume"
              name="milk_volume"
              type="number"
              step="0.1"
              value={formData.milk_volume}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="temperature">Temperature (°C)</Label>
            <Input
              id="temperature"
              name="temperature"
              type="number"
              step="0.1"
              value={formData.temperature}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="fat_percentage">Fat Percentage (%)</Label>
            <Input
              id="fat_percentage"
              name="fat_percentage"
              type="number"
              step="0.1"
              value={formData.fat_percentage}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="protein_percentage">Protein Percentage (%)</Label>
            <Input
              id="protein_percentage"
              name="protein_percentage"
              type="number"
              step="0.1"
              value={formData.protein_percentage}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="total_plate_count">Total Plate Count</Label>
            <Input
              id="total_plate_count"
              name="total_plate_count"
              type="number"
              value={formData.total_plate_count}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="acidity">Acidity</Label>
            <Input
              id="acidity"
              name="acidity"
              type="number"
              step="0.1"
              value={formData.acidity}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <Button 
            type="submit" 
            disabled={addMilkReception.isPending}
            className="w-full"
          >
            {addMilkReception.isPending ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MilkReceptionForm;
