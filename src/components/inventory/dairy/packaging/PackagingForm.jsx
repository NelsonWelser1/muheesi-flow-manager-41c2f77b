
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { PackagingSizes } from './data/constants';

const PackagingForm = ({ onSubmit, batchIds = [] }) => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const { toast } = useToast();
  const [selectedBatchId, setSelectedBatchId] = useState("");

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

  const handleBatchIdChange = (value) => {
    setSelectedBatchId(value);
    setValue("batchId", value);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Batch ID</Label>
          <Select onValueChange={handleBatchIdChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select batch ID" />
            </SelectTrigger>
            <SelectContent>
              {batchIds.map((id) => (
                <SelectItem key={id} value={id}>{id}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedBatchId && (
            <input type="hidden" {...register("batchId")} value={selectedBatchId} />
          )}
          {!selectedBatchId && (
            <Input 
              {...register("batchId", { required: true })} 
              placeholder="Or enter batch ID manually" 
              className="mt-2"
            />
          )}
        </div>

        <div className="space-y-2">
          <Label>Cheese Type</Label>
          <Input 
            {...register("cheeseType", { required: true })}
            placeholder="Enter cheese type"
          />
        </div>

        <div className="space-y-2">
          <Label>Package Size</Label>
          <Select onValueChange={(value) => setValue("packageSize", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select package size" />
            </SelectTrigger>
            <SelectContent>
              {PackagingSizes.map((size) => (
                <SelectItem key={size} value={size.toLowerCase()}>{size}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" {...register("packageSize")} />
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
