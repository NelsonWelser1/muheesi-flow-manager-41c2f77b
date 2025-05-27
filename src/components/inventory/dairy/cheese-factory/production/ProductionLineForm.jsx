import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase';
import { useMilkReception } from '@/hooks/useMilkReception';

const ProductionLineForm = () => {
  const [formData, setFormData] = useState({
    batch_id: '',
    fromager_identifier: '',
    cheese_type: '',
    offload_batch_id: '',
    milk_volume: '',
    start_time: '',
    estimated_duration: '',
    starter_culture: '',
    starter_quantity: '',
    coagulant_type: '',
    coagulant_quantity: '',
    processing_temperature: '',
    processing_time: '',
    expected_yield: '',
    status: 'pending',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [availableBatches, setAvailableBatches] = useState([]);
  const { toast } = useToast();
  const { data: milkReceptionData, refetch } = useMilkReception();

  // Fetch available milk offload batches
  useEffect(() => {
    const fetchOffloadBatches = () => {
      if (!milkReceptionData || milkReceptionData.length === 0) {
        console.log('No milk reception data available');
        setAvailableBatches([]);
        return;
      }

      console.log('Processing milk reception data for offload batches:', milkReceptionData);

      // Filter for offload records with proper batch IDs
      const offloadBatches = milkReceptionData
        .filter(record => {
          // Check if this is an offload record
          const isOffloadRecord = 
            (record.milk_volume && Number(record.milk_volume) < 0) || // Negative volume from milk_reception
            (record.volume_offloaded && Number(record.volume_offloaded) > 0) || // Positive volume from milk_tank_offloads
            (record.supplier_name && record.supplier_name.includes('Offload from'));

          // Must have a valid batch_id and not be a legacy record
          const hasValidBatchId = record.batch_id && !record.batch_id.startsWith('LEGACY-');

          console.log('Record filter check:', {
            id: record.id,
            isOffloadRecord,
            hasValidBatchId,
            batch_id: record.batch_id,
            milk_volume: record.milk_volume,
            volume_offloaded: record.volume_offloaded
          });

          return isOffloadRecord && hasValidBatchId;
        })
        .map(record => ({
          batch_id: record.batch_id,
          tank_number: record.storage_tank || record.tank_number || 'Unknown',
          volume: Math.abs(record.volume_offloaded || record.milk_volume || 0),
          created_at: record.created_at,
          destination: record.destination || 'Unknown'
        }))
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Most recent first

      console.log('Available offload batches:', offloadBatches);
      setAvailableBatches(offloadBatches);
    };

    fetchOffloadBatches();
  }, [milkReceptionData]);

  // Generate batch ID when cheese type changes
  useEffect(() => {
    if (formData.cheese_type) {
      const generateBatchId = () => {
        const now = new Date();
        const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
        const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '');
        const cheeseCode = formData.cheese_type.substring(0, 3).toUpperCase();
        return `INT${dateStr}-${cheeseCode}-${timeStr}`;
      };

      const batchId = generateBatchId();
      console.log(`Generating batch ID for cheese type: ${formData.cheese_type}`);
      console.log(`Generated batch ID: ${batchId}`);
      
      setFormData(prev => ({
        ...prev,
        batch_id: batchId
      }));
    }
  }, [formData.cheese_type]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('cheese_production')
        .insert([{
          ...formData,
          milk_volume: parseFloat(formData.milk_volume),
          starter_quantity: parseFloat(formData.starter_quantity),
          coagulant_quantity: parseFloat(formData.coagulant_quantity),
          processing_temperature: parseFloat(formData.processing_temperature),
          processing_time: parseFloat(formData.processing_time),
          expected_yield: parseFloat(formData.expected_yield),
          estimated_duration: parseFloat(formData.estimated_duration)
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Production record created successfully",
      });

      // Reset form
      setFormData({
        batch_id: '',
        fromager_identifier: '',
        cheese_type: '',
        offload_batch_id: '',
        milk_volume: '',
        start_time: '',
        estimated_duration: '',
        starter_culture: '',
        starter_quantity: '',
        coagulant_type: '',
        coagulant_quantity: '',
        processing_temperature: '',
        processing_time: '',
        expected_yield: '',
        status: 'pending',
        notes: ''
      });

    } catch (error) {
      console.error('Error creating production record:', error);
      toast({
        title: "Error",
        description: "Failed to create production record",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Cheese Production Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fromager_identifier">Fromager Identifier</Label>
            <Input 
              type="text" 
              id="fromager_identifier" 
              name="fromager_identifier"
              value={formData.fromager_identifier}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="cheese_type">Cheese Type</Label>
            <Input 
              type="text" 
              id="cheese_type" 
              name="cheese_type"
              value={formData.cheese_type}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <Label htmlFor="offload_batch_id">Select Milk Offload Batch</Label>
            <Select 
              value={formData.offload_batch_id} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, offload_batch_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an offload batch" />
              </SelectTrigger>
              <SelectContent>
                {availableBatches.length === 0 ? (
                  <SelectItem value="no-batches" disabled>
                    No offload batches available
                  </SelectItem>
                ) : (
                  availableBatches.map((batch) => (
                    <SelectItem key={batch.batch_id} value={batch.batch_id}>
                      {batch.batch_id} - {batch.tank_number} ({batch.volume}L) - {batch.destination}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {availableBatches.length === 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                No milk offload batches found. Create offload records first.
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="milk_volume">Milk Volume (L)</Label>
            <Input 
              type="number" 
              id="milk_volume" 
              name="milk_volume"
              value={formData.milk_volume}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="start_time">Start Time</Label>
            <Input 
              type="datetime-local" 
              id="start_time" 
              name="start_time"
              value={formData.start_time}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="estimated_duration">Estimated Duration (hrs)</Label>
            <Input 
              type="number" 
              id="estimated_duration" 
              name="estimated_duration"
              value={formData.estimated_duration}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="starter_culture">Starter Culture</Label>
            <Input 
              type="text" 
              id="starter_culture" 
              name="starter_culture"
              value={formData.starter_culture}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="starter_quantity">Starter Quantity (g)</Label>
            <Input 
              type="number" 
              id="starter_quantity" 
              name="starter_quantity"
              value={formData.starter_quantity}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="coagulant_type">Coagulant Type</Label>
            <Input 
              type="text" 
              id="coagulant_type" 
              name="coagulant_type"
              value={formData.coagulant_type}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="coagulant_quantity">Coagulant Quantity (ml)</Label>
            <Input 
              type="number" 
              id="coagulant_quantity" 
              name="coagulant_quantity"
              value={formData.coagulant_quantity}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="processing_temperature">Processing Temperature (°C)</Label>
            <Input 
              type="number" 
              id="processing_temperature" 
              name="processing_temperature"
              value={formData.processing_temperature}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="processing_time">Processing Time (min)</Label>
            <Input 
              type="number" 
              id="processing_time" 
              name="processing_time"
              value={formData.processing_time}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="expected_yield">Expected Yield (kg)</Label>
            <Input 
              type="number" 
              id="expected_yield" 
              name="expected_yield"
              value={formData.expected_yield}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea 
              id="notes" 
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating..." : "Create Production Record"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductionLineForm;
