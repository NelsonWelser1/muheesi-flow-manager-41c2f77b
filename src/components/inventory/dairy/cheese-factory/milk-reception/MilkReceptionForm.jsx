import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useMilkReception } from '@/hooks/useMilkReception';

const MilkReceptionForm = () => {
  const { toast } = useToast();
  const { addMilkReception } = useMilkReception();
  const [formData, setFormData] = useState({
    supplier_name: '',
    milk_volume: '',
    temperature: '',
    quality_score: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const numericData = {
        ...formData,
        milk_volume: parseFloat(formData.milk_volume),
        temperature: parseFloat(formData.temperature),
        quality_score: parseInt(formData.quality_score),
        fat_percentage: parseFloat(formData.fat_percentage),
        protein_percentage: parseFloat(formData.protein_percentage),
        total_plate_count: parseInt(formData.total_plate_count),
        acidity: parseFloat(formData.acidity),
        datetime: new Date().toISOString()
      };

      await addMilkReception.mutateAsync(numericData);
      
      toast({
        title: "Success",
        description: "Milk reception record added successfully",
      });

      setFormData({
        supplier_name: '',
        milk_volume: '',
        temperature: '',
        quality_score: '',
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Milk Reception Record</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplier_name">Supplier Name</Label>
              <Input
                id="supplier_name"
                name="supplier_name"
                value={formData.supplier_name}
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quality_score">Quality Score</Label>
              <Input
                id="quality_score"
                name="quality_score"
                type="number"
                min="0"
                max="100"
                value={formData.quality_score}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fat_percentage">Fat Percentage</Label>
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

            <div className="space-y-2">
              <Label htmlFor="protein_percentage">Protein Percentage</Label>
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

            <div className="space-y-2">
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

            <div className="space-y-2">
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any additional notes here..."
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={addMilkReception.isPending}
          >
            {addMilkReception.isPending ? 'Adding...' : 'Add Record'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MilkReceptionForm;