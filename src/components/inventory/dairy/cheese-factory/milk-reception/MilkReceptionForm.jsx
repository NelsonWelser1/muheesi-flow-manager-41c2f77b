import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useMilkReception } from '@/hooks/useMilkReception';

const MilkReceptionForm = () => {
  const { toast } = useToast();
  const { addMilkReception } = useMilkReception();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      await addMilkReception.mutateAsync({
        ...data,
        milkVolume: parseFloat(data.milkVolume),
        temperature: parseFloat(data.temperature),
        fatPercentage: parseFloat(data.fatPercentage),
        proteinPercentage: parseFloat(data.proteinPercentage),
        totalPlateCount: parseInt(data.totalPlateCount),
        acidity: parseFloat(data.acidity),
      });

      toast({
        title: "Success",
        description: "Milk reception data has been recorded",
      });
      reset();
    } catch (error) {
      console.error('Error submitting milk reception data:', error);
      toast({
        title: "Error",
        description: "Failed to record milk reception data",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="supplierName">Supplier Name/ID</Label>
          <Input
            id="supplierName"
            {...register("supplierName", { required: true })}
            placeholder="Enter supplier name or ID"
          />
          {errors.supplierName && <span className="text-red-500">This field is required</span>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="milkVolume">Milk Volume (Liters)</Label>
          <Input
            id="milkVolume"
            type="number"
            step="0.1"
            {...register("milkVolume", { required: true, min: 0 })}
            placeholder="Enter volume"
          />
          {errors.milkVolume && <span className="text-red-500">Please enter a valid volume</span>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="temperature">Temperature at Reception (°C)</Label>
          <Input
            id="temperature"
            type="number"
            step="0.1"
            {...register("temperature", { required: true })}
            placeholder="Enter temperature"
          />
          {errors.temperature && <span className="text-red-500">This field is required</span>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="fatPercentage">Fat Percentage (%)</Label>
          <Input
            id="fatPercentage"
            type="number"
            step="0.01"
            {...register("fatPercentage", { required: true, min: 0, max: 100 })}
            placeholder="Enter fat %"
          />
          {errors.fatPercentage && <span className="text-red-500">Please enter a valid percentage</span>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="proteinPercentage">Protein Percentage (%)</Label>
          <Input
            id="proteinPercentage"
            type="number"
            step="0.01"
            {...register("proteinPercentage", { required: true, min: 0, max: 100 })}
            placeholder="Enter protein %"
          />
          {errors.proteinPercentage && <span className="text-red-500">Please enter a valid percentage</span>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="totalPlateCount">Total Plate Count (CFU/ml)</Label>
          <Input
            id="totalPlateCount"
            type="number"
            {...register("totalPlateCount", { required: true, min: 0 })}
            placeholder="Enter TPC"
          />
          {errors.totalPlateCount && <span className="text-red-500">Please enter a valid count</span>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="acidity">Acidity (%)</Label>
          <Input
            id="acidity"
            type="number"
            step="0.01"
            {...register("acidity", { required: true, min: 0, max: 100 })}
            placeholder="Enter acidity"
          />
          {errors.acidity && <span className="text-red-500">Please enter a valid percentage</span>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes</Label>
          <Input
            id="notes"
            {...register("notes")}
            placeholder="Enter any additional notes"
          />
        </div>
      </div>

      <Button type="submit" className="w-full">Submit</Button>
    </form>
  );
};

export default MilkReceptionForm;
