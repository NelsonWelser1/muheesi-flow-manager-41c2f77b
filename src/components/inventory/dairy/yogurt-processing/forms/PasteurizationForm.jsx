
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/supabase';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSupabaseAuth } from '@/integrations/supabase/auth';

const PasteurizationForm = () => {
  const { session } = useSupabaseAuth();

  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset 
  } = useForm({
    defaultValues: {
      volume_processed: '',
      pasteurization_temp: '',
      duration: '',
      cooling_start_temp: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      if (!session?.user?.id) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to submit records",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('yogurt_pasteurization')
        .insert([{
          ...data,
          batch_id: `BATCH-${Date.now()}`,
          date_time: new Date().toISOString(),
          operator_id: session.user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (error) throw error;

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

  if (!session) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pasteurization Process</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Please log in to submit pasteurization records.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pasteurization Process</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="volume_processed">Volume Processed (Liters)</Label>
              <Input
                type="number"
                step="0.01"
                id="volume_processed"
                {...register('volume_processed', { 
                  required: "Volume is required",
                  min: { value: 0, message: "Volume must be positive" }
                })}
              />
              {errors.volume_processed && (
                <p className="text-sm text-red-500">{errors.volume_processed.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="pasteurization_temp">Pasteurization Temperature (°C)</Label>
              <Input
                type="number"
                step="0.1"
                id="pasteurization_temp"
                {...register('pasteurization_temp', { 
                  required: "Temperature is required"
                })}
              />
              {errors.pasteurization_temp && (
                <p className="text-sm text-red-500">{errors.pasteurization_temp.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="duration">Duration (Seconds)</Label>
              <Input
                type="number"
                id="duration"
                {...register('duration', { 
                  required: "Duration is required",
                  min: { value: 0, message: "Duration must be positive" }
                })}
              />
              {errors.duration && (
                <p className="text-sm text-red-500">{errors.duration.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="cooling_start_temp">Cooling Start Temperature (°C)</Label>
              <Input
                type="number"
                step="0.1"
                id="cooling_start_temp"
                {...register('cooling_start_temp', { 
                  required: "Cooling temperature is required"
                })}
              />
              {errors.cooling_start_temp && (
                <p className="text-sm text-red-500">{errors.cooling_start_temp.message}</p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full">Submit Record</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PasteurizationForm;
