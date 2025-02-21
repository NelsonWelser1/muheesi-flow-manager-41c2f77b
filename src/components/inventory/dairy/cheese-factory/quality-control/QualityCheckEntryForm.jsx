
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
    console.log('Selected batch:', batch); // Added debug log
    setSelectedBatch(batch);
    setValue('batch_id', batch.batch_id);
    setOpen(false);
    setSearchQuery("");
  };

  const onSubmit = async (formData) => {
    console.log('Starting form submission with data:', formData); // Added debug log

    if (!selectedBatch?.batch_id) {
      console.log('No batch selected, aborting submission'); // Added debug log
      toast({
        title: "Error",
        description: "Please select a batch ID",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      console.log('Checking authentication...'); // Added debug log
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError); // Added debug log
        throw sessionError;
      }
      
      if (!session?.user?.id) {
        throw new Error("No authenticated user found");
      }

      console.log('Authentication successful, preparing quality check data...'); // Added debug log

      const qualityCheck = {
        batch_id: selectedBatch.batch_id,
        temperature_value: parseFloat(formData.temperature_value),
        temperature_standard: parseFloat(formData.temperature_standard),
        temperature_status: formData.temperature_status,
        ph_level_value: parseFloat(formData.ph_level_value),
        ph_level_standard: parseFloat(formData.ph_level_standard),
        ph_level_status: formData.ph_level_status,
        moisture_content_value: parseFloat(formData.moisture_content_value),
        moisture_content_standard: parseFloat(formData.moisture_content_standard),
        moisture_content_status: formData.moisture_content_status,
        fat_content_value: parseFloat(formData.fat_content_value),
        fat_content_standard: parseFloat(formData.fat_content_standard),
        fat_content_status: formData.fat_content_status,
        protein_content_value: parseFloat(formData.protein_content_value),
        protein_content_standard: parseFloat(formData.protein_content_standard),
        protein_content_status: formData.protein_content_status,
        salt_content_value: parseFloat(formData.salt_content_value),
        salt_content_standard: parseFloat(formData.salt_content_standard),
        salt_content_status: formData.salt_content_status,
        notes: formData.notes || '',
        checked_by: session.user.id
      };

      console.log('Submitting quality check to Supabase:', qualityCheck); // Added debug log

      const { error: insertError } = await supabase
        .from('quality_checks')
        .insert([qualityCheck]);

      if (insertError) {
        console.error('Insert error:', insertError);
        throw insertError;
      }

      console.log('Quality check submitted successfully'); // Added debug log

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
