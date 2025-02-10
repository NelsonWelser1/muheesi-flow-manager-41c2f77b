
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/supabase';

const InventoryForm = () => {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (!currentUser) {
        toast({
          title: "Error",
          description: "You must be logged in to submit inventory records",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from('cold_room_inventory').insert([{
        ...data,
        user_id: currentUser.userId,
        username: currentUser.username,
        login_time: currentUser.loginTime,
        operator_id: currentUser.userId,
        storage_date_time: new Date().toISOString()
      }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Inventory record added successfully"
      });
      reset();
    } catch (error) {
      console.error('Error submitting inventory:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add inventory record",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Inventory Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cold_room_id">Cold Room ID</Label>
              <Input
                id="cold_room_id"
                {...register('cold_room_id', { required: true })}
                placeholder="Enter cold room ID"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="batch_id">Batch ID</Label>
              <Input
                id="batch_id"
                {...register('batch_id', { required: true })}
                placeholder="Enter batch ID"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature (°C)</Label>
              <Input
                id="temperature"
                type="number"
                step="0.1"
                {...register('temperature', {
                  required: true,
                  min: 0,
                  max: 10
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="humidity">Humidity (%)</Label>
              <Input
                id="humidity"
                type="number"
                step="0.1"
                {...register('humidity', {
                  required: true,
                  min: 0,
                  max: 100
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity_stored">Quantity</Label>
              <Input
                id="quantity_stored"
                type="number"
                {...register('quantity_stored', {
                  required: true,
                  min: 0
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="movement_action">Movement Type</Label>
              <Select onValueChange={(value) => register('movement_action').onChange({ target: { value } })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select movement type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="In">In</SelectItem>
                  <SelectItem value="Out">Out</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Input
                id="remarks"
                {...register('remarks')}
                placeholder="Enter any additional remarks"
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Submit Record
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default InventoryForm;
