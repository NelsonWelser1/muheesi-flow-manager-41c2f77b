
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/supabase';
import { ClipboardCheck, Loader2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const QualityCheckEntryForm = () => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [batchOptions, setBatchOptions] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingBatches, setFetchingBatches] = useState(true);

  const parameters = [
    'Temperature',
    'pH Level',
    'Moisture Content',
    'Fat Content',
    'Protein Content',
    'Salt Content'
  ];

  useEffect(() => {
    fetchBatchIds();
  }, []);

  const fetchBatchIds = async () => {
    try {
      setFetchingBatches(true);
      // Fetch from both production lines
      const [internationalResponse, localResponse] = await Promise.all([
        supabase
          .from('production_line_international')
          .select('batch_id, cheese_type, created_at')
          .order('created_at', { ascending: false }),
        supabase
          .from('production_line_local')
          .select('batch_id, cheese_type, created_at')
          .order('created_at', { ascending: false })
      ]);

      if (internationalResponse.error) throw internationalResponse.error;
      if (localResponse.error) throw localResponse.error;

      const internationalBatches = internationalResponse.data || [];
      const localBatches = localResponse.data || [];

      // Combine and format the batches
      const combinedBatches = [...internationalBatches, ...localBatches]
        .filter(batch => batch.batch_id && batch.cheese_type) // Ensure we have valid data
        .map(batch => ({
          ...batch,
          label: `${batch.batch_id} (${batch.cheese_type})`
        }))
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setBatchOptions(combinedBatches);
    } catch (error) {
      console.error('Error fetching batch IDs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch batch IDs",
        variant: "destructive"
      });
    } finally {
      setFetchingBatches(false);
    }
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

      // Insert all quality checks
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
          <div className="space-y-2">
            <Label htmlFor="batchId">Batch ID</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                  disabled={fetchingBatches}
                >
                  {fetchingBatches ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading batches...
                    </div>
                  ) : selectedBatch ? (
                    selectedBatch.label
                  ) : (
                    "Select batch..."
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search batch ID..." />
                  <CommandEmpty>No batch found.</CommandEmpty>
                  {batchOptions.length > 0 && (
                    <CommandGroup className="max-h-60 overflow-y-auto">
                      {batchOptions.map((batch) => (
                        <CommandItem
                          key={batch.batch_id}
                          onSelect={() => {
                            setSelectedBatch(batch);
                            setValue('batchId', batch.batch_id);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedBatch?.batch_id === batch.batch_id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {batch.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </Command>
              </PopoverContent>
            </Popover>
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
