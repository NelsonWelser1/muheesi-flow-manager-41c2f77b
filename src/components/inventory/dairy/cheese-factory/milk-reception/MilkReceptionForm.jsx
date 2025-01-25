import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useMilkReception } from '@/hooks/useMilkReception';
import { useSupabaseAuth } from '@/integrations/supabase/auth';

const MilkReceptionForm = () => {
  const { toast } = useToast();
  const { data, isLoading, error, addMilkReception } = useMilkReception();
  const { session } = useSupabaseAuth();
  
  console.log('MilkReceptionForm rendered with:', { data, isLoading, error, addMilkReception });

  const [formData, setFormData] = useState({
    supplier_name: '',
    milk_type: '',
    quantity: '',
    fat_content: '',
    protein_content: '',
    temperature: '',
    acidity: '',
    density: '',
    notes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);

    if (!session) {
      console.error('No active session found');
      toast({
        title: "Authentication Error",
        description: "You must be logged in to submit records",
        variant: "destructive"
      });
      return;
    }

    if (!addMilkReception) {
      console.error('Milk reception mutation is not available');
      toast({
        title: "Error",
        description: "System error: Mutation not available",
        variant: "destructive"
      });
      return;
    }

    try {
      // Convert string values to numbers where needed
      const numericData = {
        ...formData,
        quantity: parseFloat(formData.quantity),
        fat_content: parseFloat(formData.fat_content),
        protein_content: parseFloat(formData.protein_content),
        temperature: parseFloat(formData.temperature),
        acidity: parseFloat(formData.acidity),
        density: parseFloat(formData.density),
        user_id: session.user.id,
        created_at: new Date().toISOString(),
        datetime: new Date().toISOString()
      };

      await addMilkReception.mutateAsync(numericData);
      
      console.log('Successfully submitted milk reception data');
      
      // Reset form after successful submission
      setFormData({
        supplier_name: '',
        milk_type: '',
        quantity: '',
        fat_content: '',
        protein_content: '',
        temperature: '',
        acidity: '',
        density: '',
        notes: ''
      });

      toast({
        title: "Success",
        description: "Milk reception record added successfully",
      });
    } catch (error) {
      console.error('Error submitting milk reception data:', error);
      toast({
        title: "Error",
        description: "Failed to add milk reception record",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Milk Reception Record</CardTitle>
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
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="milk_type">Milk Type</Label>
              <Input
                id="milk_type"
                name="milk_type"
                value={formData.milk_type}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity (Liters)</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                step="0.01"
                value={formData.quantity}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fat_content">Fat Content (%)</Label>
              <Input
                id="fat_content"
                name="fat_content"
                type="number"
                step="0.01"
                value={formData.fat_content}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="protein_content">Protein Content (%)</Label>
              <Input
                id="protein_content"
                name="protein_content"
                type="number"
                step="0.01"
                value={formData.protein_content}
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
              <Label htmlFor="density">Density (g/ml)</Label>
              <Input
                id="density"
                name="density"
                type="number"
                step="0.001"
                value={formData.density}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={addMilkReception?.isPending}
          >
            {addMilkReception?.isPending ? 'Adding...' : 'Add Record'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MilkReceptionForm;