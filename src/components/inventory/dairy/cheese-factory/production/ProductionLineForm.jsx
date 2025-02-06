import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/supabase';

const CHEESE_TYPES = [
  'Mozzarella',
  'Cheddar',
  'Gouda',
  'Parmesan',
  'Swiss',
  'Blue Cheese'
];

const COAGULANT_TYPES = [
  'Rennet',
  'Vegetable Rennet',
  'Microbial Rennet',
  'Citric Acid'
];

const STARTER_CULTURES = [
  'Thermophilic',
  'Mesophilic',
  'Mixed Culture',
  'Direct Vat Set (DVS)'
];

const ProductionLineForm = ({ productionLine }) => {
  console.log('Initializing ProductionLineForm with:', { productionLine });
  
  const { toast } = useToast();
  const [selectedCheeseType, setSelectedCheeseType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [batchId, setBatchId] = useState('');

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
    defaultValues: {
      fromager_identifier: '',
      cheese_type: '',
      batch_id: '',
      milk_volume: '',
      start_time: '',
      estimated_duration: '',
      starter_culture: '',
      starter_quantity: '',
      coagulant_type: '',
      coagulant_quantity: '',
      processing_temperature: '',
      processing_time: '',
      expected_yield: '',
      notes: ''
    }
  });

  useEffect(() => {
    if (productionLine && typeof productionLine === 'object') {
      console.log('Setting form values from productionLine:', productionLine);
      Object.entries(productionLine).forEach(([key, value]) => {
        if (value !== undefined) {
          setValue(key, value);
        }
      });
    }
  }, [productionLine, setValue]);

  const generateBatchId = async (cheeseType) => {
    try {
      console.log('Generating new batch ID for cheese type:', cheeseType);
      const { data, error } = await supabase.rpc('generate_batch_id', {
        cheese_type: cheeseType
      });
      
      if (error) {
        console.error('Error generating batch ID:', error);
        throw error;
      }
      
      console.log('Generated batch ID:', data);
      return data;
    } catch (error) {
      console.error('Failed to generate batch ID:', error);
      toast({
        title: "Error",
        description: "Failed to generate batch ID. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleCheeseTypeChange = async (value) => {
    console.log('Cheese type changed to:', value);
    setSelectedCheeseType(value);
    setValue('cheese_type', value);
    
    const newBatchId = await generateBatchId(value);
    if (newBatchId) {
      setBatchId(newBatchId);
      setValue('batch_id', newBatchId);
    }
  };

  const onSubmit = async (data) => {
    console.log('Form submitted with data:', data);
    try {
      setIsSubmitting(true);
      
      const tableName = productionLine.name.toLowerCase().includes('international') 
        ? 'production_line_international' 
        : 'production_line_local';
      
      const { error } = await supabase
        .from(tableName)
        .insert([{
          ...data,
          batch_id: batchId,
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Production line updated successfully",
      });
      reset();
      setSelectedCheeseType('');
      setBatchId('');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Failed to update production line",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="fromager_identifier">In-Charge/Fromager Name or ID</Label>
            <Input
              id="fromager_identifier"
              {...register('fromager_identifier', { 
                required: 'Fromager name or ID is required',
                pattern: {
                  value: /^[A-Za-z0-9\s-]+$/,
                  message: 'Please enter a valid name or ID'
                }
              })}
              placeholder="Enter name, ID, or both"
            />
            {errors.fromager_identifier && (
              <p className="text-sm text-red-500">{errors.fromager_identifier.message}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cheese_type">Cheese Type</Label>
              <Select
                value={selectedCheeseType}
                onValueChange={handleCheeseTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select cheese type" />
                </SelectTrigger>
                <SelectContent>
                  {CHEESE_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="batch_id">Batch ID</Label>
              <Input
                id="batch_id"
                value={batchId}
                disabled
                className="bg-gray-100"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="milk_volume">Milk Volume (L)</Label>
              <Input
                type="number"
                id="milk_volume"
                {...register('milk_volume', {
                  required: 'Milk volume is required',
                  min: { value: 0, message: 'Volume must be positive' }
                })}
              />
              {errors.milk_volume && (
                <p className="text-sm text-red-500">{errors.milk_volume.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="start_time">Start Time</Label>
              <Input
                type="datetime-local"
                id="start_time"
                {...register('start_time', { required: 'Start time is required' })}
              />
              {errors.start_time && (
                <p className="text-sm text-red-500">{errors.start_time.message}</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="starter_culture">Starter Culture</Label>
              <Select onValueChange={(value) => setValue('starter_culture', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select starter culture" />
                </SelectTrigger>
                <SelectContent>
                  {STARTER_CULTURES.map((culture) => (
                    <SelectItem key={culture} value={culture}>
                      {culture}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="starter_quantity">Starter Culture Quantity (g)</Label>
              <Input
                type="number"
                id="starter_quantity"
                {...register('starter_quantity', {
                  required: 'Starter quantity is required',
                  min: { value: 0, message: 'Quantity must be positive' }
                })}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="coagulant_type">Coagulant Type</Label>
              <Select onValueChange={(value) => setValue('coagulant_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select coagulant type" />
                </SelectTrigger>
                <SelectContent>
                  {COAGULANT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="coagulant_quantity">Coagulant Quantity (ml)</Label>
              <Input
                type="number"
                id="coagulant_quantity"
                {...register('coagulant_quantity', {
                  required: 'Coagulant quantity is required',
                  min: { value: 0, message: 'Quantity must be positive' }
                })}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="processing_temperature">Processing Temperature (°C)</Label>
              <Input
                type="number"
                id="processing_temperature"
                {...register('processing_temperature', {
                  required: 'Processing temperature is required',
                  min: { value: 0, message: 'Temperature must be positive' }
                })}
              />
            </div>

            <div>
              <Label htmlFor="processing_time">Processing Time (minutes)</Label>
              <Input
                type="number"
                id="processing_time"
                {...register('processing_time', {
                  required: 'Processing time is required',
                  min: { value: 0, message: 'Time must be positive' }
                })}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expected_yield">Expected Yield (kg)</Label>
              <Input
                type="number"
                id="expected_yield"
                {...register('expected_yield', {
                  required: 'Expected yield is required',
                  min: { value: 0, message: 'Yield must be positive' }
                })}
              />
            </div>

            <div>
              <Label htmlFor="estimated_duration">Estimated Duration (hours)</Label>
              <Input
                type="number"
                id="estimated_duration"
                {...register('estimated_duration', {
                  required: 'Estimated duration is required',
                  min: { value: 0, message: 'Duration must be positive' }
                })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              {...register('notes')}
              placeholder="Add any additional notes"
            />
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Updating...' : 'Update Production Line'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductionLineForm;