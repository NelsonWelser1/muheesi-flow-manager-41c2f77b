
import React from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/supabase';

const InventoryManagementForm = () => {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      const { error } = await supabase
        .from('yogurt_inventory')
        .insert([{
          ...data,
          operator_id: 'current-user-id', // Replace with actual user ID from auth context
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Inventory record added successfully",
      });

      reset();
    } catch (error) {
      console.error('Error submitting inventory data:', error);
      toast({
        title: "Error",
        description: "Failed to add inventory record",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Management</CardTitle>
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
              <Label htmlFor="cold_room_id">Cold Room ID</Label>
              <Input
                {...register('cold_room_id', { required: true })}
                placeholder="Enter cold room ID"
              />
            </div>

            <div>
              <Label htmlFor="date_time">Storage Date & Time</Label>
              <Input
                type="datetime-local"
                {...register('date_time', { required: true })}
              />
            </div>

            <div>
              <Label htmlFor="temperature">Temperature (°C)</Label>
              <Input
                type="number"
                step="0.1"
                {...register('temperature', { required: true })}
              />
            </div>

            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                type="number"
                {...register('quantity', { required: true, min: 0 })}
              />
            </div>

            <div>
              <Label htmlFor="movement_type">Movement Type</Label>
              <Select onValueChange={(value) => register('movement_type').onChange({ target: { value } })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select movement type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in">In</SelectItem>
                  <SelectItem value="out">Out</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full">Submit Record</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default InventoryManagementForm;
