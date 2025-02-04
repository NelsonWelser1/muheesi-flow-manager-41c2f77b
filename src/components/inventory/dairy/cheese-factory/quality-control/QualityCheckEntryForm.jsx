import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/supabase';
import { ClipboardCheck, AlertCircle } from 'lucide-react';

const QualityCheckEntryForm = () => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
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
      const session = await supabase.auth.getSession();
      if (!session.data.session?.user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to submit quality checks",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('quality_checks')
        .insert({
          batch_id: data.batchId,
          parameter: data.parameter,
          actual_value: data.actualValue,
          standard_value: data.standardValue,
          status: data.status,
          notes: data.notes,
          checked_by: session.data.session.user.id
        })
        .select();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Quality check recorded successfully",
        duration: 3000,
      });

      reset();
    } catch (error) {
      console.error('Error submitting quality check:', error);
      toast({
        title: "Error",
        description: "Failed to submit quality check",
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="batchId">Batch ID</Label>
              <Input
                id="batchId"
                {...register('batchId', { required: true })}
                placeholder="Enter batch ID"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parameter">Parameter</Label>
              <Select onValueChange={(value) => setValue('parameter', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select parameter" />
                </SelectTrigger>
                <SelectContent>
                  {parameters.map((param) => (
                    <SelectItem key={param} value={param}>
                      {param}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="actualValue">Actual Value</Label>
              <Input
                id="actualValue"
                {...register('actualValue', { required: true })}
                placeholder="Enter measured value"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="standardValue">Standard Value</Label>
              <Input
                id="standardValue"
                {...register('standardValue', { required: true })}
                placeholder="Enter standard value"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={(value) => setValue('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="passed">Passed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                {...register('notes')}
                placeholder="Add any additional notes"
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Submit Quality Check
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default QualityCheckEntryForm;