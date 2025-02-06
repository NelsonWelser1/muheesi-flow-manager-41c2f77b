import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

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

  const { register, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm({
    defaultValues: {
      fromager_name: '',
      fromager_id: '',
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

  const handleCheeseTypeChange = (value) => {
    console.log('Cheese type changed to:', value);
    setSelectedCheeseType(value);
    setValue('cheese_type', value);
    // Generate batch ID based on cheese type
    const prefix = value.substring(0, 3).toUpperCase();
    const timestamp = new Date().getTime().toString().slice(-6);
    const newBatchId = `${prefix}-${timestamp}`;
    setBatchId(newBatchId);
    setValue('batch_id', newBatchId);
  };

  const onSubmit = async (data) => {
    console.log('Form submitted with data:', data);
    try {
      setIsSubmitting(true);
      // Add your form submission logic here
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
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fromager_name">In-Charge/Fromager Name</Label>
              <Input
                id="fromager_name"
                {...register('fromager_name', { required: 'Fromager name is required' })}
              />
              {errors.fromager_name && (
                <p className="text-sm text-red-500">{errors.fromager_name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="fromager_id">Fromager ID</Label>
              <Input
                id="fromager_id"
                {...register('fromager_id', { required: 'Fromager ID is required' })}
              />
              {errors.fromager_id && (
                <p className="text-sm text-red-500">{errors.fromager_id.message}</p>
              )}
            </div>
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