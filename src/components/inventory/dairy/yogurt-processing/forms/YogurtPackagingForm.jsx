
import React from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/supabase';

const YogurtPackagingForm = () => {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      const { error } = await supabase
        .from('yogurt_packaging')
        .insert([{
          ...data,
          operator_id: 'current-user-id', // Replace with actual user ID from auth context
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Packaging record added successfully",
      });

      reset();
    } catch (error) {
      console.error('Error submitting packaging data:', error);
      toast({
        title: "Error",
        description: "Failed to add packaging record",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Packaging Process</CardTitle>
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
              <Label htmlFor="date_time">Packaging Date & Time</Label>
              <Input
                type="datetime-local"
                {...register('date_time', { required: true })}
              />
            </div>

            <div>
              <Label htmlFor="container_type">Container Type</Label>
              <Select onValueChange={(value) => register('container_type').onChange({ target: { value } })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select container type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cup">Cup</SelectItem>
                  <SelectItem value="bottle">Bottle</SelectItem>
                  <SelectItem value="tub">Tub</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quantity">Quantity Packaged</Label>
              <Input
                type="number"
                {...register('quantity', { required: true, min: 0 })}
              />
            </div>

            <div>
              <Label htmlFor="expiry_date">Expiry Date</Label>
              <Input
                type="date"
                {...register('expiry_date', { required: true })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                {...register('seal_verification')}
              />
              <Label htmlFor="seal_verification">Seal/Label Verification</Label>
            </div>
          </div>

          <Button type="submit" className="w-full">Submit Record</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default YogurtPackagingForm;
