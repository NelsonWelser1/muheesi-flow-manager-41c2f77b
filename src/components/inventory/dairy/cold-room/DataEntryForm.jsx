
import React from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from '@/integrations/supabase/supabase';
import { useSupabaseAuth } from '@/integrations/supabase/auth';

const DataEntryForm = ({ userId, username }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { toast } = useToast();
  const { session } = useSupabaseAuth();

  const onSubmit = async (data) => {
    try {
      // Ensure we have an authenticated session
      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in to submit data",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('cold_room_inventory')
        .insert([{
          ...data,
          operator_id: session.user.id,
          storage_date_time: new Date().toISOString()
        }]);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Data has been successfully recorded",
      });

      reset();
    } catch (error) {
      console.error('Error submitting data:', error);
      toast({
        title: "Error",
        description: "Failed to submit data. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cold_room_id">Cold Room ID</Label>
          <Input
            id="cold_room_id"
            {...register('cold_room_id', { required: true })}
            placeholder="Enter Cold Room ID"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="batch_id">Batch ID</Label>
          <Input
            id="batch_id"
            {...register('batch_id', { required: true })}
            placeholder="Enter Batch ID"
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
              min: -10,
              max: 30
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
          <Label htmlFor="quantity_stored">Quantity Stored</Label>
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
          <Label htmlFor="movement_action">Movement Action</Label>
          <Select onValueChange={(value) => register('movement_action').onChange({ target: { value } })}>
            <SelectTrigger>
              <SelectValue placeholder="Select action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="In">In</SelectItem>
              <SelectItem value="Out">Out</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 col-span-2">
          <Label htmlFor="remarks">Remarks</Label>
          <Textarea
            id="remarks"
            {...register('remarks')}
            placeholder="Enter any additional remarks"
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Submit
      </Button>
    </form>
  );
};

export default DataEntryForm;

