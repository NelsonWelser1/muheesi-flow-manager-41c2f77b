import React from 'react';
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { CheeseTypes, PackagingSizes } from './data/constants';

const PackagingForm = ({ onSubmit }) => {
  const { register, handleSubmit, reset } = useForm();
  const { toast } = useToast();

  const handleFormSubmit = async (data) => {
    try {
      console.log('Packaging data:', data);
      onSubmit?.(data);
      toast({
        title: "Success",
        description: "Packaging details have been saved successfully.",
      });
      reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save packaging details.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Batch ID</Label>
          <Input {...register("batchId", { required: true })} placeholder="Enter batch ID" />
        </div>

        <div className="space-y-2">
          <Label>Cheese Type</Label>
          <Select onValueChange={(value) => register("cheeseType").onChange({ target: { value } })}>
            <SelectTrigger>
              <SelectValue placeholder="Select cheese type" />
            </SelectTrigger>
            <SelectContent>
              {CheeseTypes.map((type) => (
                <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Package Size</Label>
          <Select onValueChange={(value) => register("packageSize").onChange({ target: { value } })}>
            <SelectTrigger>
              <SelectValue placeholder="Select package size" />
            </SelectTrigger>
            <SelectContent>
              {PackagingSizes.map((size) => (
                <SelectItem key={size} value={size.toLowerCase()}>{size}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Quantity</Label>
          <Input 
            type="number" 
            {...register("quantity", { required: true, min: 1 })}
            placeholder="Enter quantity" 
          />
        </div>

        <div className="space-y-2">
          <Label>Package Material</Label>
          <Input {...register("packageMaterial")} placeholder="Enter package material" />
        </div>

        <div className="space-y-2">
          <Label>Package Weight (g)</Label>
          <Input 
            type="number" 
            {...register("packageWeight", { min: 0 })}
            placeholder="Enter package weight" 
          />
        </div>
      </div>

      <Button type="submit" className="w-full">Save Packaging Details</Button>
    </form>
  );
};

export default PackagingForm;
