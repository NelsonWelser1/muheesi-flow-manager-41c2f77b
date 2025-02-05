import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';

const PasteurizerForm = ({ unitId, onSuccess }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const { error } = await supabase
        .from('pasteurizer_records')
        .insert([{
          unit_id: unitId,
          ...data,
          operator_id: 'current-user', // Replace with actual user ID
        }]);

      if (error) throw error;

      toast.success('Pasteurizer record added successfully');
      reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error adding pasteurizer record:', error);
      toast.error('Failed to add pasteurizer record');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pasteurizer Data Entry - Unit {unitId}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Input
                id="status"
                {...register('status', { required: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="current_temperature">Current Temperature (°C)</Label>
              <Input
                id="current_temperature"
                type="number"
                step="0.1"
                {...register('current_temperature', { required: true })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target_temperature">Target Temperature (°C)</Label>
              <Input
                id="target_temperature"
                type="number"
                step="0.1"
                {...register('target_temperature', { required: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="batch_volume">Batch Volume (L)</Label>
              <Input
                id="batch_volume"
                type="number"
                step="0.1"
                {...register('batch_volume', { required: true })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="flow_rate">Flow Rate (L/h)</Label>
              <Input
                id="flow_rate"
                type="number"
                step="0.1"
                {...register('flow_rate')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="holding_time">Holding Time (seconds)</Label>
              <Input
                id="holding_time"
                type="number"
                {...register('holding_time')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cleaning_status">Cleaning Status</Label>
            <Input
              id="cleaning_status"
              {...register('cleaning_status')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" {...register('notes')} />
          </div>

          <Button type="submit">Submit Record</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PasteurizerForm;