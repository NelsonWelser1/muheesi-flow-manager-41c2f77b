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
import { useToast } from "@/components/ui/use-toast";

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

  // Mutation to save production line data
  const saveProductionLineMutation = useMutation({
    mutationFn: async (productionData) => {
      console.log('Saving production line data:', productionData);
      const { data, error } = await supabase
        .from('cheese_production_line')
        .insert([productionData])
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
      // Reset form
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
      // Invalidate relevant queries
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
      batchId: selectedBatch ? selectedBatch.batchNumber : ''
    }));
  };

  const generateBatchId = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000);
    return `INT${year}${month}${day}-${formData.cheeseType.substring(0, 3).toUpperCase()}-${random}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Generate batch ID if not provided
    const finalFormData = {
      ...formData,
      batchId: formData.batchId || generateBatchId(),
      milkVolume: parseFloat(formData.milkVolume) || 0,
      duration: parseFloat(formData.duration) || 0,
      starterQty: parseFloat(formData.starterQty) || 0,
      coagulantQty: parseFloat(formData.coagulantQty) || 0,
      temperature: parseFloat(formData.temperature) || 0,
      processTime: parseFloat(formData.processTime) || 0,
      yield: parseFloat(formData.yield) || 0,
    };
    
    console.log('Production Line Form Data Submitted:', finalFormData);
    
    // Save to database
    saveProductionLineMutation.mutate(finalFormData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cheese Production Line Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
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
                  <SelectItem value="cheddar">Cheddar</SelectItem>
                  <SelectItem value="gouda">Gouda</SelectItem>
                  <SelectItem value="mozzarella">Mozzarella</SelectItem>
                  <SelectItem value="swiss">Swiss</SelectItem>
                  <SelectItem value="brie">Brie</SelectItem>
                  <SelectItem value="camembert">Camembert</SelectItem>
                  <SelectItem value="parmesan">Parmesan</SelectItem>
                  <SelectItem value="blue">Blue Cheese</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="milkBatchId">Milk Batch</Label>
              <Select onValueChange={handleMilkBatchSelection}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select milk batch" />
                </SelectTrigger>
                <SelectContent>
                  {availableBatches.length > 0 ? (
                    availableBatches.map((batch) => (
                      <SelectItem key={batch.id} value={batch.id.toString()}>
                        {batch.batchNumber} - {batch.volume}L ({batch.supplier})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-batches" disabled>
                      {milkDataLoading ? 'Loading batches...' : 'No batches available'}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Production Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="milkVolume">Milk Volume (L)</Label>
              <Input
                type="number"
                id="milkVolume"
                name="milkVolume"
                value={formData.milkVolume}
                onChange={handleChange}
                placeholder="Enter volume"
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
              <Label htmlFor="duration">Duration (hours)</Label>
              <Input
                type="number"
                step="0.1"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="Enter duration"
                required
              />
            </div>
          </div>

          {/* Additives */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="starterCulture">Starter Culture</Label>
              <Input
                type="text"
                id="starterCulture"
                name="starterCulture"
                value={formData.starterCulture}
                onChange={handleChange}
                placeholder="Enter starter culture type"
                required
              />
            </div>

            <div>
              <Label htmlFor="starterQty">Starter Quantity (g)</Label>
              <Input
                type="number"
                step="0.1"
                id="starterQty"
                name="starterQty"
                value={formData.starterQty}
                onChange={handleChange}
                placeholder="Enter quantity"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="coagulantType">Coagulant Type</Label>
              <Select onValueChange={(value) => handleSelectChange('coagulantType', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select coagulant type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rennet">Rennet</SelectItem>
                  <SelectItem value="microbial">Microbial</SelectItem>
                  <SelectItem value="vegetable">Vegetable</SelectItem>
                  <SelectItem value="calcium_chloride">Calcium Chloride</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="coagulantQty">Coagulant Quantity (ml)</Label>
              <Input
                type="number"
                step="0.1"
                id="coagulantQty"
                name="coagulantQty"
                value={formData.coagulantQty}
                onChange={handleChange}
                placeholder="Enter quantity"
                required
              />
            </div>
          </div>

          {/* Process Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="temperature">Temperature (°C)</Label>
              <Input
                type="number"
                step="0.1"
                id="temperature"
                name="temperature"
                value={formData.temperature}
                onChange={handleChange}
                placeholder="Enter temperature"
                required
              />
            </div>

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
              <Label htmlFor="yield">Yield (%)</Label>
              <Input
                type="number"
                step="0.1"
                id="yield"
                name="yield"
                value={formData.yield}
                onChange={handleChange}
                placeholder="Enter yield percentage"
              />
            </div>
          </div>

          {/* Status and Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={(value) => handleSelectChange('status', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Enter any additional notes"
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={saveProductionLineMutation.isPending}
          >
            {saveProductionLineMutation.isPending ? 'Submitting...' : 'Submit Production Line Entry'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductionLineForm;
