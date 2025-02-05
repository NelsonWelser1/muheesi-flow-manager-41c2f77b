import React from 'react';
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/supabase';
import { useSupabaseAuth } from '@/integrations/supabase/auth';

const CHEESE_TYPES = [
  { id: 'mozzarella', name: 'Mozzarella' },
  { id: 'gouda', name: 'Gouda' },
  { id: 'cheddar', name: 'Cheddar' },
  { id: 'feta', name: 'Feta' },
  { id: 'ricotta', name: 'Ricotta' },
  { id: 'camembert', name: 'Camembert' }
];

const ProductionLineForm = ({ productionLine }) => {
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
  const { toast } = useToast();
  const { session } = useSupabaseAuth();

  const onSubmit = async (data) => {
    console.log('Submitting production data:', data);
    
    if (!session) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to submit production data",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Use the correct table name based on production line ID
      const tableName = productionLine.id === 1 ? 'production_line_international' : 'production_line_local';
      
      // Create submission data
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
        operator_id: data.operator_id,
        created_at: new Date().toISOString()
      };

      console.log('Submitting to table:', tableName, 'with data:', submissionData);

      const { error } = await supabase
        .from(tableName)
        .insert([submissionData])
        .select();

      if (error) {
        console.error('Error details:', error);
        throw error;
      }

      toast({
        title: "Production Record Created",
        description: `Successfully recorded production for Line ${productionLine.id}`,
      });
      
      reset();
    } catch (error) {
      console.error('Error submitting production data:', error);
      
      let errorMessage = "Failed to save production record";
      if (error.code === '42501') {
        errorMessage = "You don't have permission to add production records";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleCheeseTypeChange = (value) => {
    setValue('cheese_type', value);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="batchId">Batch ID</Label>
              <Input
                id="batchId"
                {...register("batch_id", { required: true })}
                placeholder="Enter batch ID"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateTime">Date and Time</Label>
              <Input
                id="dateTime"
                type="datetime-local"
                {...register("date_time", { required: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="milkVolume">Milk Volume Used (Liters)</Label>
              <Input
                id="milkVolume"
                type="number"
                step="0.1"
                {...register("milk_volume", { required: true, min: 0 })}
                placeholder="Enter milk volume"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cheeseType">Type of Cheese</Label>
              <Select onValueChange={handleCheeseTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select cheese type" />
                </SelectTrigger>
                <SelectContent>
                  {CHEESE_TYPES.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="starterCulture">Starter Culture</Label>
              <Input
                id="starterCulture"
                {...register("starter_culture", { required: true })}
                placeholder="Enter starter culture"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="starterQuantity">Starter Culture Quantity (g)</Label>
              <Input
                id="starterQuantity"
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
              <Label htmlFor="coagulantQuantity">Coagulant Quantity (ml)</Label>
              <Input
                id="coagulantQuantity"
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
              <Label htmlFor="processingTime">Processing Time (minutes)</Label>
              <Input
                id="processingTime"
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
              <Label htmlFor="operatorId">Operator Name/ID</Label>
              <Input
                id="operatorId"
                {...register("operator_id", { required: true })}
                placeholder="Enter operator name or ID"
              />
            </div>
          </div>

          <div className="mt-6">
            <Button type="submit" className="w-full">
              Record Production
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default ProductionLineForm;