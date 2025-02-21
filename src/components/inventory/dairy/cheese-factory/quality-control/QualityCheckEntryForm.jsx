
import React, { useState } from 'react';
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
import { useSupabaseAuth } from '@/integrations/supabase/auth';

const QualityCheckEntryForm = () => {
  const { session } = useSupabaseAuth();
  const [formData, setFormData] = useState({
    batch_id: '',
    temperature_actual: '',
    temperature_standard: '',
    temperature_status: 'Failed',
    ph_level_actual: '',
    ph_level_standard: '',
    ph_level_status: 'Failed',
    moisture_actual: '',
    moisture_standard: '',
    moisture_status: 'Failed',
    fat_actual: '',
    fat_standard: '',
    fat_status: 'Failed',
    protein_actual: '',
    protein_standard: '',
    protein_status: 'Failed',
    salt_actual: '',
    salt_standard: '',
    salt_status: 'Failed',
    notes: ''
  });

  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);

  const {
    fetchingBatches,
    searchQuery,
    setSearchQuery,
    filteredBatches,
    refetchBatches
  } = useBatchOptions();

  const handleBatchSelect = (batch) => {
    setSelectedBatch(batch);
    setFormData(prev => ({ ...prev, batch_id: batch.batch_id }));
    setOpen(false);
    setSearchQuery("");
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to submit quality checks",
        variant: "destructive"
      });
      return;
    }

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

      const qualityCheck = {
        batch_id: selectedBatch.batch_id,
        checked_by: session.user.id,
        temperature_actual: Number(formData.temperature_actual),
        temperature_standard: Number(formData.temperature_standard),
        temperature_status: formData.temperature_status,
        ph_level_actual: Number(formData.ph_level_actual),
        ph_level_standard: Number(formData.ph_level_standard),
        ph_level_status: formData.ph_level_status,
        moisture_actual: Number(formData.moisture_actual),
        moisture_standard: Number(formData.moisture_standard),
        moisture_status: formData.moisture_status,
        fat_actual: Number(formData.fat_actual),
        fat_standard: Number(formData.fat_standard),
        fat_status: formData.fat_status,
        protein_actual: Number(formData.protein_actual),
        protein_standard: Number(formData.protein_standard),
        protein_status: formData.protein_status,
        salt_actual: Number(formData.salt_actual),
        salt_standard: Number(formData.salt_standard),
        salt_status: formData.salt_status,
        notes: formData.notes || ''
      };

      const { error: insertError } = await supabase
        .from('quality_checks')
        .insert([qualityCheck]);

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Quality check recorded successfully",
      });

      // Reset form
      setFormData({
        batch_id: '',
        temperature_actual: '',
        temperature_standard: '',
        temperature_status: 'Failed',
        ph_level_actual: '',
        ph_level_standard: '',
        ph_level_status: 'Failed',
        moisture_actual: '',
        moisture_standard: '',
        moisture_status: 'Failed',
        fat_actual: '',
        fat_standard: '',
        fat_status: 'Failed',
        protein_actual: '',
        protein_standard: '',
        protein_status: 'Failed',
        salt_actual: '',
        salt_standard: '',
        salt_status: 'Failed',
        notes: ''
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

  const parameters = [
    {
      name: 'Temperature',
      actualKey: 'temperature_actual',
      standardKey: 'temperature_standard',
      statusKey: 'temperature_status'
    },
    {
      name: 'pH Level',
      actualKey: 'ph_level_actual',
      standardKey: 'ph_level_standard',
      statusKey: 'ph_level_status'
    },
    {
      name: 'Moisture Content',
      actualKey: 'moisture_actual',
      standardKey: 'moisture_standard',
      statusKey: 'moisture_status'
    },
    {
      name: 'Fat Content',
      actualKey: 'fat_actual',
      standardKey: 'fat_standard',
      statusKey: 'fat_status'
    },
    {
      name: 'Protein Content',
      actualKey: 'protein_actual',
      standardKey: 'protein_standard',
      statusKey: 'protein_status'
    },
    {
      name: 'Salt Content',
      actualKey: 'salt_actual',
      standardKey: 'salt_standard',
      statusKey: 'salt_status'
    }
  ];

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
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
                key={parameter.name}
                parameter={parameter}
                formData={formData}
                onChange={handleChange}
              />
            ))}

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Add any additional notes"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || !selectedBatch || !session?.user?.id}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </div>
              ) : !session?.user?.id ? (
                "Please log in to submit"
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
