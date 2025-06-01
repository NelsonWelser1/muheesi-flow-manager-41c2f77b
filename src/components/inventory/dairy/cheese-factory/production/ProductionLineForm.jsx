import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMilkReception } from '@/hooks/useMilkReception';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase';
import { useToast } from '@/components/ui/use-toast';

const ProductionLineForm = () => {
  const { data: milkReceptionData, isLoading: milkDataLoading } = useMilkReception();
  const [availableBatches, setAvailableBatches] = useState([]);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    batchId: '',
    fromager: '',
    cheeseType: '',
    milkVolume: '',
    milkBatchId: '',
    startTime: '',
    duration: '',
    starterCulture: '',
    starterQty: '',
    coagulantType: '',
    coagulantQty: '',
    temperature: '',
    processTime: '',
    yield: '',
    status: 'pending',
    notes: '',
  });

  // Add mutation for saving production line data
  const saveProductionLineMutation = useMutation({
    mutationFn: async (productionData) => {
      console.log('Saving production line data:', productionData);
      
      // Generate proper batch ID format for international production line
      const generateValidBatchId = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const cheeseCode = productionData.cheeseType ? productionData.cheeseType.substring(0, 3).toUpperCase() : 'CHE';
        return `INT-${year}${month}${day}-${hours}${minutes}-${cheeseCode}`;
      };

      // Map form data to database schema
      const dbData = {
        fromager_identifier: productionData.fromager,
        cheese_type: productionData.cheeseType,
        batch_id: productionData.batchId || generateValidBatchId(),
        milk_volume: parseFloat(productionData.milkVolume) || 0,
        start_time: productionData.startTime,
        estimated_duration: parseFloat(productionData.duration) || 0,
        starter_culture: productionData.starterCulture,
        starter_quantity: parseFloat(productionData.starterQty) || 0,
        coagulant_type: productionData.coagulantType,
        coagulant_quantity: parseFloat(productionData.coagulantQty) || 0,
        processing_temperature: parseFloat(productionData.temperature) || 0,
        processing_time: parseFloat(productionData.processTime) || 0,
        expected_yield: parseFloat(productionData.yield) || 0,
        status: productionData.status,
        notes: productionData.notes,
        offload_batch_id: productionData.milkBatchId,
        name: 'International Certified Standards',
        manager: 'Didier Albatini',
        description: 'Production line dedicated to international market standards and certifications'
      };

      const { data, error } = await supabase
        .from('production_line_international')
        .insert([dbData])
        .select()
        .single();

      if (error) {
        console.error('Error saving production line data:', error);
        throw error;
      }

      console.log('Successfully saved production line data:', data);
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Production line entry saved successfully!",
      });
      
      // Reset form after successful submission
      setFormData({
        batchId: '',
        fromager: '',
        cheeseType: '',
        milkVolume: '',
        milkBatchId: '',
        startTime: '',
        duration: '',
        starterCulture: '',
        starterQty: '',
        coagulantType: '',
        coagulantQty: '',
        temperature: '',
        processTime: '',
        yield: '',
        status: 'pending',
        notes: '',
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['productionLineData'] });
    },
    onError: (error) => {
      console.error('Error saving production line data:', error);
      toast({
        title: "Error",
        description: "Failed to save production line entry. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Extract unique batch numbers from milk reception data
  useEffect(() => {
    if (milkReceptionData && milkReceptionData.length > 0) {
      const batches = milkReceptionData
        .filter(record => record.tank_number || record.batch_number)
        .map(record => ({
          id: record.id,
          batchNumber: record.tank_number || record.batch_number || `Batch-${record.id}`,
          volume: record.milk_volume,
          supplier: record.supplier_name,
          quality: record.quality_score || record.quality_check,
          date: record.created_at || record.datetime
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setAvailableBatches(batches);
    }
  }, [milkReceptionData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleMilkBatchSelection = (value) => {
    const selectedBatch = availableBatches.find(batch => batch.id.toString() === value);
    setFormData(prevState => ({
      ...prevState,
      milkBatchId: value,
      milkVolume: selectedBatch ? selectedBatch.volume : '',
      // Don't set batchId here - let it be generated with proper format
    }));
  };

  const generateBatchId = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const cheeseCode = formData.cheeseType ? formData.cheeseType.substring(0, 3).toUpperCase() : 'CHE';
    return `INT-${year}${month}${day}-${hours}${minutes}-${cheeseCode}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Always generate a new batch ID for international production line
    const finalFormData = {
      ...formData,
      batchId: generateBatchId(), // Always generate new batch ID
      milkVolume: parseFloat(formData.milkVolume) || 0,
      duration: parseFloat(formData.duration) || 0,
      starterQty: parseFloat(formData.starterQty) || 0,
      coagulantQty: parseFloat(formData.coagulantQty) || 0,
      temperature: parseFloat(formData.temperature) || 0,
      processTime: parseFloat(formData.processTime) || 0,
      yield: parseFloat(formData.yield) || 0,
    };
    
    console.log('Production Line Form Data Submitted:', finalFormData);
    
    // Submit to database
    saveProductionLineMutation.mutate(finalFormData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cheese Production Line Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="batchId">Batch ID</Label>
              <Input
                type="text"
                id="batchId"
                name="batchId"
                value={formData.batchId}
                onChange={handleChange}
                placeholder="Auto-generated if empty"
              />
            </div>

            <div>
              <Label htmlFor="fromager">Fromager</Label>
              <Input
                type="text"
                id="fromager"
                name="fromager"
                value={formData.fromager}
                onChange={handleChange}
                placeholder="Enter fromager name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cheeseType">Cheese Type</Label>
              <Select onValueChange={(value) => handleSelectChange('cheeseType', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select cheese type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mozzarella">Mozzarella</SelectItem>
                  <SelectItem value="Blue Cheese">Blue Cheese</SelectItem>
                  <SelectItem value="Parmesan">Parmesan</SelectItem>
                  <SelectItem value="Cheddar">Cheddar</SelectItem>
                  <SelectItem value="Gouda">Gouda</SelectItem>
                  <SelectItem value="Feta">Feta</SelectItem>
                  <SelectItem value="Brie">Brie</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="milkBatchId">Select Milk Batch</Label>
              <Select onValueChange={handleMilkBatchSelection} disabled={milkDataLoading}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={milkDataLoading ? "Loading batches..." : "Select milk batch"} />
                </SelectTrigger>
                <SelectContent>
                  {availableBatches.map((batch) => (
                    <SelectItem key={batch.id} value={batch.id.toString()}>
                      {batch.batchNumber} - {batch.supplier} ({batch.volume}L)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="milkVolume">Milk Volume (L)</Label>
              <Input
                type="number"
                id="milkVolume"
                name="milkVolume"
                value={formData.milkVolume}
                onChange={handleChange}
                placeholder="Enter milk volume"
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Duration (hrs)</Label>
              <Input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="Enter duration in hours"
                required
              />
            </div>

            <div>
              <Label htmlFor="starterCulture">Starter Culture</Label>
              <Select onValueChange={(value) => handleSelectChange('starterCulture', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select starter culture" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mesophilic">Mesophilic</SelectItem>
                  <SelectItem value="Thermophilic">Thermophilic</SelectItem>
                  <SelectItem value="Mixed Culture">Mixed Culture</SelectItem>
                  <SelectItem value="Direct Vat Set (DVS)">Direct Vat Set (DVS)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="starterQty">Starter Qty (g)</Label>
              <Input
                type="number"
                id="starterQty"
                name="starterQty"
                value={formData.starterQty}
                onChange={handleChange}
                placeholder="Enter starter quantity"
                required
              />
            </div>

            <div>
              <Label htmlFor="coagulantType">Coagulant Type</Label>
              <Select onValueChange={(value) => handleSelectChange('coagulantType', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select coagulant type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Microbial Rennet">Microbial Rennet</SelectItem>
                  <SelectItem value="Rennet">Rennet</SelectItem>
                  <SelectItem value="Vegetable Rennet">Vegetable Rennet</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="coagulantQty">Coagulant Qty (ml)</Label>
              <Input
                type="number"
                id="coagulantQty"
                name="coagulantQty"
                value={formData.coagulantQty}
                onChange={handleChange}
                placeholder="Enter coagulant quantity"
                required
              />
            </div>

            <div>
              <Label htmlFor="temperature">Temperature (°C)</Label>
              <Input
                type="number"
                id="temperature"
                name="temperature"
                value={formData.temperature}
                onChange={handleChange}
                placeholder="Enter temperature"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="processTime">Process Time (min)</Label>
              <Input
                type="number"
                id="processTime"
                name="processTime"
                value={formData.processTime}
                onChange={handleChange}
                placeholder="Enter process time"
                required
              />
            </div>

            <div>
              <Label htmlFor="yield">Yield (kg)</Label>
              <Input
                type="number"
                id="yield"
                name="yield"
                value={formData.yield}
                onChange={handleChange}
                placeholder="Enter yield"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select onValueChange={(value) => handleSelectChange('status', value)} defaultValue="pending">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Enter any additional notes"
            />
          </div>

          <Button type="submit" className="w-full">Submit Production Line Entry</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductionLineForm;
