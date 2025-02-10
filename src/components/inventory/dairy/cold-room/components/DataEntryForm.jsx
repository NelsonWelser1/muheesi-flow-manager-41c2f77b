
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/supabase';

const DataEntryForm = ({ user }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { toast } = useToast();

  const onSubmit = async (data) => {
    try {
      const { error } = await supabase.from('cold_room_inventory').insert({
        ...data,
        user_id: user?.id,
        username: user?.email,
        login_time: new Date().toISOString(),
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Inventory data saved successfully",
      });
      reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save inventory data",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cold Room Inventory Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cold_room_id">Cold Room ID</Label>
              <Input
                id="cold_room_id"
                {...register("cold_room_id", { required: true })}
                placeholder="Enter Cold Room ID"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="batch_id">Batch ID</Label>
              <Input
                id="batch_id"
                {...register("batch_id", { required: true })}
                placeholder="Enter Batch ID"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature (°C)</Label>
              <Input
                id="temperature"
                type="number"
                step="0.01"
                {...register("temperature", { 
                  required: true,
                  min: -30,
                  max: 30
                })}
                placeholder="Enter Temperature"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="humidity">Humidity (%)</Label>
              <Input
                id="humidity"
                type="number"
                step="0.01"
                {...register("humidity", {
                  required: true,
                  min: 0,
                  max: 100
                })}
                placeholder="Enter Humidity"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity_stored">Quantity Stored</Label>
              <Input
                id="quantity_stored"
                type="number"
                {...register("quantity_stored", { required: true, min: 0 })}
                placeholder="Enter Quantity"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="movement_action">Movement Action</Label>
              <Select 
                onValueChange={(value) => register("movement_action").onChange({ target: { value } })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select movement type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="In">In</SelectItem>
                  <SelectItem value="Out">Out</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="operator_id">Operator ID</Label>
              <Input
                id="operator_id"
                {...register("operator_id", { required: true })}
                placeholder="Enter Operator ID"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Input
                id="remarks"
                {...register("remarks")}
                placeholder="Enter Remarks"
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Submit Entry
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DataEntryForm;
