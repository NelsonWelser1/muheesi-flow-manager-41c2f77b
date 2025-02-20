import React from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Factory } from "lucide-react";

const ProductionLineForm = ({ productionLine }) => {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    console.log(data);
    toast({
      title: "Success",
      description: "Form submitted successfully",
    });
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl flex items-center gap-2">
          <Factory className="h-6 w-6" />
          {productionLine.name}
        </CardTitle>
        <div className="text-sm text-muted-foreground space-y-1">
          <p><strong>Manager:</strong> {productionLine.manager}</p>
          <p>{productionLine.description}</p>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="fromager_name">Fromager Name</Label>
            <Input id="fromager_name" defaultValue="John Doe" {...register("fromager_name", { required: 'This field is required' })} />
            {errors.fromager_name && <p className="text-red-500 text-sm">{errors.fromager_name.message}</p>}
          </div>
          <div>
            <Label htmlFor="cheese_type">Cheese Type</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select cheese type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cheddar">Cheddar</SelectItem>
                <SelectItem value="gouda">Gouda</SelectItem>
                <SelectItem value="parmesan">Parmesan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="batch_id">Batch ID</Label>
            <Input id="batch_id" placeholder="Enter batch ID" {...register("batch_id", { required: 'This field is required' })} />
            {errors.batch_id && <p className="text-red-500 text-sm">{errors.batch_id.message}</p>}
          </div>
          <div>
            <Label htmlFor="milk_volume">Milk Volume (L)</Label>
            <Input id="milk_volume" type="number" placeholder="Enter milk volume" {...register("milk_volume", { required: 'This field is required', valueAsNumber: true })} />
            {errors.milk_volume && <p className="text-red-500 text-sm">{errors.milk_volume.message}</p>}
          </div>
          <div>
            <Label htmlFor="start_time">Start Time</Label>
            <Input id="start_time" type="datetime-local" {...register("start_time", { required: 'This field is required' })} />
            {errors.start_time && <p className="text-red-500 text-sm">{errors.start_time.message}</p>}
          </div>
          <div>
            <Label htmlFor="estimated_duration">Estimated Duration (hrs)</Label>
            <Input id="estimated_duration" type="number" placeholder="Enter duration in hours" {...register("estimated_duration", { required: 'This field is required', valueAsNumber: true })} />
            {errors.estimated_duration && <p className="text-red-500 text-sm">{errors.estimated_duration.message}</p>}
          </div>
          <div>
            <Label htmlFor="starter_culture">Starter Culture</Label>
            <Input id="starter_culture" placeholder="Enter starter culture" {...register("starter_culture", { required: 'This field is required' })} />
            {errors.starter_culture && <p className="text-red-500 text-sm">{errors.starter_culture.message}</p>}
          </div>
          <div>
            <Label htmlFor="starter_quantity">Starter Quantity (g)</Label>
            <Input id="starter_quantity" type="number" placeholder="Enter quantity in grams" {...register("starter_quantity", { required: 'This field is required', valueAsNumber: true })} />
            {errors.starter_quantity && <p className="text-red-500 text-sm">{errors.starter_quantity.message}</p>}
          </div>
          <div>
            <Label htmlFor="coagulant_type">Coagulant Type</Label>
            <Input id="coagulant_type" placeholder="Enter coagulant type" {...register("coagulant_type", { required: 'This field is required' })} />
            {errors.coagulant_type && <p className="text-red-500 text-sm">{errors.coagulant_type.message}</p>}
          </div>
          <div>
            <Label htmlFor="coagulant_quantity">Coagulant Quantity (ml)</Label>
            <Input id="coagulant_quantity" type="number" placeholder="Enter quantity in ml" {...register("coagulant_quantity", { required: 'This field is required', valueAsNumber: true })} />
            {errors.coagulant_quantity && <p className="text-red-500 text-sm">{errors.coagulant_quantity.message}</p>}
          </div>
          <div>
            <Label htmlFor="processing_temperature">Processing Temperature (°C)</Label>
            <Input id="processing_temperature" type="number" placeholder="Enter temperature in Celsius" {...register("processing_temperature", { required: 'This field is required', valueAsNumber: true })} />
            {errors.processing_temperature && <p className="text-red-500 text-sm">{errors.processing_temperature.message}</p>}
          </div>
          <div>
            <Label htmlFor="processing_time">Processing Time (min)</Label>
            <Input id="processing_time" type="number" placeholder="Enter time in minutes" {...register("processing_time", { required: 'This field is required', valueAsNumber: true })} />
            {errors.processing_time && <p className="text-red-500 text-sm">{errors.processing_time.message}</p>}
          </div>
          <div>
            <Label htmlFor="expected_yield">Expected Yield (kg)</Label>
            <Input id="expected_yield" type="number" placeholder="Enter expected yield in kg" {...register("expected_yield", { required: 'This field is required', valueAsNumber: true })} />
            {errors.expected_yield && <p className="text-red-500 text-sm">{errors.expected_yield.message}</p>}
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input id="notes" type="text" placeholder="Enter notes" {...register("notes")} />
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductionLineForm;
