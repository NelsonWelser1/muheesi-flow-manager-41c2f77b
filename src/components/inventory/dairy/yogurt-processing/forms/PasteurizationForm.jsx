
import React from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/supabase';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BatchInfoSection from './sections/BatchInfoSection';

const PasteurizationForm = () => {
  const { toast } = useToast();
  const { session } = useSupabaseAuth();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      if (!session?.user?.id) {
        toast({
          title: "Error",
          description: "You must be logged in to submit records",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('yogurt_pasteurization')
        .insert([{
          ...data,
          operator_id: session.user.id,
        }]);

      if (error) {
        console.error('Error submitting pasteurization data:', error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Pasteurization record added successfully",
      });

      reset();
    } catch (error) {
      console.error('Error submitting pasteurization data:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add pasteurization record",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pasteurization Process</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <BatchInfoSection register={register} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="volume_processed">Volume Processed (Liters)</Label>
              <Input
                type="number"
                step="0.01"
                {...register('volume_processed', { required: true, min: 0 })}
              />
            </div>

            <div>
              <Label htmlFor="pasteurization_temp">Pasteurization Temperature (°C)</Label>
              <Input
                type="number"
                step="0.1"
                {...register('pasteurization_temp', { required: true })}
              />
            </div>

            <div>
              <Label htmlFor="duration">Duration (Seconds)</Label>
              <Input
                type="number"
                {...register('duration', { required: true, min: 0 })}
              />
            </div>

            <div>
              <Label htmlFor="cooling_start_temp">Cooling Start Temperature (°C)</Label>
              <Input
                type="number"
                step="0.1"
                {...register('cooling_start_temp', { required: true })}
              />
            </div>
          </div>

          <Button type="submit" className="w-full">Submit Record</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PasteurizationForm;
