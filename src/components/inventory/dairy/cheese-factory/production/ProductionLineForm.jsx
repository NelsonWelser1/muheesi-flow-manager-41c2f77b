import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { supabase } from '@/integrations/supabase/supabase';
import { useForm } from 'react-hook-form';

const CHEESE_TYPES = [
  'Mozzarella',
  'Cheddar',
  'Gouda',
  'Swiss',
  'Parmesan',
  'Feta'
];

const ProductionLineForm = ({ productionLine }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCheeseType, setSelectedCheeseType] = useState('');
  
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
    defaultValues: {
      batch_id: '',
      date_time: new Date().toISOString(),
      milk_volume: '',
      cheese_type: '',
      starter_culture: '',
      starter_quantity: '',
      coagulant: '',
      coagulant_quantity: '',
      temperature: '',
      processing_time: '',
      yield: '',
      operator_id: ''
    }
  });

  const { toast } = useToast();
  const { session } = useSupabaseAuth();

  React.useEffect(() => {
    register('cheese_type', { required: 'Cheese type is required' });
  }, [register]);

  const onSubmit = async (data) => {
    if (!session) {
      toast({
        title: "Error",
        description: "You must be logged in to submit production data",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const tableName = productionLine?.id === 1 ? 'production_line_international' : 'production_line_local';
      
      const submissionData = {
        batch_id: data.batch_id,
        date_time: data.date_time,
        milk_volume: parseFloat(data.milk_volume),
        cheese_type: data.cheese_type,
        starter_culture: data.starter_culture,
        starter_quantity: parseFloat(data.starter_quantity),
        coagulant: data.coagulant,
        coagulant_quantity: parseFloat(data.coagulant_quantity),
        temperature: parseFloat(data.temperature),
        processing_time: parseInt(data.processing_time),
        yield: parseFloat(data.yield),
        operator_id: session.user.id,
        created_at: new Date().toISOString()
      };

      console.log('Submitting production data:', submissionData);

      const { error } = await supabase
        .from(tableName)
        .insert([submissionData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Production data submitted successfully",
      });

      reset();
      setSelectedCheeseType('');

    } catch (error) {
      console.error('Error submitting production data:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit production data",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheeseTypeChange = (value) => {
    setSelectedCheeseType(value);
    setValue('cheese_type', value);
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="batch_id">Batch ID</Label>
              <Input
                id="batch_id"
                {...register('batch_id', { required: 'Batch ID is required' })}
              />
              {errors.batch_id && (
                <p className="text-sm text-red-500">{errors.batch_id.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_time">Date & Time</Label>
              <Input
                id="date_time"
                type="datetime-local"
                {...register('date_time', { required: 'Date & Time is required' })}
              />
              {errors.date_time && (
                <p className="text-sm text-red-500">{errors.date_time.message}</p>
              )}
            </div>

            <div className="space-y-2">
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

            <div className="space-y-2">
              <Label htmlFor="milk_volume">Milk Volume (L)</Label>
              <Input
                id="milk_volume"
                type="number"
                step="0.1"
                {...register('milk_volume', { 
                  required: 'Milk volume is required',
                  min: { value: 0, message: 'Volume must be positive' }
                })}
              />
              {errors.milk_volume && (
                <p className="text-sm text-red-500">{errors.milk_volume.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="starter_culture">Starter Culture</Label>
              <Input
                id="starter_culture"
                {...register("starter_culture", { required: true })}
                placeholder="Enter starter culture"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="starter_quantity">Starter Culture Quantity (g)</Label>
              <Input
                id="starter_quantity"
                type="number"
                step="0.1"
                {...register("starter_quantity", { required: true, min: 0 })}
                placeholder="Enter quantity"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coagulant">Coagulant</Label>
              <Input
                id="coagulant"
                {...register("coagulant", { required: true })}
                placeholder="Enter coagulant"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coagulant_quantity">Coagulant Quantity (ml)</Label>
              <Input
                id="coagulant_quantity"
                type="number"
                step="0.1"
                {...register("coagulant_quantity", { required: true, min: 0 })}
                placeholder="Enter quantity"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature">Processing Temperature (°C)</Label>
              <Input
                id="temperature"
                type="number"
                step="0.1"
                {...register("temperature", { required: true })}
                placeholder="Enter temperature"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="processing_time">Processing Time (minutes)</Label>
              <Input
                id="processing_time"
                type="number"
                {...register("processing_time", { required: true, min: 0 })}
                placeholder="Enter processing time"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="yield">Yield (kg)</Label>
              <Input
                id="yield"
                type="number"
                step="0.1"
                {...register("yield", { required: true, min: 0 })}
                placeholder="Enter cheese yield"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="operator_id">Operator Name/ID</Label>
              <Input
                id="operator_id"
                {...register("operator_id", { required: true })}
                placeholder="Enter operator name or ID"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Production Data'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductionLineForm;