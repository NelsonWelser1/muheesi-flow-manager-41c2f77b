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
    quality: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!formData.supplier_name) newErrors.supplier_name = 'Supplier name is required';
    if (!formData.milk_volume) newErrors.milk_volume = 'Milk volume is required';
    if (!formData.temperature) newErrors.temperature = 'Temperature is required';
    if (!formData.fat_percentage) newErrors.fat_percentage = 'Fat percentage is required';
    if (!formData.protein_percentage) newErrors.protein_percentage = 'Protein percentage is required';
    if (!formData.total_plate_count) newErrors.total_plate_count = 'Total plate count is required';
    if (!formData.acidity) newErrors.acidity = 'Acidity is required';

    // Number validation
    if (formData.milk_volume && isNaN(parseFloat(formData.milk_volume))) {
      newErrors.milk_volume = 'Must be a valid number';
    }
    if (formData.temperature && isNaN(parseFloat(formData.temperature))) {
      newErrors.temperature = 'Must be a valid number';
    }
    if (formData.fat_percentage && isNaN(parseFloat(formData.fat_percentage))) {
      newErrors.fat_percentage = 'Must be a valid number';
    }
    if (formData.protein_percentage && isNaN(parseFloat(formData.protein_percentage))) {
      newErrors.protein_percentage = 'Must be a valid number';
    }
    if (formData.total_plate_count && isNaN(parseInt(formData.total_plate_count))) {
      newErrors.total_plate_count = 'Must be a valid number';
    }
    if (formData.acidity && isNaN(parseFloat(formData.acidity))) {
      newErrors.acidity = 'Must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async () => {
    console.log('Starting form submission with data:', formData);

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly",
        variant: "destructive",
      });
      return;
    }

    try {
      const dataToSubmit = {
        supplier_name: formData.supplier_name,
        milk_volume: parseFloat(formData.milk_volume),
        temperature: parseFloat(formData.temperature),
        fat_percentage: parseFloat(formData.fat_percentage),
        protein_percentage: parseFloat(formData.protein_percentage),
        total_plate_count: parseInt(formData.total_plate_count),
        acidity: parseFloat(formData.acidity),
        quality: formData.quality,
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
        quality: '',
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
              className={errors.supplier_name ? "border-red-500" : ""}
            />
            {errors.supplier_name && (
              <p className="text-sm text-red-500">{errors.supplier_name}</p>
            )}
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
              className={errors.milk_volume ? "border-red-500" : ""}
            />
            {errors.milk_volume && (
              <p className="text-sm text-red-500">{errors.milk_volume}</p>
            )}
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
              className={errors.temperature ? "border-red-500" : ""}
            />
            {errors.temperature && (
              <p className="text-sm text-red-500">{errors.temperature}</p>
            )}
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
              className={errors.fat_percentage ? "border-red-500" : ""}
            />
            {errors.fat_percentage && (
              <p className="text-sm text-red-500">{errors.fat_percentage}</p>
            )}
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
              className={errors.protein_percentage ? "border-red-500" : ""}
            />
            {errors.protein_percentage && (
              <p className="text-sm text-red-500">{errors.protein_percentage}</p>
            )}
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
              className={errors.total_plate_count ? "border-red-500" : ""}
            />
            {errors.total_plate_count && (
              <p className="text-sm text-red-500">{errors.total_plate_count}</p>
            )}
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
              className={errors.acidity ? "border-red-500" : ""}
            />
            {errors.acidity && (
              <p className="text-sm text-red-500">{errors.acidity}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="quality">Quality</Label>
            <Input
              id="quality"
              name="quality"
              value={formData.quality}
              onChange={handleChange}
              placeholder="Enter quality grade"
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