
import React from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/supabase';

const CoolingSettingForm = () => {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      const { error } = await supabase
        .from('yogurt_cooling_setting')
        .insert([{
          ...data,
          operator_id: 'current-user-id', // Replace with actual user ID from auth context
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Cooling and setting record added successfully",
      });

      reset();
    } catch (error) {
      console.error('Error submitting cooling and setting data:', error);
      toast({
        title: "Error",
        description: "Failed to add cooling and setting record",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cooling & Setting Process</CardTitle>
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
              <Label htmlFor="date_time">Date & Time</Label>
              <Input
                type="datetime-local"
                {...register('date_time', { required: true })}
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
              <Label htmlFor="cooling_duration">Cooling Duration (minutes)</Label>
              <Input
                type="number"
                {...register('cooling_duration', { required: true, min: 0 })}
              />
            </div>

            <div>
              <Label htmlFor="setting_time">Setting Time (hours)</Label>
              <Input
                type="number"
                {...register('setting_time', { required: true, min: 0 })}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="texture_observations">Texture Observations</Label>
              <Textarea
                {...register('texture_observations')}
                placeholder="Enter observations about final texture"
              />
            </div>
          </div>

          <Button type="submit" className="w-full">Submit Record</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CoolingSettingForm;
