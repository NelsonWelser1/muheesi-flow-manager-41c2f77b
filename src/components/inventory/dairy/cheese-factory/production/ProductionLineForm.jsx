import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from "@/components/ui/use-toast";
import { useSupabaseAuth } from '@/integrations/supabase/auth';
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

const ProductionLineForm = ({ productionLine }) => {
  console.log('Initializing ProductionLineForm with:', { productionLine });
  
  const { toast } = useToast();
  const { session } = useSupabaseAuth();
  const [selectedCheeseType, setSelectedCheeseType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
    defaultValues: {
      cheese_type: '',
      milk_volume: '',
      start_time: '',
      estimated_duration: '',
      notes: ''
    }
  });

  useEffect(() => {
    if (productionLine && typeof productionLine === 'object') {
      Object.entries(productionLine).forEach(([key, value]) => {
        if (value !== undefined) {
          setValue(key, value);
        }
      });
      if (productionLine.cheese_type) {
        setSelectedCheeseType(productionLine.cheese_type);
      }
    }
  }, [productionLine, setValue]);

  const handleCheeseTypeChange = (value) => {
    console.log('Cheese type changed to:', value);
    setSelectedCheeseType(value);
    setValue('cheese_type', value);
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
            {errors.cheese_type && (
              <p className="text-sm text-red-500">{errors.cheese_type.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="milk_volume">Milk Volume (L)</Label>
            <Input
              type="number"
              id="milk_volume"
              {...register('milk_volume', {
                required: 'Milk volume is required',
                min: { value: 0, message: 'Volume must be positive' }
              })}
              placeholder="Enter milk volume"
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
              {...register('start_time', {
                required: 'Start time is required'
              })}
            />
            {errors.start_time && (
              <p className="text-sm text-red-500">{errors.start_time.message}</p>
            )}
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
              placeholder="Enter estimated duration"
            />
            {errors.estimated_duration && (
              <p className="text-sm text-red-500">{errors.estimated_duration.message}</p>
            )}
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