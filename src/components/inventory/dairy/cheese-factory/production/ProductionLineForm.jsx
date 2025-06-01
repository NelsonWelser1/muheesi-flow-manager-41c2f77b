
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProductionLineForm = ({ productionLine }) => {
  const [formData, setFormData] = useState({
    fromagerIdentifier: '',
    cheeseType: '',
    batchId: '',
    milkVolume: '',
    startTime: new Date().toISOString().slice(0, 16),
    estimatedDuration: '',
    starterCulture: '',
    starterQty: '',
    coagulantType: '',
    coagulantQty: '',
    temperature: '',
    processTime: '',
    yield: '',
    notes: '',
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch initial data or defaults based on productionLine
  useEffect(() => {
    if (productionLine) {
      setFormData(prev => ({
        ...prev,
        fromagerIdentifier: 'Default Fromager', // Set default or fetch from user context
      }));
    }
  }, [productionLine]);

  // Mutation to handle form submission
  const mutation = useMutation({
    mutationFn: async (data) => {
      console.log('Submitting data to Supabase:', data);
      const { data: insertData, error } = await supabase
        .from('production_line_international')
        .insert([data]);

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message);
      }
      return insertData;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Production line record added successfully",
      });
      queryClient.invalidateQueries(['production-line-data']); // Invalidate cache
      resetForm();
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add production line record",
        variant: "destructive",
      });
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateBatchId = () => {
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      
      // Format: INT{YYYYMMDD}-{XXX}-{HHMMSS} to match constraint ^INT\d{8}-[A-Z]{3}-\d{6}$
      const dateStr = `${year}${month}${day}`; // 8 digits
      const timeStr = `${hours}${minutes}${seconds}`; // 6 digits
      
      // Get cheese type prefix
      const cheeseTypeMap = {
        'Mozzarella': 'MOZ',
        'Cheddar': 'CHE',
        'Gouda': 'GOU',
        'Swiss': 'SWI',
        'Parmesan': 'PAR'
      };
      
      const typePrefix = cheeseTypeMap[formData.cheeseType] || 'GEN';
      
      const batchId = `INT${dateStr}-${typePrefix}-${timeStr}`;
      console.log('Generated batch ID:', batchId);
      return batchId;
    } catch (error) {
      console.error('Error generating batch ID:', error);
      return `INT${new Date().getFullYear()}0101-GEN-000000`; // Fallback
    }
  };

  const resetForm = () => {
    setFormData({
      fromagerIdentifier: '',
      cheeseType: '',
      batchId: '',
      milkVolume: '',
      startTime: new Date().toISOString().slice(0, 16),
      estimatedDuration: '',
      starterCulture: '',
      starterQty: '',
      coagulantType: '',
      coagulantQty: '',
      temperature: '',
      processTime: '',
      yield: '',
      notes: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    try {
      // Always generate a new batch ID for international production line with correct format
      const finalFormData = {
        fromager_identifier: formData.fromagerIdentifier,
        cheese_type: formData.cheeseType,
        batch_id: generateBatchId(), // Generate batch ID matching database constraint
        milk_volume: parseFloat(formData.milkVolume) || 0,
        start_time: new Date(formData.startTime).toISOString(),
        estimated_duration: parseInt(formData.estimatedDuration) || 0,
        starter_culture: formData.starterCulture,
        starter_quantity: parseFloat(formData.starterQty) || 0,
        coagulant_type: formData.coagulantType,
        coagulant_quantity: parseFloat(formData.coagulantQty) || 0,
        processing_temperature: parseFloat(formData.temperature) || 0,
        processing_time: parseInt(formData.processTime) || 0,
        expected_yield: parseFloat(formData.yield) || 0,
        notes: formData.notes,
      };

      console.log('Production Line Form Data Submitted:', finalFormData);
      mutation.mutate(finalFormData);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: "Error",
        description: "Failed to prepare form data for submission",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Production Line Form - {productionLine?.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fromagerIdentifier">Fromager Identifier</Label>
              <Input
                type="text"
                id="fromagerIdentifier"
                name="fromagerIdentifier"
                value={formData.fromagerIdentifier}
                onChange={handleChange}
                placeholder="Enter Fromager Identifier"
                required
              />
            </div>

            <div>
              <Label htmlFor="cheeseType">Cheese Type</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, cheeseType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select cheese type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mozzarella">Mozzarella</SelectItem>
                  <SelectItem value="Cheddar">Cheddar</SelectItem>
                  <SelectItem value="Gouda">Gouda</SelectItem>
                  <SelectItem value="Swiss">Swiss</SelectItem>
                  <SelectItem value="Parmesan">Parmesan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="batchId">Batch ID</Label>
              <Input
                type="text"
                id="batchId"
                name="batchId"
                value={formData.batchId}
                readOnly // Batch ID is auto-generated
                placeholder="Batch ID (Auto-generated)"
              />
            </div>

            <div>
              <Label htmlFor="milkVolume">Milk Volume (L)</Label>
              <Input
                type="number"
                id="milkVolume"
                name="milkVolume"
                value={formData.milkVolume}
                onChange={handleChange}
                placeholder="Enter Milk Volume"
                required
              />
            </div>

            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                type="datetime-local"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="estimatedDuration">Estimated Duration (minutes)</Label>
              <Input
                type="number"
                id="estimatedDuration"
                name="estimatedDuration"
                value={formData.estimatedDuration}
                onChange={handleChange}
                placeholder="Enter Estimated Duration"
                required
              />
            </div>

            <div>
              <Label htmlFor="starterCulture">Starter Culture</Label>
              <Input
                type="text"
                id="starterCulture"
                name="starterCulture"
                value={formData.starterCulture}
                onChange={handleChange}
                placeholder="Enter Starter Culture"
                required
              />
            </div>

            <div>
              <Label htmlFor="starterQty">Starter Quantity (g)</Label>
              <Input
                type="number"
                id="starterQty"
                name="starterQty"
                value={formData.starterQty}
                onChange={handleChange}
                placeholder="Enter Starter Quantity"
                required
              />
            </div>

            <div>
              <Label htmlFor="coagulantType">Coagulant Type</Label>
              <Input
                type="text"
                id="coagulantType"
                name="coagulantType"
                value={formData.coagulantType}
                onChange={handleChange}
                placeholder="Enter Coagulant Type"
                required
              />
            </div>

            <div>
              <Label htmlFor="coagulantQty">Coagulant Quantity (ml)</Label>
              <Input
                type="number"
                id="coagulantQty"
                name="coagulantQty"
                value={formData.coagulantQty}
                onChange={handleChange}
                placeholder="Enter Coagulant Quantity"
                required
              />
            </div>

            <div>
              <Label htmlFor="temperature">Processing Temperature (°C)</Label>
              <Input
                type="number"
                id="temperature"
                name="temperature"
                value={formData.temperature}
                onChange={handleChange}
                placeholder="Enter Processing Temperature"
                required
              />
            </div>

            <div>
              <Label htmlFor="processTime">Processing Time (minutes)</Label>
              <Input
                type="number"
                id="processTime"
                name="processTime"
                value={formData.processTime}
                onChange={handleChange}
                placeholder="Enter Processing Time"
                required
              />
            </div>

            <div>
              <Label htmlFor="yield">Expected Yield (kg)</Label>
              <Input
                type="number"
                id="yield"
                name="yield"
                value={formData.yield}
                onChange={handleChange}
                placeholder="Enter Expected Yield"
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
              placeholder="Enter any additional notes"
            />
          </div>

          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? 'Submitting...' : 'Submit Record'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductionLineForm;
