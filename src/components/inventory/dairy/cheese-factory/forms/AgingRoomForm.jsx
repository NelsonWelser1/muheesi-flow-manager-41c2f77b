import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';

const AgingRoomForm = ({ roomId, onSuccess }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const { error } = await supabase
        .from('aging_room_records')
        .insert([{
          room_id: roomId,
          ...data,
          recorded_by: 'current-user', // Replace with actual user ID
        }]);

      if (error) throw error;

      toast.success('Aging room record added successfully');
      reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error adding aging room record:', error);
      toast.error('Failed to add aging room record');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aging Room Data Entry - Room {roomId}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature (°C)</Label>
              <Input
                id="temperature"
                type="number"
                step="0.1"
                {...register('temperature', { required: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="humidity">Humidity (%)</Label>
              <Input
                id="humidity"
                type="number"
                {...register('humidity', { required: true })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="occupancy">Occupancy (%)</Label>
              <Input
                id="occupancy"
                type="number"
                {...register('occupancy', { required: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cheese_type">Cheese Type</Label>
              <Input
                id="cheese_type"
                {...register('cheese_type', { required: true })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="aging_duration">Aging Duration (days)</Label>
            <Input
              id="aging_duration"
              type="number"
              {...register('aging_duration', { required: true })}
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

export default AgingRoomForm;