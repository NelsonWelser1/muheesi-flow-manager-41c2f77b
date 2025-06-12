
import React from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/supabase';

const CleaningSanitationForm = () => {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      const { error } = await supabase
        .from('yogurt_cleaning_sanitation')
        .insert([{
          ...data,
          operator_id: 'current-user-id', // Replace with actual user ID from auth context
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Cleaning and sanitation record added successfully",
      });

      reset();
    } catch (error) {
      console.error('Error submitting cleaning and sanitation data:', error);
      toast({
        title: "Error",
        description: "Failed to add cleaning and sanitation record",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cleaning & Sanitation</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="equipment_id">Equipment ID</Label>
              <Input
                {...register('equipment_id', { required: true })}
                placeholder="Enter equipment ID"
              />
            </div>

            <div>
              <Label htmlFor="date_time">Cleaning Date & Time</Label>
              <Input
                type="datetime-local"
                {...register('date_time', { required: true })}
              />
            </div>

            <div>
              <Label htmlFor="cleaning_agent">Cleaning Agent Used</Label>
              <Input
                {...register('cleaning_agent', { required: true })}
                placeholder="Enter cleaning agent"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                {...register('sanitation_check')}
              />
              <Label htmlFor="sanitation_check">Sanitation Check (Pass/Fail)</Label>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="remarks">Remarks/Follow-Up Actions</Label>
              <Textarea
                {...register('remarks')}
                placeholder="Enter any remarks or follow-up actions needed"
              />
            </div>
          </div>

          <Button type="submit" className="w-full">Submit Record</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CleaningSanitationForm;
