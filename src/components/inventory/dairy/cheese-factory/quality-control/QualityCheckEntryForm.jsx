
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/supabase';
import { ClipboardCheck, Loader2 } from 'lucide-react';
import BatchSelector from './components/BatchSelector';
import ParameterInputGroup from './components/ParameterInputGroup';
import { useBatchOptions } from './hooks/useBatchOptions';

const QualityCheckEntryForm = () => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const {
    fetchingBatches,
    searchQuery,
    setSearchQuery,
    filteredBatches
  } = useBatchOptions();

  const parameters = [
    'Temperature',
    'pH Level',
    'Moisture Content',
    'Fat Content',
    'Protein Content',
    'Salt Content'
  ];

  const handleBatchSelect = (batch) => {
    setSelectedBatch(batch);
    setValue('batchId', batch.batch_id);
    setOpen(false);
    setSearchQuery("");
  };

  const onSubmit = async (data) => {
    if (!selectedBatch?.batch_id) {
      toast({
        title: "Error",
        description: "Please select a batch ID",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      
      const session = await supabase.auth.getSession();
      if (!session.data.session?.user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to submit quality checks",
          variant: "destructive"
        });
        return;
      }

      const qualityChecks = parameters.map(parameter => ({
        batch_id: selectedBatch.batch_id,
        parameter: parameter,
        actual_value: data[`${parameter.toLowerCase().replace(' ', '_')}_value`],
        standard_value: data[`${parameter.toLowerCase().replace(' ', '_')}_standard`],
        status: data[`${parameter.toLowerCase().replace(' ', '_')}_status`],
        notes: data.notes,
        checked_by: session.data.session.user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('quality_checks')
        .insert(qualityChecks);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Quality checks recorded successfully",
        duration: 3000,
      });

      reset();
      setSelectedBatch(null);
    } catch (error) {
      console.error('Error submitting quality checks:', error);
      toast({
        title: "Error",
        description: "Failed to submit quality checks: " + error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
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
          <BatchSelector
            fetchingBatches={fetchingBatches}
            selectedBatch={selectedBatch}
            open={open}
            setOpen={setOpen}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredBatches={filteredBatches}
            onSelectBatch={handleBatchSelect}
          />

          {parameters.map((parameter) => (
            <ParameterInputGroup 
              key={parameter} 
              parameter={parameter}
              register={register}
            />
          ))}

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Add any additional notes"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading || !selectedBatch}>
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </div>
            ) : (
              "Submit All Quality Checks"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default QualityCheckEntryForm;
