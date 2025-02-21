
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
import QualityChecksDisplay from './components/QualityChecksDisplay';

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
    filteredBatches,
    refetchBatches
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
    setValue('batch_id', batch.batch_id);
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

      const qualityCheck = {
        batch_id: selectedBatch.batch_id,
        temperature_value: data.temperature_value,
        temperature_standard: data.temperature_standard,
        temperature_status: data.temperature_status,
        ph_level_value: data.ph_level_value,
        ph_level_standard: data.ph_level_standard,
        ph_level_status: data.ph_level_status,
        moisture_content_value: data.moisture_content_value,
        moisture_content_standard: data.moisture_content_standard,
        moisture_content_status: data.moisture_content_status,
        fat_content_value: data.fat_content_value,
        fat_content_standard: data.fat_content_standard,
        fat_content_status: data.fat_content_status,
        protein_content_value: data.protein_content_value,
        protein_content_standard: data.protein_content_standard,
        protein_content_status: data.protein_content_status,
        salt_content_value: data.salt_content_value,
        salt_content_standard: data.salt_content_standard,
        salt_content_status: data.salt_content_status,
        notes: data.notes,
        checked_by: session.data.session.user.id,
      };

      const { error } = await supabase
        .from('quality_checks')
        .insert([qualityCheck]);

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
    <div className="space-y-6">
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
              refetchBatches={refetchBatches}
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
                "Submit Quality Check"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <QualityChecksDisplay />
    </div>
  );
};

export default QualityCheckEntryForm;
