import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/supabase';

const CultureAdditionForm = () => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  const { toast } = useToast();
  const [availableBatches, setAvailableBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAvailableBatches = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('milk_batches')
        .select('*')
        .eq('processing_stage', 'pasteurized')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching available batches:", error);
        toast({
          title: "Error",
          description: "Failed to fetch available milk batches",
          variant: "destructive"
        });
        return;
      }

      setAvailableBatches(data);
    } catch (error) {
      console.error("Unexpected error fetching available batches:", error);
      toast({
        title: "Error",
        description: "Failed to fetch available milk batches",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableBatches();
  }, []);

  const handleBatchSelect = (batchId) => {
    const selected = availableBatches.find(b => b.batch_id === batchId);
    if (selected) {
      setSelectedBatch(selected);
      setValue("batch_id", selected.batch_id);
      toast({
        title: "Batch Selected",
        description: `Selected batch: ${selected.batch_id}`
      });
    }
  };

  const onSubmit = async (data) => {
    try {
      console.log("Submitting culture addition data to Supabase:", data);

      const { error } = await supabase
        .from('yogurt_culture_addition')
        .insert([data]);

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Culture addition has been successfully recorded"
      });
      reset();
      setSelectedBatch(null);
    } catch (error) {
      console.error("Error submitting data:", error);
      toast({
        title: "Error",
        description: "Failed to submit culture addition. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Culture Addition</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="batch_selection">Select Milk Batch</Label>
            <Select onValueChange={handleBatchSelect} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder={isLoading ? "Loading batches..." : "Select a batch"} />
              </SelectTrigger>
              <SelectContent>
                {availableBatches.map((batch) => (
                  <SelectItem key={batch.batch_id} value={batch.batch_id}>
                    {batch.batch_id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="culture_type">Culture Type</Label>
            <Input
              id="culture_type"
              placeholder="Enter culture type"
              {...register("culture_type", { required: "Culture type is required" })}
            />
            {errors.culture_type && (
              <p className="text-sm text-red-500">{errors.culture_type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity_added">Quantity Added (ml)</Label>
            <Input
              id="quantity_added"
              type="number"
              placeholder="Enter quantity added"
              {...register("quantity_added", {
                required: "Quantity added is required",
                valueAsNumber: true
              })}
            />
            {errors.quantity_added && (
              <p className="text-sm text-red-500">{errors.quantity_added.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="addition_time">Addition Time</Label>
            <Input
              type="datetime-local"
              id="addition_time"
              {...register("addition_time", { required: "Addition time is required" })}
            />
            {errors.addition_time && (
              <p className="text-sm text-red-500">{errors.addition_time.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes"
              {...register("notes")}
            />
          </div>

          <Button type="submit" disabled={isLoading}>
            Submit Culture Addition
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CultureAdditionForm;
