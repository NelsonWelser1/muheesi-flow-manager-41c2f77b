import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/supabase';
import { ClipboardCheck } from 'lucide-react';

const QualityCheckEntryForm = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { toast } = useToast();

  const parameters = [
    'Temperature',
    'pH Level',
    'Moisture Content',
    'Fat Content',
    'Protein Content',
    'Salt Content'
  ];

  const onSubmit = async (data) => {
    try {
      console.log('Submitting quality checks:', data);
      const session = await supabase.auth.getSession();
      if (!session.data.session?.user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to submit quality checks",
          variant: "destructive"
        });
        return;
      }

      // Create an array of quality check entries
      const qualityChecks = parameters.map(parameter => ({
        batch_id: data.batchId,
        parameter: parameter,
        actual_value: data[`${parameter.toLowerCase().replace(' ', '_')}_value`],
        standard_value: data[`${parameter.toLowerCase().replace(' ', '_')}_standard`],
        status: data[`${parameter.toLowerCase().replace(' ', '_')}_status`],
        notes: data.notes,
        checked_by: session.data.session.user.id
      }));

      // Insert all quality checks
      const { error } = await supabase
        .from('quality_checks')
        .insert(qualityChecks)
        .select();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Quality checks recorded successfully",
        duration: 3000,
      });

      reset();
    } catch (error) {
      console.error('Error submitting quality checks:', error);
      toast({
        title: "Error",
        description: "Failed to submit quality checks",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5" />
          New Quality Check
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="batchId">Batch ID</Label>
            <Input
              id="batchId"
              {...register('batchId', { required: true })}
              placeholder="Enter batch ID"
            />
          </div>

          {parameters.map((parameter) => (
            <div key={parameter} className="border p-4 rounded-lg space-y-4">
              <h3 className="font-medium text-lg">{parameter}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`${parameter.toLowerCase().replace(' ', '_')}_value`}>
                    Actual Value
                  </Label>
                  <Input
                    id={`${parameter.toLowerCase().replace(' ', '_')}_value`}
                    {...register(`${parameter.toLowerCase().replace(' ', '_')}_value`, { required: true })}
                    placeholder="Enter measured value"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${parameter.toLowerCase().replace(' ', '_')}_standard`}>
                    Standard Value
                  </Label>
                  <Input
                    id={`${parameter.toLowerCase().replace(' ', '_')}_standard`}
                    {...register(`${parameter.toLowerCase().replace(' ', '_')}_standard`, { required: true })}
                    placeholder="Enter standard value"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${parameter.toLowerCase().replace(' ', '_')}_status`}>
                    Status
                  </Label>
                  <Input
                    id={`${parameter.toLowerCase().replace(' ', '_')}_status`}
                    {...register(`${parameter.toLowerCase().replace(' ', '_')}_status`, { required: true })}
                    placeholder="passed/failed"
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Add any additional notes"
            />
          </div>

          <Button type="submit" className="w-full">
            Submit All Quality Checks
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default QualityCheckEntryForm;