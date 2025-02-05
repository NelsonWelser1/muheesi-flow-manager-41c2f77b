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

const CheeseVatForm = ({ vatId, onSuccess }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const { error } = await supabase
        .from('cheese_vat_records')
        .insert([{
          vat_id: vatId,
          ...data,
          operator_id: 'current-user', // Replace with actual user ID
        }]);

      if (error) throw error;

      toast.success('Cheese vat record added successfully');
      reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error adding cheese vat record:', error);
      toast.error('Failed to add cheese vat record');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cheese Vat Data Entry - Vat {vatId}</CardTitle>
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
              <Label htmlFor="product_type">Product Type</Label>
              <Input
                id="product_type"
                {...register('product_type', { required: true })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="current_phase">Current Phase</Label>
              <Input
                id="current_phase"
                {...register('current_phase', { required: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature (°C)</Label>
              <Input
                id="temperature"
                type="number"
                step="0.1"
                {...register('temperature', { required: true })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ph_level">pH Level</Label>
              <Input
                id="ph_level"
                type="number"
                step="0.1"
                {...register('ph_level')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stirring_speed">Stirring Speed (RPM)</Label>
              <Input
                id="stirring_speed"
                type="number"
                {...register('stirring_speed')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="curd_size">Curd Size (mm)</Label>
            <Input
              id="curd_size"
              type="number"
              step="0.1"
              {...register('curd_size')}
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

export default CheeseVatForm;