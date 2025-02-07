import React from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/integrations/supabase';

const AgingRoomForm = () => {
  console.log('Rendering AgingRoomForm');
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    console.log('Submitting aging room data:', data);
    try {
      const { error } = await supabase
        .from('aging_room_records')
        .insert([data]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Aging room record added successfully",
      });
    } catch (error) {
      console.error('Error submitting aging room data:', error);
      toast({
        title: "Error",
        description: "Failed to add aging room record",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cheese Maturation Record</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="room_id">Maturation Room ID</Label>
            <Select onValueChange={(value) => register('room_id').onChange({ target: { value } })}>
              <SelectTrigger>
                <SelectValue placeholder="Select room" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="room1">Room 1</SelectItem>
                <SelectItem value="room2">Room 2</SelectItem>
                <SelectItem value="room3">Room 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="temperature">Temperature (°C)</Label>
              <Input
                type="number"
                step="0.1"
                {...register('temperature', { required: true })}
              />
            </div>
            <div>
              <Label htmlFor="humidity">Humidity (%)</Label>
              <Input
                type="number"
                {...register('humidity', { required: true })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="batch_id">Batch ID</Label>
            <Select onValueChange={(value) => register('batch_id').onChange({ target: { value } })}>
              <SelectTrigger>
                <SelectValue placeholder="Select batch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="20250207-GOU-000049">20250207-GOU-000049</SelectItem>
                <SelectItem value="20250207-GOU-000050">20250207-GOU-000050</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="quality_check">Quality Check</Label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="texture">Texture</Label>
                <Input {...register('texture', { required: true })} />
              </div>
              <div>
                <Label htmlFor="taste">Taste</Label>
                <Input {...register('taste', { required: true })} />
              </div>
              <div>
                <Label htmlFor="moisture">Moisture Level</Label>
                <Input 
                  type="number" 
                  step="0.1"
                  {...register('moisture', { required: true })} 
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input {...register('notes')} />
          </div>

          <Button type="submit">Submit Record</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AgingRoomForm;