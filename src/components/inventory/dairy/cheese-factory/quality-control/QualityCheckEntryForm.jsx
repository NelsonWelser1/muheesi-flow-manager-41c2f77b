
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
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: {
      temperature_status: 'failed',
      ph_level_status: 'failed',
      moisture_content_status: 'failed',
      fat_content_status: 'failed',
      protein_content_status: 'failed',
      salt_content_status: 'failed',
    }
  });
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
    console.log('Selected batch:', batch);
    setSelectedBatch(batch);
    setValue('batch_id', batch.batch_id);
    setOpen(false);
    setSearchQuery("");
  };

  const onSubmit = async (formData) => {
    console.log('Starting form submission with data:', formData);

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
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw sessionError;
      }
      
      if (!session?.user?.id) {
        throw new Error("No authenticated user found");
      }

      const qualityCheck = {
        batch_id: selectedBatch.batch_id,
        temperature_value: formData.temperature_value.toString(),  // Convert to string as per table schema
        temperature_standard: formData.temperature_standard.toString(),
        temperature_status: formData.temperature_status,
        ph_level_value: formData.ph_level_value.toString(),
        ph_level_standard: formData.ph_level_standard.toString(),
        ph_level_status: formData.ph_level_status,
        moisture_content_value: formData.moisture_content_value.toString(),
        moisture_content_standard: formData.moisture_content_standard.toString(),
        moisture_content_status: formData.moisture_content_status,
        fat_content_value: formData.fat_content_value.toString(),
        fat_content_standard: formData.fat_content_standard.toString(),
        fat_content_status: formData.fat_content_status,
        protein_content_value: formData.protein_content_value.toString(),
        protein_content_standard: formData.protein_content_standard.toString(),
        protein_content_status: formData.protein_content_status,
        salt_content_value: formData.salt_content_value.toString(),
        salt_content_standard: formData.salt_content_standard.toString(),
        salt_content_status: formData.salt_content_status,
        notes: formData.notes || '',
        checked_by: session.user.id
      };

      console.log('Submitting quality check to Supabase:', qualityCheck);

      const { data, error: insertError } = await supabase
        .from('quality_checks')
        .insert([qualityCheck])
        .select();

      if (insertError) {
        console.error('Insert error:', insertError);
        throw insertError;
      }

      console.log('Quality check submitted successfully:', data);

      toast({
        title: "Success",
        description: "Quality check recorded successfully",
      });

      reset({
        temperature_status: 'failed',
        ph_level_status: 'failed',
        moisture_content_status: 'failed',
        fat_content_status: 'failed',
        protein_content_status: 'failed',
        salt_content_status: 'failed',
      });
      setSelectedBatch(null);
      
    } catch (error) {
      console.error('Error submitting quality check:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit quality check",
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
