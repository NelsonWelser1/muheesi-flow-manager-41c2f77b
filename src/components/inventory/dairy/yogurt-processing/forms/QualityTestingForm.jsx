
import React from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/supabase';

const QualityTestingForm = () => {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      const { error } = await supabase
        .from('yogurt_quality_testing')
        .insert([{
          ...data,
          tester_id: 'current-user-id', // Replace with actual user ID from auth context
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Quality testing record added successfully",
      });

      reset();
    } catch (error) {
      console.error('Error submitting quality testing data:', error);
      toast({
        title: "Error",
        description: "Failed to add quality testing record",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quality Testing</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="batch_id">Batch ID</Label>
              <Input
                {...register('batch_id', { required: true })}
                placeholder="Enter batch ID"
              />
            </div>

            <div>
              <Label htmlFor="date_time">Testing Date & Time</Label>
              <Input
                type="datetime-local"
                {...register('date_time', { required: true })}
              />
            </div>

            <div>
              <Label htmlFor="ph_level">pH Level</Label>
              <Input
                type="number"
                step="0.01"
                {...register('ph_level', { required: true })}
              />
            </div>

            <div>
              <Label htmlFor="microbial_count">Microbial Count</Label>
              <Input
                type="number"
                {...register('microbial_count', { required: true })}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="sensory_evaluation">Sensory Evaluation</Label>
              <Textarea
                {...register('sensory_evaluation', { required: true })}
                placeholder="Enter sensory evaluation details"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="corrective_actions">Corrective Actions</Label>
              <Textarea
                {...register('corrective_actions')}
                placeholder="Enter any corrective actions needed"
              />
            </div>
          </div>

          <Button type="submit" className="w-full">Submit Record</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default QualityTestingForm;
