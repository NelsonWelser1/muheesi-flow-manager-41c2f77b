
import React from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/supabase';

const CultureAdditionForm = () => {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      const { error } = await supabase
        .from('yogurt_culture_addition')
        .insert([{
          ...data,
          operator_id: 'current-user-id', // Replace with actual user ID from auth context
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Culture addition record added successfully",
      });

      reset();
    } catch (error) {
      console.error('Error submitting culture addition data:', error);
      toast({
        title: "Error",
        description: "Failed to add culture addition record",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Culture Addition & Fermentation Setup</CardTitle>
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
              <Label htmlFor="yogurt_type">Type of Yogurt</Label>
              <Select onValueChange={(value) => register('yogurt_type').onChange({ target: { value } })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select yogurt type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plain">Plain</SelectItem>
                  <SelectItem value="flavored">Flavored</SelectItem>
                  <SelectItem value="greek">Greek-style</SelectItem>
                  <SelectItem value="low-fat">Low-Fat</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="culture_type">Culture Type</Label>
              <Input
                {...register('culture_type', { required: true })}
                placeholder="Enter culture type"
              />
            </div>

            <div>
              <Label htmlFor="culture_quantity">Culture Quantity (g/mL)</Label>
              <Input
                type="number"
                step="0.01"
                {...register('culture_quantity', { required: true, min: 0 })}
              />
            </div>

            <div>
              <Label htmlFor="additives">Additives</Label>
              <Input
                {...register('additives')}
                placeholder="Enter additives (comma separated)"
              />
            </div>

            <div>
              <Label htmlFor="pre_fermentation_temp">Pre-Fermentation Temperature (°C)</Label>
              <Input
                type="number"
                step="0.1"
                {...register('pre_fermentation_temp', { required: true })}
              />
            </div>

            <div>
              <Label htmlFor="expected_duration">Expected Duration (hours)</Label>
              <Input
                type="number"
                {...register('expected_duration', { required: true, min: 0 })}
              />
            </div>
          </div>

          <Button type="submit" className="w-full">Submit Record</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CultureAdditionForm;
