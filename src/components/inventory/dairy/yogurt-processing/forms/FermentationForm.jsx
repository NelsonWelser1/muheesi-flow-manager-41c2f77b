
import React from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/supabase';

const FermentationForm = () => {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      const { error } = await supabase
        .from('yogurt_fermentation')
        .insert([{
          ...data,
          ph_readings: JSON.stringify([{ time: new Date().toISOString(), ph: data.ph_reading }]),
          operator_id: 'current-user-id', // Replace with actual user ID from auth context
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Fermentation record added successfully",
      });

      reset();
    } catch (error) {
      console.error('Error submitting fermentation data:', error);
      toast({
        title: "Error",
        description: "Failed to add fermentation record",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fermentation Process</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="batch_id">Batch ID</Label>
              <Input
                {...register('batch_id', { required: true })}
                placeholder="Enter batch ID"
              />
            </div>

            <div>
              <Label htmlFor="start_date_time">Start Date & Time</Label>
              <Input
                type="datetime-local"
                {...register('start_date_time', { required: true })}
              />
            </div>

            <div>
              <Label htmlFor="target_temp">Target Temperature (°C)</Label>
              <Input
                type="number"
                step="0.1"
                {...register('target_temp', { required: true })}
              />
            </div>

            <div>
              <Label htmlFor="ph_reading">pH Reading</Label>
              <Input
                type="number"
                step="0.01"
                {...register('ph_reading', { required: true })}
              />
            </div>

            <div>
              <Label htmlFor="duration">Duration (hours)</Label>
              <Input
                type="number"
                {...register('duration', { required: true, min: 0 })}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="observations">Observations</Label>
              <Textarea
                {...register('observations')}
                placeholder="Enter observations about consistency and texture"
              />
            </div>
          </div>

          <Button type="submit" className="w-full">Submit Record</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FermentationForm;
