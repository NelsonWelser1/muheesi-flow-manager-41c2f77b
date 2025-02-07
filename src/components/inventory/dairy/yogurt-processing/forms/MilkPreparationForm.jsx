
import React from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/supabase';

const MilkPreparationForm = () => {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      const { error } = await supabase
        .from('yogurt_milk_preparation')
        .insert([{
          ...data,
          operator_id: 'current-user-id', // Replace with actual user ID from auth context
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Milk preparation record added successfully",
      });

      reset();
    } catch (error) {
      console.error('Error submitting milk preparation data:', error);
      toast({
        title: "Error",
        description: "Failed to add milk preparation record",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Milk Preparation & Standardization</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date_time">Date & Time</Label>
              <Input
                type="datetime-local"
                {...register('date_time', { required: true })}
              />
            </div>

            <div>
              <Label htmlFor="batch_id">Batch ID</Label>
              <Input
                {...register('batch_id', { required: true })}
                placeholder="Enter batch ID"
              />
            </div>

            <div>
              <Label htmlFor="milk_volume">Milk Volume (Liters)</Label>
              <Input
                type="number"
                step="0.01"
                {...register('milk_volume', { required: true, min: 0 })}
              />
            </div>

            <div>
              <Label htmlFor="pre_standardization_fat">Pre-standardization Fat %</Label>
              <Input
                type="number"
                step="0.01"
                {...register('pre_standardization_fat', { required: true, min: 0 })}
              />
            </div>

            <div>
              <Label htmlFor="target_fat">Target Fat %</Label>
              <Input
                type="number"
                step="0.01"
                {...register('target_fat', { required: true, min: 0 })}
              />
            </div>

            <div>
              <Label htmlFor="homogenizer_id">Homogenizer ID</Label>
              <Input
                {...register('homogenizer_id', { required: true })}
                placeholder="Enter homogenizer ID"
              />
            </div>

            <div>
              <Label htmlFor="homogenization_duration">Homogenization Duration (minutes)</Label>
              <Input
                type="number"
                {...register('homogenization_duration', { required: true, min: 0 })}
              />
            </div>
          </div>

          <Button type="submit" className="w-full">Submit Record</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MilkPreparationForm;

