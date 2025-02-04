import React from 'react';
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/supabase';

const CHEESE_TYPES = [
  { id: 'mozzarella', name: 'Mozzarella' },
  { id: 'gouda', name: 'Gouda' },
  { id: 'cheddar', name: 'Cheddar' },
  { id: 'feta', name: 'Feta' },
  { id: 'ricotta', name: 'Ricotta' },
  { id: 'camembert', name: 'Camembert' }
];

const ProductionLineForm = ({ productionLine }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { toast } = useToast();

  const onSubmit = async (data) => {
    console.log('Submitting production data:', { ...data, productionLineId: productionLine.id });
    
    try {
      const { error } = await supabase
        .from(`cheese_production_line_${productionLine.id}`)
        .insert([{
          ...data,
          production_line_id: productionLine.id,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;

      toast({
        title: "Production Record Created",
        description: `Successfully recorded production for Line ${productionLine.id}`,
      });
      
      reset();
    } catch (error) {
      console.error('Error submitting production data:', error);
      toast({
        title: "Error",
        description: "Failed to save production record",
        variant: "destructive",
      });
    }
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
              <Select onValueChange={(value) => register("cheese_type").onChange({ target: { value } })}>
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